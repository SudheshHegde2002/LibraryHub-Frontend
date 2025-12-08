import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import api from '../api';
import { Author } from './AuthorsContext';

export interface Book {
  id: number;
  title: string;
  author_id: number;
  is_borrowed: boolean;
  Authors?: Author;
}

interface BooksContextType {
  books: Book[];
  booksLoading: boolean;
  fetchBooks: () => Promise<void>;
  addBook: (title: string, authorId: number) => Promise<void>;
  updateBook: (id: number, title: string, authorId: number) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  updateBookBorrowStatus: (bookId: number, isBorrowed: boolean) => void;
  refreshBooks: () => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksLoaded, setBooksLoaded] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (booksLoaded) return;
    
    setBooksLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data);
      setBooksLoaded(true);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error;
    } finally {
      setBooksLoading(false);
    }
  }, [booksLoaded]);

  const addBook = useCallback(async (title: string, authorId: number) => {
    const res = await api.post('/books', { title, author_id: authorId });
    setBooks(prev => [...prev, res.data]);
    const updated = await api.get('/books');
    setBooks(updated.data);
  }, []);

  const updateBook = useCallback(async (id: number, title: string, authorId: number) => {
    await api.put(`/books/${id}`, { title, author_id: authorId });
    const updated = await api.get('/books');
    setBooks(updated.data);
  }, []);

  const deleteBook = useCallback(async (id: number) => {
    await api.delete(`/books/${id}`);
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateBookBorrowStatus = useCallback((bookId: number, isBorrowed: boolean) => {
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, is_borrowed: isBorrowed } : b
    ));
  }, []);

  const refreshBooks = useCallback(async () => {
    setBooksLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data);
      setBooksLoaded(true);
    } catch (error) {
      console.error('Failed to refresh books:', error);
      throw error;
    } finally {
      setBooksLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthorsChanged = () => {
      if (booksLoaded) {
        refreshBooks();
      }
    };

    window.addEventListener('authorsChanged', handleAuthorsChanged);
    return () => window.removeEventListener('authorsChanged', handleAuthorsChanged);
  }, [booksLoaded, refreshBooks]);

  const value: BooksContextType = {
    books,
    booksLoading,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    updateBookBorrowStatus,
    refreshBooks,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

