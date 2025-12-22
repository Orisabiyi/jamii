import { useEffect, useState } from 'react';

// --- TYPES ---
export type UserType = 'renter' | 'owner' | null;

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  type: UserType;
  verified: boolean;
  location?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  type: 'apartment' | 'house' | 'bedspace';
  listingType: 'rent' | 'purchase_bedspace' | 'rent_bedspace';
  specs: {
    beds: number;
    baths: number;
    sqm?: number;
    bedspacesTotal?: number;
    bedspacesAvailable?: number;
  };
  amenities: string[];
  images: string[];
  description: string;
  owner: User;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

// --- MOCK DATA ---
export const MOCK_USER_RENTER: User = {
  id: 'u1',
  name: 'Tunde Johnson',
  handle: '@tunde_j',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
  type: 'renter',
  verified: true,
  location: 'Lagos, Nigeria'
};

export const MOCK_USER_OWNER: User = {
  id: 'u2',
  name: 'Chidi Properties',
  handle: '@chidi_properties',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi',
  type: 'owner',
  verified: true,
  location: 'Lekki, Lagos'
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Modern 2-Bedroom Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: 1200000,
    currency: '₦',
    type: 'apartment',
    listingType: 'rent',
    specs: { beds: 2, baths: 2, sqm: 85 },
    amenities: ['24/7 Power', 'Security', 'Parking', 'Water Treatment'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    description: 'Beautiful 2-bedroom apartment in the heart of Lekki Phase 1.',
    owner: MOCK_USER_OWNER,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    stats: { likes: 234, comments: 45, views: 1205 },
    isSaved: true,
  },
  {
    id: 'p2',
    title: 'Premium Bedspace - Female Hostel',
    location: 'Yaba, Lagos',
    price: 250000,
    currency: '₦',
    type: 'bedspace',
    listingType: 'purchase_bedspace',
    specs: { beds: 1, baths: 2, bedspacesTotal: 4, bedspacesAvailable: 1 },
    amenities: ['WiFi', 'Study Room', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    description: 'Own your space in Yaba! Premium bedspace purchase near UNILAG.',
    owner: { ...MOCK_USER_OWNER, name: 'Student Haven', handle: '@student_haven' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    stats: { likes: 89, comments: 23, views: 560 },
  }
];

// --- STORE ---
const listeners = new Set<() => void>();
const emitChange = () => listeners.forEach(l => l());

export const store = {
  state: {
    user: null as User | null,
    path: '/',
    properties: INITIAL_PROPERTIES,
    propertyDetailId: null as string | null,
  },

  login: (role: UserType) => {
    store.state.user = role === 'renter' ? MOCK_USER_RENTER : MOCK_USER_OWNER;
    store.state.path = '/dashboard';
    emitChange();
  },
  logout: () => {
    store.state.user = null;
    store.state.path = '/login';
    emitChange();
  },
  navigate: (path: string, id?: string) => {
    store.state.path = path;
    if (id) store.state.propertyDetailId = id;
    window.scrollTo(0, 0);
    emitChange();
  },
  toggleLike: (id: string) => {
    const prop = store.state.properties.find(p => p.id === id);
    if (prop) {
      prop.isLiked = !prop.isLiked;
      prop.stats.likes += prop.isLiked ? 1 : -1;
      emitChange();
    }
  },
  addProperty: (property: Property) => {
    store.state.properties = [property, ...store.state.properties];
    emitChange();
  }
};

export const useStore = () => {
  const [state, setState] = useState(store.state);
  useEffect(() => {
    const listener = () => setState({ ...store.state });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  return state;
};
