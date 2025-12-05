import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';

export interface Author {
  id: number;
  name: string;
}

interface AuthorsContextType {
  authors: Author[];
  authorsLoading: boolean;
  fetchAuthors: () => Promise<void>;
  addAuthor: (name: string) => Promise<void>;
  deleteAuthor: (id: number) => Promise<void>;
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined);

export const AuthorsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);

  const fetchAuthors = useCallback(async () => {
    // Only skip if already loaded (regardless of length - might be legitimately empty)
    if (authorsLoaded) return;
    
    setAuthorsLoading(true);
    try {
      const res = await api.get('/authors');
      setAuthors(res.data);
      setAuthorsLoaded(true);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      throw error;
    } finally {
      setAuthorsLoading(false);
    }
  }, [authorsLoaded]);

  const addAuthor = useCallback(async (name: string) => {
    const res = await api.post('/authors', { name });
    setAuthors(prev => [...prev, res.data]);
  }, []);

  const deleteAuthor = useCallback(async (id: number) => {
    await api.delete(`/authors/${id}`);
    setAuthors(prev => prev.filter(a => a.id !== id));
  }, []);

  const value: AuthorsContextType = {
    authors,
    authorsLoading,
    fetchAuthors,
    addAuthor,
    deleteAuthor,
  };

  return <AuthorsContext.Provider value={value}>{children}</AuthorsContext.Provider>;
};

export const useAuthors = () => {
  const context = useContext(AuthorsContext);
  if (context === undefined) {
    throw new Error('useAuthors must be used within an AuthorsProvider');
  }
  return context;
};

