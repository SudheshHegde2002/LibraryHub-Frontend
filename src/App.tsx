import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Authors from './pages/Authors';
import Books from './pages/Books';
import Users from './pages/Users';
import Borrow from './pages/Borrow';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/books" element={<Books />} />
      <Route path="/users" element={<Users />} />
      <Route path="/borrow" element={<Borrow />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
