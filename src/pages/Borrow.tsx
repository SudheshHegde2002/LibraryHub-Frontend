import { useEffect, useState } from 'react';
import api from '../api';

export default function Borrow() {
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [borrowed, setBorrowed] = useState<any[]>([]);

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
    if (!uid) return;
    const res = await api.get(`/borrow/user/${uid}`);
    setBorrowed(res.data);
  };

  const borrowBook = async () => {
    await api.post('/borrow', {
      user_id: Number(userId),
      book_id: Number(bookId),
    });

    setBookId('');
    fetchBooks();
    fetchBorrowed(userId);
  };

  const returnBook = async (bookId: number) => {
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
    <div>
      <h2>Borrow / Return Books</h2>

      <div>
        <select value={userId} onChange={e => setUserId(e.target.value)}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select value={bookId} onChange={e => setBookId(e.target.value)}>
          <option value="">Select Book</option>
          {books.map(b => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <button onClick={borrowBook}>Borrow</button>
      </div>

      <h3>Borrowed Books</h3>

      <ul>
        {borrowed.map(b => (
          <li key={b.id}>
            {b.Books.title}
            <button onClick={() => returnBook(b.book_id)}>
              Return
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
