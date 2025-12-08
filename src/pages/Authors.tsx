import { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import { useAuthors } from "../context/AuthorsContext";
import "./Authors.css";

export default function Authors() {
  const { authors, authorsLoading, fetchAuthors, addAuthor, updateAuthor, deleteAuthor } = useAuthors();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddAuthor = async () => {
    if (!name.trim()) return;
    try {
      await addAuthor(name);
      setName("");
      window.dispatchEvent(new CustomEvent('authorsChanged'));
    } catch (error) {
      alert("Failed to add author");
    }
  };

  const handleEditAuthor = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveAuthor = async (id: number) => {
    if (!editingName.trim()) return;
    try {
      await updateAuthor(id, editingName);
      setEditingId(null);
      setEditingName("");
      window.dispatchEvent(new CustomEvent('authorsChanged'));
    } catch (error) {
      alert("Failed to update author");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!window.confirm("Delete this author? This will also delete all their books.")) return;
    try {
      await deleteAuthor(id);
      window.dispatchEvent(new CustomEvent('authorsChanged'));
  
      window.dispatchEvent(new CustomEvent('booksChanged'));
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
                  <td>
                    {editingId === a.id ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveAuthor(a.id)}
                        autoFocus
                      />
                    ) : (
                      a.name
                    )}
                  </td>
                  <td>
                    {editingId === a.id ? (
                      <>
                        <button
                          className="action-btn"
                          onClick={() => handleSaveAuthor(a.id)}
                          disabled={!editingName.trim()}
                        >
                          Save
                        </button>
                        <button
                          className="action-btn"
                          onClick={handleCancelEdit}
                          style={{ marginLeft: '8px' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn"
                          onClick={() => handleEditAuthor(a.id, a.name)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteAuthor(a.id)}
                          style={{ marginLeft: '8px' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
