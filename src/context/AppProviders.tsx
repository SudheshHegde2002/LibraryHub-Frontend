import React, { ReactNode } from 'react';
import { AuthorsProvider } from './AuthorsContext';
import { BooksProvider } from './BooksContext';
import { UsersProvider } from './UsersContext';
import { BorrowProvider } from './BorrowContext';

/**
 * Combined provider component that wraps all context providers
 * This keeps the App component clean and makes it easy to add new providers
 */
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthorsProvider>
      <BooksProvider>
        <UsersProvider>
          <BorrowProvider>
            {children}
          </BorrowProvider>
        </UsersProvider>
      </BooksProvider>
    </AuthorsProvider>
  );
};

