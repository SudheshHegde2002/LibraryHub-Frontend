import { useEffect, useState, useMemo, useRef } from 'react';
import AppLayout from '../layout/AppLayout';
import { useUsers } from '../context/UsersContext';
import { useBooks } from '../context/BooksContext';
import { useAuthors } from '../context/AuthorsContext';
import { useBorrow } from '../context/BorrowContext';
import './Borrow.css';

export default function Borrow() {
  const { users, fetchUsers, refreshUsers } = useUsers();
  const { books, fetchBooks, updateBookBorrowStatus, refreshBooks } = useBooks();
  const { authors, fetchAuthors, refreshAuthors } = useAuthors();
  const { borrowedBooks, borrowedLoading, fetchBorrowedBooks, borrowBook, returnBook, refreshBorrowedBooks } = useBorrow();

  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  
  const userIdRef = useRef(userId);
  
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const getAuthorName = (authorId: number | string) => {
    if (!authorId) return 'Unknown';
    
    const author = authors.find(a => 
      a.id === Number(authorId) || a.id.toString() === authorId.toString()
    );
    
    return author?.name || 'Unknown';
  };

  const availableBooks = useMemo(() => 
    books.filter(b => !b.is_borrowed), 
    [books]
  );


  const userBorrowedBooks = useMemo(() => 
    userId ? (borrowedBooks[Number(userId)] || []) : [],
    [userId, borrowedBooks]
  );


  const handleBorrowBook = async () => {
    if (!userId || !bookId) return;
    try {
      await borrowBook(Number(userId), Number(bookId), () => {
        updateBookBorrowStatus(Number(bookId), true);
      });
      setBookId('');
      window.dispatchEvent(new CustomEvent('booksChanged'));
    } catch (error) {
      alert('Failed to borrow book');
    }
  };

  const handleReturnBook = async (bookId: number) => {
    if (!window.confirm('Return this book?')) return;
    try {
      await returnBook(bookId, Number(userId), () => {
        updateBookBorrowStatus(bookId, false);
      });
      window.dispatchEvent(new CustomEvent('booksChanged'));
    } catch (error) {
      alert('Failed to return book');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchAuthors();
  }, [fetchUsers, fetchBooks, fetchAuthors]);

  useEffect(() => {
    if (userId) {
      fetchBorrowedBooks(Number(userId));
    }
  }, [userId, fetchBorrowedBooks]);

  useEffect(() => {
    const handleBooksChanged = () => {
      refreshBooks();
      if (userIdRef.current) {
        refreshBorrowedBooks(Number(userIdRef.current));
      }
    };
    const handleAuthorsChanged = () => {
      refreshAuthors();
      if (userIdRef.current) {
        refreshBorrowedBooks(Number(userIdRef.current));
      }
    };
    const handleUsersChanged = () => refreshUsers();

    window.addEventListener('booksChanged', handleBooksChanged);
    window.addEventListener('authorsChanged', handleAuthorsChanged);
    window.addEventListener('usersChanged', handleUsersChanged);

    return () => {
      window.removeEventListener('booksChanged', handleBooksChanged);
      window.removeEventListener('authorsChanged', handleAuthorsChanged);
      window.removeEventListener('usersChanged', handleUsersChanged);
    };
  }, [refreshBooks, refreshAuthors, refreshUsers, refreshBorrowedBooks]);

  return (
    <AppLayout>
      <div className="page-container">
        <h1 className="page-title">Borrow / Return Books</h1>

        <div className="card">
          <div className="form-row">
            <select 
              className="select"
              value={userId} 
              onChange={e => setUserId(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select 
              className="select"
              value={bookId} 
              onChange={e => setBookId(e.target.value)}
              disabled={!userId}
            >
              <option value="">Select Book</option>
              {availableBooks.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} - {getAuthorName(b.author_id)}
                </option>
              ))}
            </select>

            <button 
              className="primary-btn" 
              onClick={handleBorrowBook}
              disabled={!userId || !bookId}
            >
              Borrow Book
            </button>
          </div>
        </div>

        <div className="table-container">
          <h2 className="section-title">
            {userId ? `Borrowed Books (${userBorrowedBooks.length})` : 'Borrowed Books'}
          </h2>

          {!userId ? (
            <div className="empty-state-container">
              <p className="empty-state">
                Please select a user to view their borrowed books.
              </p>
            </div>
          ) : borrowedLoading ? (
            <div className="empty-state-container">
              <p className="empty-state">Loading borrowed books...</p>
            </div>
          ) : userBorrowedBooks.length === 0 ? (
            <div className="empty-state-container">
              <p className="empty-state">
                This user hasn't borrowed any books yet.
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Borrowed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userBorrowedBooks.map(b => (
                  <tr key={b.id}>
                    <td>{b.Books?.title || 'Unknown'}</td>
                    <td>{b.Books?.author_id ? getAuthorName(b.Books.author_id) : 'Unknown'}</td>
                    <td>{new Date(b.borrowed_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="primary-btn return-btn" 
                        onClick={() => handleReturnBook(b.book_id)}
                      >
                        Return
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
