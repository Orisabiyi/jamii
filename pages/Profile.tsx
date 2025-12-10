import React, { useState, useEffect } from 'react';
import { User, Property } from '../types';
import { db } from '../services/mockDatabase';
import { PropertyCard } from '../components/PropertyCard';
import { MapPin, Mail, Calendar, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  userId: string;
  currentUser: User | null;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ userId, currentUser, onBack }) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setLoading(true);
    setTimeout(() => {
      const user = db.getUserById(userId);
      const properties = db.getPropertiesByOwner(userId);
      setProfileUser(user || null);
      setUserProperties(properties);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleLike = (id: string) => {
    if (!currentUser) return;
    db.toggleLike(id, currentUser.id);
    // Refresh properties locally
    setUserProperties(prev => prev.map(p => {
      if (p.id === id) {
        const likes = p.likes.includes(currentUser.id) 
          ? p.likes.filter(uid => uid !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes };
      }
      return p;
    }));
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
    // Simplified refresh for prototype
    const updatedProps = db.getPropertiesByOwner(userId);
    setUserProperties(updatedProps);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="text-center pt-20">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover / Header Area */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
           <button 
             onClick={onBack}
             className="flex items-center gap-1 text-gray-500 hover:text-gray-900 mb-6 font-medium text-sm"
           >
             <ArrowLeft size={16} /> Back
           </button>

           <div className="flex flex-col items-center text-center">
             <div className="relative mb-4">
                <img 
                  src={profileUser.avatar} 
                  alt={profileUser.name} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white">
                  {profileUser.role}
                </div>
             </div>
             
             <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
             <p className="text-gray-500 mt-1 max-w-md mx-auto">{profileUser.bio || "No bio available."}</p>
             
             <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail size={16} /> {profileUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> Joined 2024
                </span>
             </div>
           </div>
           
           <div className="flex justify-center gap-8 mt-8 border-t border-gray-100 pt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{userProperties.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Following</div>
              </div>
           </div>
        </div>
      </div>

      {/* User's Properties */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <h2 className="font-bold text-lg text-gray-900 mb-4 px-1">
          {profileUser.id === currentUser?.id ? 'Your Listings' : `${profileUser.name}'s Listings`}
        </h2>
        
        {userProperties.length > 0 ? (
          <div className="space-y-6">
            {userProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onProfileClick={() => {}} // No-op since we are already on profile
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No properties listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};