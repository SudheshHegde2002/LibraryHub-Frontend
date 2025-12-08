import { useEffect, useState, useMemo } from 'react';
import AppLayout from '../layout/AppLayout';
import { useAuthors } from '../context/AuthorsContext';
import { useBooks } from '../context/BooksContext';
import './Books.css';

export default function Books() {
  const { books, booksLoading, fetchBooks, addBook, updateBook, deleteBook, refreshBooks } = useBooks();
  const { authors, fetchAuthors, refreshAuthors } = useAuthors();

  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAuthorId, setEditingAuthorId] = useState('');

  const [filterAuthorId, setFilterAuthorId] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'borrowed'>('all');

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

  const handleEditBook = (id: number, currentTitle: string, currentAuthorId: number) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setEditingAuthorId(currentAuthorId.toString());
  };

  const handleSaveBook = async (id: number) => {
    if (!editingTitle.trim() || !editingAuthorId) return;
    try {
      await updateBook(id, editingTitle, Number(editingAuthorId));
      setEditingId(null);
      setEditingTitle('');
      setEditingAuthorId('');
      window.dispatchEvent(new CustomEvent('booksChanged'));
    } catch (error) {
      alert('Failed to update book');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingAuthorId('');
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

  const filteredBooks = useMemo(() => {
    return books.filter(book => {

      const matchesAuthor = !filterAuthorId ||
        book.author_id.toString() === filterAuthorId.toString();


      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'available' && !book.is_borrowed) ||
        (filterStatus === 'borrowed' && book.is_borrowed);

      return matchesAuthor && matchesStatus;
    });
  }, [books, filterAuthorId, filterStatus]);

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
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Add Book</h3>
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

        <div className="card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Filters</h3>
          <div className="form-row">
            <select
              className="select"
              value={filterAuthorId}
              onChange={e => setFilterAuthorId(e.target.value)}
            >
              <option value="">All Authors</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as 'all' | 'available' | 'borrowed')}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>

            <button
              className="primary-btn"
              onClick={() => {
                setFilterAuthorId('');
                setFilterStatus('all');
              }}
              style={{ backgroundColor: '#6c757d' }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="table-container">
          {booksLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              Loading books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              {books.length === 0 ? 'No books yet. Add one above.' : 'No books match the current filters.'}
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
                {filteredBooks.map(b => (
                  <tr key={b.id}>
                    <td>
                      {editingId === b.id ? (
                        <input
                          className="input"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveBook(b.id)}
                          autoFocus
                        />
                      ) : (
                        b.title
                      )}
                    </td>
                    <td>
                      {editingId === b.id ? (
                        <select
                          className="select"
                          value={editingAuthorId}
                          onChange={(e) => setEditingAuthorId(e.target.value)}
                        >
                          <option value="">Select Author</option>
                          {authors.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        b.Authors?.name || 'Unknown'
                      )}
                    </td>
                    <td>
                      <span className={`badge ${b.is_borrowed ? 'red' : 'green'}`}>
                        {b.is_borrowed ? 'Borrowed' : 'Available'}
                      </span>
                    </td>
                    <td>
                      {editingId === b.id ? (
                        <>
                          <button
                            className="primary-btn"
                            onClick={() => handleSaveBook(b.id)}
                            disabled={!editingTitle.trim() || !editingAuthorId}
                            style={{ fontSize: '14px', padding: '6px 12px' }}
                          >
                            Save
                          </button>
                          <button
                            className="danger-btn"
                            onClick={handleCancelEdit}
                            style={{ marginLeft: '8px', fontSize: '14px', padding: '6px 12px' }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="primary-btn"
                            onClick={() => handleEditBook(b.id, b.title, b.author_id)}
                            style={{ fontSize: '14px', padding: '6px 12px' }}
                          >
                            Edit
                          </button>
                          <button
                            className="danger-btn"
                            onClick={() => handleDeleteBook(b.id)}
                            style={{ marginLeft: '8px', fontSize: '14px', padding: '6px 12px' }}
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
      </div>
    </AppLayout>
  );
}
