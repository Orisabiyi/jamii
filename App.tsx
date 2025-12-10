
import React, { useState, useEffect } from 'react';
import RootLayout from './app/layout';
import DiscoverPage from './app/page';
import CreateListingPage from './app/create/page';
import LoginPage from './app/login/page';
import ProfilePage from './app/profile/page';
import SavedPage from './app/saved/page';
import { db } from './services/mockDatabase';
import { User } from './types';
import { RouterContext } from './hooks/useRouter';

// Simple URL Parser for prototype
const parseUrl = (path: string) => {
  const [pathname, search] = path.split('?');
  const query: Record<string, string> = {};
  if (search) {
    search.split('&').forEach(part => {
      const [key, value] = part.split('=');
      query[key] = decodeURIComponent(value);
    });
  }
  return { pathname, query };
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState('/');
  
  // Initialize user
  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Router Implementation
  const { pathname, query } = parseUrl(currentPath);

  const routerValue = {
    pathname,
    query,
    push: (path: string) => {
      setCurrentPath(path);
      window.scrollTo(0, 0);
    },
    replace: (path: string) => {
      setCurrentPath(path);
      window.scrollTo(0, 0);
    },
    back: () => {
      // Simple back implementation (doesn't hold history in this simple mock)
      setCurrentPath('/');
    }
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    routerValue.push('/login');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    routerValue.push('/');
  };

  // Route Rendering
  const renderPage = () => {
    switch (pathname) {
      case '/':
        return <DiscoverPage user={user} />;
      case '/login':
        return <LoginPage onLogin={handleLogin} />;
      case '/create':
        return user ? <CreateListingPage user={user} /> : <LoginPage onLogin={handleLogin} />;
      case '/profile':
        return <ProfilePage currentUser={user} />;
      case '/saved':
        return <SavedPage user={user} />;
      default:
        return <DiscoverPage user={user} />;
    }
  };

  // If on login page, don't wrap in RootLayout (matches typical Next.js auth patterns)
  if (pathname === '/login') {
    return (
      <RouterContext.Provider value={routerValue}>
        {renderPage()}
      </RouterContext.Provider>
    );
  }

  return (
    <RouterContext.Provider value={routerValue}>
      <RootLayout user={user} onLogout={handleLogout}>
        {renderPage()}
      </RootLayout>
    </RouterContext.Provider>
  );
};

export default App;
