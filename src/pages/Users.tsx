import { useEffect, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import { useUsers } from '../context/UsersContext';
import './Users.css';

export default function Users() {
  const { users, usersLoading, fetchUsers, addUser } = useUsers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddUser = async () => {
    if (!name.trim() || !email.trim()) return;
    try {
      await addUser(name, email);
      setName('');
      setEmail('');
      window.dispatchEvent(new CustomEvent('usersChanged'));
    } catch (error) {
      alert('Failed to add user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
              onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
            />
            <button 
              className="primary-btn" 
              onClick={handleAddUser}
              disabled={!name.trim() || !email.trim()}
            >
              Add User
            </button>
          </div>
        </div>

        <div className="table-container">
          {usersLoading ? (
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

                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
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
