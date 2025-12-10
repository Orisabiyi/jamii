
import React, { useState } from 'react';
import { Heart, MessageCircle, MapPin, Bed, Bath, ChevronLeft, ChevronRight, Share2, Video, Bookmark, Check } from 'lucide-react';
import { Property, User } from '../types';
import { useRouter } from '../hooks/useRouter';

interface PropertyCardProps {
  property: Property;
  currentUser: User | null;
  onLike: (id: string) => void;
  onComment: (id: string, content: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, currentUser, onLike, onComment }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [justShared, setJustShared] = useState(false);

  const isLiked = currentUser && property.likes.includes(currentUser.id);

  const mediaItems = [
    ...(property.video ? [{ type: 'video' as const, url: property.video }] : []),
    ...property.images.map(img => ({ type: 'image' as const, url: img }))
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(property.id, commentText);
      setCommentText('');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out ${property.title} in ${property.location} on Jamii!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile?id=${property.ownerId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={handleProfileClick}
        >
          <img 
            src={property.ownerAvatar} 
            alt={property.ownerName} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 group-hover:ring-2 group-hover:ring-indigo-100 transition-all"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{property.ownerName}</h3>
            <p className="text-xs text-gray-500">{property.location}</p>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md font-medium">
          ${property.price}/mo
        </div>
      </div>

      {/* Media Carousel */}
      <div className="relative aspect-[4/3] bg-gray-100 group">
        {mediaItems[currentImageIndex].type === 'video' ? (
          <video 
            src={mediaItems[currentImageIndex].url}
            controls
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img 
            src={mediaItems[currentImageIndex].url} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {mediaItems.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {mediaItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors flex items-center justify-center ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Type Indicator Badge */}
        {mediaItems[currentImageIndex].type === 'video' && (
          <div className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full z-0 pointer-events-none">
             <Video size={14} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(property.id)}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-gray-600 hover:text-gray-900"
            >
              <MessageCircle size={24} />
            </button>
            <button 
              onClick={handleShare}
              className="text-gray-600 hover:text-gray-900 relative"
            >
              {justShared ? <Check size={24} className="text-green-600" /> : <Share2 size={24} />}
            </button>
          </div>
          <button 
            onClick={handleSave}
            className={`transition-colors ${isSaved ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-900">{property.likes.length} likes</span>
        </div>

        <div>
          <span className="font-semibold text-gray-900 text-sm mr-2">{property.ownerName}</span>
          <span className="text-gray-800 text-sm">{property.title} • {property.type}</span>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {property.description}
          </p>
        </div>

        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Bed size={16}/> {property.bedrooms} Bed</span>
          <span className="flex items-center gap-1"><Bath size={16}/> {property.bathrooms} Bath</span>
          <span className="flex items-center gap-1"><MapPin size={16}/> {property.location}</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 pb-4">
        {property.comments.length > 0 && !showComments && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-gray-500 text-sm mt-1 mb-2"
          >
            View all {property.comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="mt-2 space-y-3 mb-4 max-h-40 overflow-y-auto no-scrollbar">
            {property.comments.map(comment => (
              <div key={comment.id} className="flex gap-2 items-start text-sm">
                <span className="font-semibold text-gray-900 shrink-0">{comment.userName}</span>
                <span className="text-gray-700">{comment.content}</span>
              </div>
            ))}
          </div>
        )}

        {currentUser && (
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2 mt-2 border-t border-gray-100 pt-3">
            <img src={currentUser.avatar} alt="You" className="w-6 h-6 rounded-full" />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400 text-gray-900"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {commentText.trim() && (
              <button type="submit" className="text-indigo-600 font-semibold text-sm">
                Post
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
