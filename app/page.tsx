'use client';

import { MapPin, DollarSign, LayoutGrid } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PropertyCard } from '../components/PropertyCard';

export default function Page() {
  const { properties } = useStore();

  return (
    <section className="pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar text-black">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium whitespace-nowrap"><MapPin className="w-3.5 h-3.5" /> Lagos</button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium whitespace-nowrap"><DollarSign className="w-3.5 h-3.5" /> Price</button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium whitespace-nowrap"><LayoutGrid className="w-3.5 h-3.5" /> Type</button>
        </div>
      </div>
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
    </section>
  );
};
