import { Link } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="logo">LibraryHub</h2>
        <nav>
          <Link to="/authors">Authors</Link>
          <Link to="/books">Books</Link>
          <Link to="/users">Users</Link>
          <Link to="/borrow">Borrow</Link>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="logout"
        >
          Logout
        </button>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
