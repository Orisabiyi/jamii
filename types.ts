export enum UserRole {
  RENTER = 'RENTER',
  OWNER = 'OWNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: 'Apartment' | 'House' | 'Room' | 'Studio';
  bedrooms: number;
  bathrooms: number;
  images: string[];
  video?: string;
  amenities: string[];
  likes: string[]; // array of userIds
  comments: Comment[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}