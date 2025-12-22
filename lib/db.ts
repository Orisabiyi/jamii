
import { Property, User, UserRole } from '@/types/general';

const STORAGE_KEYS = {
  USERS: 'jamii_users',
  PROPERTIES: 'jamii_properties',
  CURRENT_USER: 'jamii_current_user',
};

// Initial Seed Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: UserRole.OWNER,
    avatar: 'https://picsum.photos/seed/sarah/150/150',
    bio: 'Real estate enthusiast and super host.',
    saved: []
  },
  {
    id: 'u2',
    name: 'Mike Ross',
    email: 'mike@example.com',
    role: UserRole.RENTER,
    avatar: 'https://picsum.photos/seed/mike/150/150',
    saved: ['p1']
  }
];

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    ownerName: 'Sarah Jenkins',
    ownerAvatar: 'https://picsum.photos/seed/sarah/150/150',
    title: 'Modern Loft in Downtown',
    description: 'Experience city living at its finest in this sun-drenched loft. Features exposed brick walls, 15ft ceilings, and a chef\'s kitchen. Just steps away from the best coffee shops and art galleries.',
    location: 'Downtown Arts District',
    price: 2400,
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    images: [
      'https://picsum.photos/seed/loft1/800/600',
      'https://picsum.photos/seed/loft2/800/600',
      'https://picsum.photos/seed/loft3/800/600',
    ],
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Pet Friendly'],
    likes: ['u2'],
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Mike Ross',
        userAvatar: 'https://picsum.photos/seed/mike/150/150',
        content: 'Is this available for long-term lease?',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    ownerId: 'u3', // Simulated other user
    ownerName: 'David Chen',
    ownerAvatar: 'https://picsum.photos/seed/david/150/150',
    title: 'Cozy Garden Cottage',
    description: 'Escape the noise in this peaceful garden cottage. Private entrance, lush greenery, and a newly renovated interior make this the perfect retreat for a solo professional or couple.',
    location: 'Silver Lake',
    price: 1850,
    type: 'House',
    bedrooms: 2,
    bathrooms: 1,
    images: [
      'https://picsum.photos/seed/garden1/800/600',
      'https://picsum.photos/seed/garden2/800/600',
    ],
    amenities: ['Garden', 'Parking', 'Washer/Dryer'],
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(MOCK_PROPERTIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
  }

  getProperties(): Property[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return data ? JSON.parse(data) : [];
  }

  getPropertiesByOwner(ownerId: string): Property[] {
    const all = this.getProperties();
    return all.filter(p => p.ownerId === ownerId);
  }

  getPropertyById(id: string): Property | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  addProperty(property: Property): void {
    const properties = this.getProperties();
    properties.unshift(property); // Add to top of feed
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }

  toggleLike(propertyId: string, userId: string): boolean {
    const properties = this.getProperties();
    const propertyIndex = properties.findIndex(p => p.id === propertyId);

    if (propertyIndex === -1) return false;

    const property = properties[propertyIndex];
    const likeIndex = property.likes.indexOf(userId);
    let isLiked = false;

    if (likeIndex > -1) {
      property.likes.splice(likeIndex, 1);
    } else {
      property.likes.push(userId);
      isLiked = true;
    }

    properties[propertyIndex] = property;
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return isLiked;
  }

  toggleSave(propertyId: string, userId: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return false;

    const user = users[userIndex];
    // Ensure saved array exists
    if (!user.saved) user.saved = [];

    const saveIndex = user.saved.indexOf(propertyId);
    let isSaved = false;

    if (saveIndex > -1) {
      user.saved.splice(saveIndex, 1);
    } else {
      user.saved.push(propertyId);
      isSaved = true;
    }

    users[userIndex] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update session if it's the current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.saved = user.saved;
      this.persistSession(currentUser);
    }

    return isSaved;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addComment(propertyId: string, comment: any): void {
    const properties = this.getProperties();
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      property.comments.push(comment);
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    }
  }

  getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  registerUser(user: User): User {
    const users = this.getUsers();
    user.saved = [];
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.persistSession(user);
    return user;
  }

  login(email: string): User | null {
    const user = this.getUserByEmail(email);
    if (user) {
      this.persistSession(user);
      return user;
    }
    return null;
  }

  persistSession(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export const db = new MockDatabase();
