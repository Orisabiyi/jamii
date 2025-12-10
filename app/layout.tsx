
import React from 'react';
import { Navbar } from '../components/Navbar';
import { User } from '../types';

interface RootLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export default function RootLayout({ children, user, onLogout }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-0">
      <Navbar user={user} onLogout={onLogout} />
      <main>
        {children}
      </main>
    </div>
  );
}
