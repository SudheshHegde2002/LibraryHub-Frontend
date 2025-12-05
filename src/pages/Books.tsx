import { useEffect, useState } from 'react';
import api from '../api';
import AppLayout from '../layout/AppLayout';
import './Books.css';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    const res = await api.get('/books');
    setBooks(res.data);
    setLoading(false);
  };

  const fetchAuthors = async () => {
    const res = await api.get('/authors');
    setAuthors(res.data);
  };

  const addBook = async () => {
    if (!title.trim() || !authorId) return;
    await api.post('/books', {
      title,
      author_id: Number(authorId),
    });

    setTitle('');
    setAuthorId('');
    fetchBooks();
  };

  const deleteBook = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  return (
    <AppLayout>
      <div className="page-container">
        <h1 className="page-title">Books</h1>

        <div className="card">
          <div className="form-row">
            <input
              className="input"
              placeholder="Book title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBook()}
            />

            <select
              className="select"
              value={authorId}
              onChange={e => setAuthorId(e.target.value)}
            >
              <option value="">Select Author</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <button 
              className="primary-btn" 
              onClick={addBook}
              disabled={!title.trim() || !authorId}
            >
              Add Book
            </button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              Loading books...
            </div>
          ) : books.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No books yet. Add one above.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.Authors?.name || 'Unknown'}</td>
                    <td>
                      <span className={`badge ${b.is_borrowed ? 'red' : 'green'}`}>
                        {b.is_borrowed ? 'Borrowed' : 'Available'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="danger-btn" 
                        onClick={() => deleteBook(b.id)}
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
      </div>
    </AppLayout>
  );
}
