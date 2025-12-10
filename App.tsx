import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Feed } from './pages/Feed';
import { CreateListing } from './pages/CreateListing';
import { Login } from './pages/Login';
import { db } from './services/mockDatabase';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('feed');

  useEffect(() => {
    // Check for persisted session
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('feed');
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed user={user} />;
      case 'create':
        return user ? (
          <CreateListing 
            user={user} 
            onSuccess={() => setCurrentPage('feed')} 
          />
        ) : <Login onLogin={handleLogin} />;
      case 'saved':
        // Reuse feed logic but filter for saved in a real app
        // Here we just show the feed component with a title for prototype
        return (
          <div className="pt-20 text-center">
            <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
            <Feed user={user} />
          </div>
        );
      case 'profile':
        return user ? (
          <div className="pt-24 px-4 text-center max-w-md mx-auto">
             <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-50" />
             <h2 className="text-2xl font-bold">{user.name}</h2>
             <p className="text-gray-500 mb-6">{user.role}</p>
             <p className="text-gray-600 italic">"{user.bio || 'No bio yet'}"</p>
             <button onClick={handleLogout} className="mt-8 text-red-600 font-medium">Sign Out</button>
          </div>
        ) : <Login onLogin={handleLogin} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      default:
        return <Feed user={user} />;
    }
  };

  if (currentPage === 'login' && !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar 
        user={user} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onLogout={handleLogout}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;