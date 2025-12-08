import { useEffect, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import { useAuthors } from '../context/AuthorsContext';
import { useBooks } from '../context/BooksContext';
import './Books.css';

export default function Books() {
  const { books, booksLoading, fetchBooks, addBook, deleteBook, refreshBooks } = useBooks();
  const { authors, fetchAuthors, refreshAuthors } = useAuthors();

  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  const handleAddBook = async () => {
    if (!title.trim() || !authorId) return;
    try {
      await addBook(title, Number(authorId));
      setTitle('');
      setAuthorId('');
      window.dispatchEvent(new CustomEvent('booksChanged'));
    } catch (error) {
      alert('Failed to add book');
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      window.dispatchEvent(new CustomEvent('booksChanged'));
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [fetchBooks, fetchAuthors]);

  useEffect(() => {
    const handleAuthorsChanged = () => {
      refreshAuthors();
      refreshBooks();
    };

    window.addEventListener('authorsChanged', handleAuthorsChanged);
    return () => window.removeEventListener('authorsChanged', handleAuthorsChanged);
  }, [refreshAuthors, refreshBooks]);

  useEffect(() => {
    const handleBooksChanged = () => {
      refreshBooks();
    };

    window.addEventListener('booksChanged', handleBooksChanged);
    return () => window.removeEventListener('booksChanged', handleBooksChanged);
  }, [refreshBooks]);

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
              onKeyPress={(e) => e.key === 'Enter' && handleAddBook()}
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
              onClick={handleAddBook}
              disabled={!title.trim() || !authorId}
            >
              Add Book
            </button>
          </div>
        </div>

        <div className="table-container">
          {booksLoading ? (
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
                        onClick={() => handleDeleteBook(b.id)}
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
