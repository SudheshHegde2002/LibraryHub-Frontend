import { useEffect, useState } from 'react';
import api from '../api';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  const fetchBooks = async () => {
    const res = await api.get('/books');
    setBooks(res.data);
  };

  const fetchAuthors = async () => {
    const res = await api.get('/authors');
    setAuthors(res.data);
  };

  const addBook = async () => {
    await api.post('/books', {
      title,
      author_id: Number(authorId),
    });

    setTitle('');
    setAuthorId('');
    fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Books</h2>

      <div>
        <input
          placeholder="Book title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <select
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

        <button onClick={addBook}>Add Book</button>
      </div>

      <ul>
        {books.map(b => (
          <li key={b.id}>
            {b.title} — {b.Authors?.name}
            {' '}
            <button onClick={() => deleteBook(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
