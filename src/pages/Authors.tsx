import { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import { useAuthors } from "../context/AuthorsContext";
import "./Authors.css";

export default function Authors() {
  const { authors, authorsLoading, fetchAuthors, addAuthor, deleteAuthor } = useAuthors();
  const [name, setName] = useState("");

  const handleAddAuthor = async () => {
    if (!name.trim()) return;
    try {
      await addAuthor(name);
      setName("");
    } catch (error) {
      alert("Failed to add author");
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!window.confirm("Delete this author?")) return;
    try {
      await deleteAuthor(id);
    } catch (error) {
      alert("Failed to delete author");
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return (
    <AppLayout>
      <h1 className="page-header">Authors</h1>

      <div className="card">
        <div className="form-row">
          <input
            placeholder="Author name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddAuthor()}
          />
          <button onClick={handleAddAuthor} disabled={!name.trim()}>
            Add Author
          </button>
        </div>

        {authorsLoading ? (
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
                      onClick={() => handleDeleteAuthor(a.id)}
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
