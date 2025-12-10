'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { PropertyCard } from './PropertyCard';
import { db } from '../lib/db';
import { Search, Filter, X } from 'lucide-react';
import { useAuth } from '../lib/authContext';

interface PropertyFeedProps {
  filterSaved?: boolean;
  userId?: string;
}

export default function PropertyFeed({ filterSaved = false, userId }: PropertyFeedProps) {
  const { user: currentUser, refreshUser } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dataVersion, setDataVersion] = useState(0);
  // const [refresh, setRefresh] = useState(0);

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minBeds: ''
  });

  // Compute properties directly from db
  const properties = useMemo(() => {
    // Force re-computation by reading dataVersion
    void dataVersion;

    let data = db.getProperties();

    // Filter by User's Saved Properties if on Saved Page
    if (filterSaved && userId) {
      const user = db.getUserById(userId);
      const savedIds = user?.saved || [];
      data = data.filter(p => savedIds.includes(p.id));
    }

    return data;
  }, [dataVersion, filterSaved, userId]);

  const triggerRefresh = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const handleLike = (id: string) => {
    if (!currentUser) {
      alert("Please login to like properties");
      return;
    }
    db.toggleLike(id, currentUser.id);
    triggerRefresh();
  };

  const handleSave = (id: string) => {
    if (!currentUser) {
      alert("Please login to save properties");
      return;
    }
    db.toggleSave(id, currentUser.id);
    refreshUser();
    triggerRefresh();
  };

  const handleComment = (id: string, content: string) => {
    if (!currentUser) return;

    db.addComment(id, {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString()
    });
    triggerRefresh();
  };

  const filteredProperties = properties.filter(p => {
    // ...existing code...
    // 1. Text Search
    const matchesSearch =
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Category Filter
    if (activeCategory === 'Apartments' && p.type !== 'Apartment') return false;
    if (activeCategory === 'Houses' && p.type !== 'House') return false;
    if (activeCategory === 'Rooms' && p.type !== 'Room') return false;
    if (activeCategory === 'Luxury' && p.price < 2000) return false;
    if (activeCategory === 'Budget' && p.price >= 1500) return false;

    // 3. Advanced Filters (from Modal)
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.minBeds && p.bedrooms < Number(filters.minBeds)) return false;

    return true;
  });

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', minBeds: '' });
    setShowFilters(false);
  };

  const activeFilterCount = [filters.minPrice, filters.maxPrice, filters.minBeds].filter(Boolean).length;

  return (
    // ...existing code...
    <div className="max-w-2xl mx-auto pt-20 px-4 relative">

      {!filterSaved && (
        <>
          {/* Search Bar */}
          <div className="mb-6 sticky top-20 z-10">
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                placeholder="Search city, neighborhood, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer group"
                onClick={() => setShowFilters(true)}
              >
                <div className="relative">
                  <Filter className={`h-5 w-5 transition-colors ${activeFilterCount > 0 ? 'text-indigo-600 fill-indigo-100' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories Row */}
          <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Apartments', 'Houses', 'Rooms', 'Luxury', 'Budget'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Feed */}
      <div className="space-y-6 pb-24">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              currentUser={currentUser}
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-2">No properties found matching your criteria.</p>
            {!filterSaved && (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                  clearFilters();
                }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (/mo)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full pl-6 p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-gray-900"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full pl-6 p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-gray-900"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Bedrooms</label>
                <div className="flex gap-2">
                  {['Any', '1', '2', '3+'].map((opt) => {
                    const value = opt === 'Any' ? '' : opt.replace('+', '');
                    const isSelected = filters.minBeds === value;
                    return (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, minBeds: value })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Show {filteredProperties.length} Homes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}