import React, { useState } from 'react';
import { Home, MessageSquare, Bell, Search, Menu, X } from 'lucide-react';
import { User } from '@/types/general';
// import { store } from '@/lib/store';
import { Button, Input } from './UI';
import Image from 'next/image';

export const Navigation: React.FC<{ user: User | null }> = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Jamii</span>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full"><Home className="w-5 h-5 text-gray-600" /></button>
          {user ? (
            <>
              <button className="p-2 hover:bg-gray-100 rounded-full relative"><MessageSquare className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full"><Bell className="w-5 h-5 text-gray-600" /></button>
              <div className="flex items-center gap-2 ml-2 cursor-pointer hover:bg-gray-50 p-1 pr-3 rounded-full">
                <Image src={user.avatar} width={32} height={32} className="rounded-full border border-gray-200" alt="Profile" />
                <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4">
          <Input placeholder="Search..." />
          {!user && (
            <div className="flex flex-col gap-2">
              <Button variant="secondary">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
