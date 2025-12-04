import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-glass">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title">LibraryHub</div>
            <div className="dashboard-subtitle">
              Library Management Dashboard
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <Link className="dashboard-link" to="/authors">
            <div className="dashboard-card">
              <div className="dashboard-icon">✍️</div>
              <div className="dashboard-label">Authors</div>
              <div className="dashboard-desc">
                Manage all book authors
              </div>
            </div>
          </Link>

          <Link className="dashboard-link" to="/books">
            <div className="dashboard-card">
              <div className="dashboard-icon">📚</div>
              <div className="dashboard-label">Books</div>
              <div className="dashboard-desc">
                View and manage books
              </div>
            </div>
          </Link>

          <Link className="dashboard-link" to="/users">
            <div className="dashboard-card">
              <div className="dashboard-icon">👤</div>
              <div className="dashboard-label">Users</div>
              <div className="dashboard-desc">
                Manage library users
              </div>
            </div>
          </Link>

          <Link className="dashboard-link" to="/borrow">
            <div className="dashboard-card">
              <div className="dashboard-icon">🔄</div>
              <div className="dashboard-label">Borrow</div>
              <div className="dashboard-desc">
                Borrow & return books
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
