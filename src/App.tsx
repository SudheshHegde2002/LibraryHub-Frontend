import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Authors from './pages/Authors';
import Books from './pages/Books';
import Users from './pages/Users';
import Borrow from './pages/Borrow';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/authors" element={
        <ProtectedRoute><Authors /></ProtectedRoute>
      } />

      <Route path="/books" element={
        <ProtectedRoute><Books /></ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute><Users /></ProtectedRoute>
      } />

      <Route path="/borrow" element={
        <ProtectedRoute><Borrow /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
