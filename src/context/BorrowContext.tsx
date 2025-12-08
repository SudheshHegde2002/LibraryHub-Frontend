import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';

interface BorrowedBookInfo {
  id: number;
  title: string;
  author_id: number;
  is_borrowed: boolean;
}

export interface BorrowedBook {
  id: number;
  user_id: number;
  book_id: number;
  borrowed_at: string;
  returned_at?: string | null;
  Books?: BorrowedBookInfo;
}

interface BorrowContextType {
  borrowedBooks: { [userId: number]: BorrowedBook[] };
  borrowedLoading: boolean;
  fetchBorrowedBooks: (userId: number) => Promise<void>;
  borrowBook: (userId: number, bookId: number, onSuccess?: () => void) => Promise<void>;
  returnBook: (bookId: number, userId: number, onSuccess?: () => void) => Promise<void>;
  refreshBorrowedBooks: (userId: number) => Promise<void>;
}

const BorrowContext = createContext<BorrowContextType | undefined>(undefined);

export const BorrowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<{ [userId: number]: BorrowedBook[] }>({});
  const [borrowedLoading, setBorrowedLoading] = useState(false);

  const fetchBorrowedBooks = useCallback(async (userId: number) => {
    if (borrowedBooks[userId]) return;
    
    setBorrowedLoading(true);
    try {
      const res = await api.get(`/borrow/user/${userId}`);
      setBorrowedBooks(prev => ({ ...prev, [userId]: res.data }));
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
      throw error;
    } finally {
      setBorrowedLoading(false);
    }
  }, [borrowedBooks]);

  const borrowBook = useCallback(async (userId: number, bookId: number, onSuccess?: () => void) => {
    await api.post('/borrow', { user_id: userId, book_id: bookId });
    
    setBorrowedBooks(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
    
    const res = await api.get(`/borrow/user/${userId}`);
    setBorrowedBooks(prev => ({ ...prev, [userId]: res.data }));
    
    if (onSuccess) onSuccess();
  }, []);

  const returnBook = useCallback(async (bookId: number, userId: number, onSuccess?: () => void) => {
    await api.post(`/borrow/return/${bookId}`);
    
    setBorrowedBooks(prev => ({
      ...prev,
      [userId]: prev[userId]?.filter(b => b.book_id !== bookId) || []
    }));
    
    if (onSuccess) onSuccess();
  }, []);

  const refreshBorrowedBooks = useCallback(async (userId: number) => {
    setBorrowedLoading(true);
    try {
      const res = await api.get(`/borrow/user/${userId}`);
      setBorrowedBooks(prev => ({ ...prev, [userId]: res.data }));
    } catch (error) {
      console.error('Failed to refresh borrowed books:', error);
      throw error;
    } finally {
      setBorrowedLoading(false);
    }
  }, []);

  const value: BorrowContextType = {
    borrowedBooks,
    borrowedLoading,
    fetchBorrowedBooks,
    borrowBook,
    returnBook,
    refreshBorrowedBooks,
  };

  return <BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>;
};

export const useBorrow = () => {
  const context = useContext(BorrowContext);
  if (context === undefined) {
    throw new Error('useBorrow must be used within a BorrowProvider');
  }
  return context;
};

