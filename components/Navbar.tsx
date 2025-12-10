
import React from 'react';
import { Compass, PlusSquare, User as UserIcon, LogOut, Heart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const currentPage = usePathname();
  const { user, logout } = useAuth();

  const onNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItemClass = (path: string) =>
    `p-3 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 ${currentPage === path
      ? 'text-indigo-600 bg-indigo-50 font-semibold'
      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Desktop/Tablet Header */}
      <header className="fixed top-0 inset-x-0 bg-white border-b border-gray-100 z-50 h-16 px-4 md:px-8 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('/')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            J
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight hidden md:block">Jamii</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate('/')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentPage === '/' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Compass size={20} />
            Discover
          </button>
          <button
            onClick={() => onNavigate('/saved')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentPage === '/saved' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Heart size={20} />
            Favorites
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'OWNER' && (
                <button
                  onClick={() => onNavigate('/create')}
                  className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                  <PlusSquare size={18} />
                  List Property
                </button>
              )}
              <div className="relative group">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 cursor-pointer"
                  onClick={() => onNavigate('/profile')}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => onNavigate('/login')}
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex justify-around p-2 pb-safe">
        <button onClick={() => onNavigate('/')} className={navItemClass('/')}>
          <Compass size={24} />
          <span className="text-[10px]">Discover</span>
        </button>

        {user?.role === 'OWNER' && (
          <button onClick={() => onNavigate('/create')} className={navItemClass('/create')}>
            <PlusSquare size={24} />
            <span className="text-[10px]">List</span>
          </button>
        )}

        <button onClick={() => onNavigate('/saved')} className={navItemClass('/saved')}>
          <Heart size={24} />
          <span className="text-[10px]">Saved</span>
        </button>

        <button onClick={() => onNavigate(user ? '/profile' : '/login')} className={navItemClass('/profile')}>
          <UserIcon size={24} />
          <span className="text-[10px]">{user ? 'Profile' : 'Login'}</span>
        </button>
      </nav>
    </>
  );
};
