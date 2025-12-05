import { useEffect, useState } from 'react';
import api from '../api';
import AppLayout from '../layout/AppLayout';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get('/users');
    setUsers(res.data);
    setLoading(false);
  };

  const addUser = async () => {
    if (!name.trim() || !email.trim()) return;
    await api.post('/users', { name, email });
    setName('');
    setEmail('');
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AppLayout>
      <div className="page-container">
        <h1 className="page-title">Users</h1>

        <div className="card">
          <div className="form-row">
            <input
              className="input"
              placeholder="User name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="User email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUser()}
            />
            <button 
              className="primary-btn" 
              onClick={addUser}
              disabled={!name.trim() || !email.trim()}
            >
              Add User
            </button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No users yet. Add one above.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button 
                        className="danger-btn" 
                        onClick={() => deleteUser(u.id)}
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
