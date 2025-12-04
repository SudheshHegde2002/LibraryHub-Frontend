import { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const addUser = async () => {
    await api.post('/users', { name, email });
    setName('');
    setEmail('');
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>

      <div>
        <input
          placeholder="User name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="User email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
