import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersContextType {
  users: User[];
  usersLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (name: string, email: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (usersLoaded) return;
    
    setUsersLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setUsersLoaded(true);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    } finally {
      setUsersLoading(false);
    }
  }, [usersLoaded]);

  const addUser = useCallback(async (name: string, email: string) => {
    const res = await api.post('/users', { name, email });
    setUsers(prev => [...prev, res.data]);
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const value: UsersContextType = {
    users,
    usersLoading,
    fetchUsers,
    addUser,
    deleteUser,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

