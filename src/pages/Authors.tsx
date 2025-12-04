import { useEffect, useState } from 'react';
import api from '../api';

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetchAuthors = async () => {
    const res = await api.get('/authors');
    setAuthors(res.data);
  };

  const addAuthor = async () => {
    await api.post('/authors', { name });
    setName('');
    fetchAuthors();
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Authors</h2>

      <div>
        <input
          placeholder="Author name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={addAuthor}>Add Author</button>
      </div>

      <ul>
        {authors.map(a => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>
    </div>
  );
}
