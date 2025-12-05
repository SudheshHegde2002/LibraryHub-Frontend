import { useEffect, useState } from 'react';
import api from '../api';
import AppLayout from '../layout/AppLayout';
import './Borrow.css';

export default function Borrow() {
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [borrowed, setBorrowed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchBooks = async () => {
    const res = await api.get('/books');
    setBooks(res.data.filter((b: any) => !b.is_borrowed));
  };

  const fetchBorrowed = async (uid: string) => {
    if (!uid) {
      setBorrowed([]);
      return;
    }
    setLoading(true);
    const res = await api.get(`/borrow/user/${uid}`);
    setBorrowed(res.data);
    setLoading(false);
  };

  const borrowBook = async () => {
    if (!userId || !bookId) return;
    await api.post('/borrow', {
      user_id: Number(userId),
      book_id: Number(bookId),
    });

    setBookId('');
    fetchBooks();
    fetchBorrowed(userId);
  };

  const returnBook = async (bookId: number) => {
    if (!window.confirm('Return this book?')) return;
    await api.post(`/borrow/return/${bookId}`);
    fetchBooks();
    fetchBorrowed(userId);
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBorrowed(userId);
  }, [userId]);

  return (
    <AppLayout>
      <div className="page-container">
        <h1 className="page-title">Borrow / Return Books</h1>

        <div className="card">
          <div className="form-row">
            <select 
              className="select"
              value={userId} 
              onChange={e => setUserId(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select 
              className="select"
              value={bookId} 
              onChange={e => setBookId(e.target.value)}
              disabled={!userId}
            >
              <option value="">Select Book</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>

            <button 
              className="primary-btn" 
              onClick={borrowBook}
              disabled={!userId || !bookId}
            >
              Borrow Book
            </button>
          </div>
        </div>

        <div className="table-container">
          <h2 className="section-title">
            {userId ? `Borrowed Books (${borrowed.length})` : 'Borrowed Books'}
          </h2>

          {!userId ? (
            <div className="empty-state-container">
              <p className="empty-state">
                Please select a user to view their borrowed books.
              </p>
            </div>
          ) : loading ? (
            <div className="empty-state-container">
              <p className="empty-state">Loading borrowed books...</p>
            </div>
          ) : borrowed.length === 0 ? (
            <div className="empty-state-container">
              <p className="empty-state">
                This user hasn't borrowed any books yet.
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Borrowed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {borrowed.map(b => (
                  <tr key={b.id}>
                    <td>{b.Books?.title || 'Unknown'}</td>
                    <td>{b.Books?.Authors?.name || 'Unknown'}</td>
                    <td>{new Date(b.borrow_date).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="primary-btn return-btn" 
                        onClick={() => returnBook(b.book_id)}
                      >
                        Return
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
