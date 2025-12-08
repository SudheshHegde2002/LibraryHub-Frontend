import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
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
  updateAuthor: (id: number, name: string) => Promise<void>;
  deleteAuthor: (id: number) => Promise<void>;
  refreshAuthors: () => Promise<void>;
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined);

export const AuthorsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);

  const fetchAuthors = useCallback(async () => {
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

  const updateAuthor = useCallback(async (id: number, name: string) => {
    const res = await api.put(`/authors/${id}`, { name });
    console.log('Update Author Response:', res.data);
    console.log('Looking for ID:', id, 'Type:', typeof id);
    setAuthors(prev => {
      console.log('Current authors:', prev);
      const updated = prev.map(a => {
        const matches = a.id.toString() === id.toString();
        console.log(`Comparing ${a.id} (${typeof a.id}) with ${id} (${typeof id}): ${matches}`);
        return matches ? res.data : a;
      });
      console.log('Updated authors array:', updated);
      return updated;
    });
  }, []);

  const deleteAuthor = useCallback(async (id: number) => {
    await api.delete(`/authors/${id}`);
    setAuthors(prev => prev.filter(a => a.id.toString() !== id.toString()));
  }, []);

  const refreshAuthors = useCallback(async () => {
    setAuthorsLoading(true);
    try {
      const res = await api.get('/authors');
      setAuthors(res.data);
      setAuthorsLoaded(true);
    } catch (error) {
      console.error('Failed to refresh authors:', error);
      throw error;
    } finally {
      setAuthorsLoading(false);
    }
  }, []);

  

  const value: AuthorsContextType = {
    authors,
    authorsLoading,
    fetchAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    refreshAuthors,
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

