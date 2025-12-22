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

export interface StoreState {
  user: User | null
  path: string
  properties: Property[]
  propertyDetailId: string | null
  login: (role: UserType) => void
  logout: () => void;
  navigate: (path: string, id?: string) => void;
  toggleLike: (id: string) => void;
  addProperty: (property: Property) => void;
}