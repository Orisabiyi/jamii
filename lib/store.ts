import { Property, StoreState, User } from "@/types/general";
import { create } from "zustand";

// --- MOCK DATA ---
export const MOCK_USER_RENTER: User = {
  id: "u1",
  name: "Tunde Johnson",
  handle: "@tunde_j",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde",
  type: "renter",
  verified: true,
  location: "Lagos, Nigeria",
};

export const MOCK_USER_OWNER: User = {
  id: "u2",
  name: "Chidi Properties",
  handle: "@chidi_properties",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi",
  type: "owner",
  verified: true,
  location: "Lekki, Lagos",
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Modern 2-Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: 1200000,
    currency: "₦",
    type: "apartment",
    listingType: "rent",
    specs: { beds: 2, baths: 2, sqm: 85 },
    amenities: ["24/7 Power", "Security", "Parking", "Water Treatment"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ],
    description: "Beautiful 2-bedroom apartment in the heart of Lekki Phase 1.",
    owner: MOCK_USER_OWNER,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    stats: { likes: 234, comments: 45, views: 1205 },
    isSaved: true,
  },
  {
    id: "p2",
    title: "Premium Bedspace - Female Hostel",
    location: "Yaba, Lagos",
    price: 250000,
    currency: "₦",
    type: "bedspace",
    listingType: "purchase_bedspace",
    specs: { beds: 1, baths: 2, bedspacesTotal: 4, bedspacesAvailable: 1 },
    amenities: ["WiFi", "Study Room", "Shared Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Own your space in Yaba! Premium bedspace purchase near UNILAG.",
    owner: {
      ...MOCK_USER_OWNER,
      name: "Student Haven",
      handle: "@student_haven",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    stats: { likes: 89, comments: 23, views: 560 },
  },
];

// export const store = {

//   navigate: (path: string, id?: string) => {
//     store.state.path = path;
//     if (id) store.state.propertyDetailId = id;
//     window.scrollTo(0, 0);
//     emitChange();
//   },
//   toggleLike: (id: string) => {
//     const prop = store.state.properties.find(p => p.id === id);
//     if (prop) {
//       prop.isLiked = !prop.isLiked;
//       prop.stats.likes += prop.isLiked ? 1 : -1;
//       emitChange();
//     }
//   },
//   addProperty: (property: Property) => {
//     store.state.properties = [property, ...store.state.properties];
//     emitChange();
//   }
// };

export const useStore = create<StoreState>((set) => ({
  user: null,
  path: "/",
  properties: INITIAL_PROPERTIES,
  propertyDetailId: null,

  login: (role) =>
    set(() => ({
      user: role === "renter" ? MOCK_USER_RENTER : MOCK_USER_OWNER,
      path: "/dashboard",
    })),
  logout: () =>
    set(() => ({
      user: null,
      path: "/login",
    })),
  navigate: (path, id) => {
    set({ path, propertyDetailId: id ?? null });
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  },
  toggleLike: (id) =>
    set((state) => ({
      properties: state.properties.map((p) => {
        if (p.id !== id) return p;
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          stats: { ...p.stats, likes: p.stats.likes + (isLiked ? 1 : -1) },
        };
      }),
    })),
  addProperty: (property) =>
    set((state) => ({
      properties: [property, ...state.properties],
    })),
}));
