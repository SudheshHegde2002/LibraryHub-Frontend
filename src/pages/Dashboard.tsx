import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>LibraryHub Dashboard</h2>

      <nav>
        <Link to="/authors">Authors</Link> |{" "}
        <Link to="/books">Books</Link> |{" "}
        <Link to="/users">Users</Link> |{" "}
        <Link to="/borrow">Borrow</Link>
      </nav>

      <br />

      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}>
        Logout
      </button>
    </div>
  );
}
