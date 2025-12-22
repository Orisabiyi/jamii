'use client'

import React, { useState } from 'react';
import { Search, LayoutGrid } from 'lucide-react';
import { store } from '@/lib/store';
import { Button } from '@/components/UI';
import { UserType } from '@/types/general';

export default function Page() {
  const [role, setRole] = useState<UserType | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-8">Choose Account Type</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-6 border-2 rounded-xl cursor-pointer ${role === 'renter' ? 'border-primary bg-primary/5' : 'border-gray-100'}`} onClick={() => setRole('renter')}>
            <Search className="w-6 h-6 mb-4 text-blue-600" />
            <h3 className="font-bold">Find a Place</h3>
          </div>
          <div className={`p-6 border-2 rounded-xl cursor-pointer ${role === 'owner' ? 'border-primary bg-primary/5' : 'border-gray-100'}`} onClick={() => setRole('owner')}>
            <LayoutGrid className="w-6 h-6 mb-4 text-green-600" />
            <h3 className="font-bold">List Property</h3>
          </div>
        </div>
        <Button className="w-full" disabled={!role} onClick={() => store.login(role)}>Create Account</Button>
      </div>
    </div>
  );
}