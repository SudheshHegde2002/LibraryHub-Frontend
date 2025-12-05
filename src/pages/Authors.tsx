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
      <h1 className="page-header">Authors</h1>

      <div className="card">
        <div className="form-row">
          <input
            placeholder="Author name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAuthor()}
          />
          <button onClick={addAuthor} disabled={!name.trim()}>
            Add Author
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading authors...</div>
        ) : authors.length === 0 ? (
          <div className="loading">No authors yet. Add one above.</div>
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
