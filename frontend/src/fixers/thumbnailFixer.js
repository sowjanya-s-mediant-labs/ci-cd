// Global fixer for bad image URLs ending with .pngjpg
// It probes the correct extension (.png first, then .jpg) and replaces the src.

function probe(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function resolveAndFix(img) {
  if (!img || img.dataset.extFixed === "1") return;
  const src = img.getAttribute("src") || "";
  // Only handle explicit .pngjpg at the end
  if (!/\.pngjpg$/i.test(src)) return;
  img.dataset.extFixed = "1";

  const base = src.replace(/\.pngjpg$/i, "");
  const png = `${base}.png`;
  const jpg = `${base}.jpg`;

  const okPng = await probe(png);
  if (okPng) {
    img.src = png;
    img.style.display = "";
    return;
  }
  const okJpg = await probe(jpg);
  if (okJpg) {
    img.src = jpg;
    img.style.display = "";
    return;
  }
  // Neither worked: leave as-is but unhide to avoid permanent invisible elements
  img.style.display = "";
}

function scan(root = document) {
  const imgs = root.querySelectorAll('img[src$=".pngjpg"]');
  imgs.forEach((img) => resolveAndFix(img));
}

function setupObserver() {
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === "IMG") {
            resolveAndFix(node);
          }
          // Scan subtree for any images
          scan(node);
        });
      } else if (m.type === "attributes" && m.target.tagName === "IMG" && m.attributeName === "src") {
        resolveAndFix(m.target);
      }
    }
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    scan();
    setupObserver();
  });
} else {
  scan();
  setupObserver();
}

