import { useEffect, useState } from "react";
import api from "../api";
import AppLayout from "../layout/AppLayout";
import "./Authors.css";

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await api.get("/authors");
    setAuthors(res.data);
    setLoading(false);
  };

  const addAuthor = async () => {
    if (!name.trim()) return;
    await api.post("/authors", { name });
    setName("");
    fetchAuthors();
  };

  const deleteAuthor = async (id: number) => {
    if (!window.confirm("Delete this author?")) return;
    await api.delete(`/authors/${id}`);
    fetchAuthors();
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <AppLayout>
      <div className="page-header">Authors</div>

      <div className="card">
        <div className="form-row">
          <input
            placeholder="Author name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addAuthor}>Add</button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.name}</td>
                  <td>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteAuthor(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
