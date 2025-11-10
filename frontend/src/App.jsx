import { useEffect, useState } from "react";
import Thumbnail from "./components/Thumbnail.jsx";
import { getPeople, createPerson, updatePerson, deletePerson } from "./api";

function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await getPeople();
    setPeople(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await updatePerson(editId, { ...form, age: Number(form.age) });
      setEditId(null);
    } else {
      await createPerson({ ...form, age: Number(form.age) });
    }
    setForm({ name: "", age: "" });
    loadData();
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, age: p.age });
  };

  const handleDelete = async (id) => {
    await deletePerson(id);
    loadData();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>People Manager</h1>
      {/* Example thumbnail: tries .png then .jpg at /thumbnails/demo/1 */}
      <div style={{ marginBottom: "16px" }}>
        <Thumbnail dir="demo" id={1} alt="Demo thumbnail" style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }} />
      </div>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>

      <ul style={{ marginTop: "20px" }}>
        {people.map((p) => (
          <li key={p.id} style={{ marginBottom: "6px" }}>
            {p.name} ({p.age})
            <button style={{ marginLeft: "10px" }} onClick={() => handleEdit(p)}>Edit</button>
            <button style={{ marginLeft: "10px" }} onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
