import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Feed } from './pages/Feed';
import { CreateListing } from './pages/CreateListing';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { db } from './services/mockDatabase';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('discover');
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);

  useEffect(() => {
    // Check for persisted session
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('discover');
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setCurrentPage('login');
    setViewProfileId(null);
  };

  const handleViewProfile = (userId: string) => {
    setViewProfileId(userId);
    setCurrentPage('view_profile');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'discover':
      case 'feed': // Fallback for legacy state
        return <Feed user={user} onProfileClick={handleViewProfile} />;
      
      case 'create':
        return user ? (
          <CreateListing 
            user={user} 
            onSuccess={() => setCurrentPage('discover')} 
          />
        ) : <Login onLogin={handleLogin} />;
      
      case 'saved':
        // Reuse feed logic but filter for saved in a real app
        // Here we just show the feed component with a title for prototype
        return (
          <div className="pt-20 text-center">
            <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
            <Feed user={user} onProfileClick={handleViewProfile} />
          </div>
        );
      
      case 'profile':
        // Navigate to Current User's profile
        if (user) {
          return <Profile userId={user.id} currentUser={user} onBack={() => setCurrentPage('discover')} />;
        }
        return <Login onLogin={handleLogin} />;
      
      case 'view_profile':
        if (viewProfileId) {
          return <Profile userId={viewProfileId} currentUser={user} onBack={() => setCurrentPage('discover')} />;
        }
        return <Feed user={user} onProfileClick={handleViewProfile} />;

      case 'login':
        return <Login onLogin={handleLogin} />;
      
      default:
        return <Feed user={user} onProfileClick={handleViewProfile} />;
    }
  };

  if (currentPage === 'login' && !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar 
        user={user} 
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page === 'profile' && user) {
            setViewProfileId(user.id);
          }
        }} 
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