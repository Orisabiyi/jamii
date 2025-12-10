
import { createContext, useContext } from 'react';

// This simulates the Next.js App Router navigation interface
export interface RouterContextType {
  pathname: string;
  query: Record<string, string>;
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
}

export const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  query: {},
  push: () => {},
  replace: () => {},
  back: () => {},
});

export const useRouter = () => useContext(RouterContext);
