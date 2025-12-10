import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Property, User } from '../types';
import { db } from '../services/mockDatabase';
import { Search, Filter } from 'lucide-react';

interface FeedProps {
  user: User | null;
}

export const Feed: React.FC<FeedProps> = ({ user }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const data = db.getProperties();
    setProperties(data);
  }, [refresh]);

  const handleLike = (id: string) => {
    if (!user) {
      alert("Please login to like properties");
      return;
    }
    db.toggleLike(id, user.id);
    setRefresh(prev => prev + 1); // Trigger reload
  };

  const handleComment = (id: string, content: string) => {
    if (!user) return;
    
    db.addComment(id, {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString()
    });
    setRefresh(prev => prev + 1);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.location.toLowerCase().includes(search.toLowerCase()) || 
      p.title.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Apartments') return p.type === 'Apartment';
    if (activeCategory === 'Houses') return p.type === 'House';
    if (activeCategory === 'Rooms') return p.type === 'Room';
    if (activeCategory === 'Luxury') return p.price >= 2000;
    if (activeCategory === 'Budget') return p.price < 1500;

    return true;
  });

  return (
    <div className="max-w-2xl mx-auto pt-20 pb-20 px-4">
      {/* Search Bar */}
      <div className="mb-6 sticky top-20 z-10">
        <div className="relative shadow-sm rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            placeholder="Search city, neighborhood, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
             <Filter className="h-5 w-5 text-gray-400 cursor-pointer hover:text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Stories / Categories Row (Visual Enhancement) */}
      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
        {['All', 'Apartments', 'Houses', 'Rooms', 'Luxury', 'Budget'].map((cat, idx) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              currentUser={user}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};