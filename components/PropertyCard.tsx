import React from 'react';
import { Heart, MessageSquare, Share2, Bookmark, CheckCircle2, BedDouble, Bath, MoreHorizontal } from 'lucide-react';
import { Property, store } from '../lib/store';
import { Button } from './UI';
import Image from 'next/image';

export const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const isPurchase = property.listingType === 'purchase_bedspace';

  // const timeAgo = (dateStr: string) => {
  //   const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
  //   if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  //   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  //   return `${Math.floor(seconds / 86400)}d ago`;
  // };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={property.owner.avatar} width={36} height={36} className="rounded-full" alt={property.owner.name} />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-gray-900">{property.owner.handle}</span>
              {property.owner.verified && <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500" />}
            </div>
            <p className="text-xs text-gray-500">{property.location}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="aspect-[4/3] w-full bg-gray-100 relative cursor-pointer" onClick={() => store.navigate('/properties/view', property.id)}>
        <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`${isPurchase ? 'bg-purple-600' : 'bg-primary'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {isPurchase ? 'BEDSPACE PURCHASE' : 'FOR RENT'}
          </span>
        </div>
      </div>

      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className={`${property.isLiked ? 'text-red-500' : 'text-gray-600'}`} onClick={() => store.toggleLike(property.id)}>
            <Heart className={`w-6 h-6 ${property.isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="text-gray-600"><MessageSquare className="w-6 h-6" /></button>
          <button className="text-gray-600"><Share2 className="w-6 h-6" /></button>
        </div>
        <button className="text-gray-600"><Bookmark className={`w-6 h-6 ${property.isSaved ? 'fill-gray-900' : ''}`} /></button>
      </div>

      <div className="px-4 pb-4">
        <h3 className="font-semibold text-gray-900 leading-tight mb-1 cursor-pointer" onClick={() => store.navigate('/properties/view', property.id)}>
          {property.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {property.specs.beds} bed</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.specs.baths} bath</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-lg font-bold text-primary-dark">{property.currency}{property.price.toLocaleString()}</span>
          <Button variant="secondary" className="px-3 py-1 text-sm h-8" onClick={() => store.navigate('/properties/view', property.id)}>View</Button>
        </div>
      </div>
    </div>
  );
};
