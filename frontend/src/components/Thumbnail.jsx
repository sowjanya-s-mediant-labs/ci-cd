import { useEffect, useMemo, useRef, useState } from "react";

// Thumbnail component that determines extension by trying .png then .jpg
// Props:
// - dir: subfolder under basePath (e.g., "demo")
// - id: identifier without extension (e.g., 1)
// - basePath: default "/thumbnails"
// - exts: extensions to try in order, default ["png", "jpg"]
// - alt: alt text
// - className, style: pass-through for <img>
// - onResolved: callback with the resolved url once loaded
export default function Thumbnail({
  dir,
  id,
  basePath = "/thumbnails",
  exts,
  alt = "thumbnail",
  className,
  style,
  onResolved,
}) {
  const host = import.meta.env.VITE_THUMB_BASE || ""; // e.g., "http://localhost:5174"
  // Allow env to control extension preference, e.g., "jpg,png" or "jpg,png,webp"
  const envExts = (import.meta.env.VITE_THUMB_EXTS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const finalExts = Array.isArray(exts) && exts.length > 0 ? exts : (envExts.length ? envExts : ["jpg", "png"]);

  // Normalize id to avoid accidental extensions (e.g., "1.png" -> "1")
  const cleanId = useMemo(() => String(id ?? "").replace(/\.(png|jpg)$/i, ""), [id]);

  const candidates = useMemo(() => {
    if (!dir || !cleanId) return [];
    const base = `${host}${basePath}/${dir}/${cleanId}`;
    return finalExts.map((e) => `${base}.${e}`);
  }, [host, basePath, dir, cleanId, finalExts]);

  const probeRef = useRef(null);
  const [resolved, setResolved] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Resolve by probing images off-DOM to avoid flicker and bad src chains
    if (!candidates.length) {
      setResolved(null);
      return;
    }
    setLoading(true);
    let active = true;
    let i = 0;
    const tryNext = () => {
      if (!active || i >= candidates.length) {
        if (active) setResolved(null);
        setLoading(false);
        return;
      }
      const url = candidates[i++];
      const img = new Image();
      probeRef.current = img;
      img.onload = () => {
        if (!active) return;
        setResolved(url);
        setLoading(false);
        if (onResolved) onResolved(url);
      };
      img.onerror = () => {
        if (!active) return;
        tryNext();
      };
      img.src = url;
    };
    tryNext();
    return () => {
      active = false;
      // Prevent event handlers firing after unmount
      if (probeRef.current) {
        probeRef.current.onload = null;
        probeRef.current.onerror = null;
      }
    };
  }, [candidates, onResolved]);

  if (!resolved) {
    return (
      <div className={className} style={{ width: 120, height: 80, background: "#eee", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#777", fontSize: 12, ...(style || {}) }}>
        {loading ? "Loading..." : "No thumbnail"}
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}
