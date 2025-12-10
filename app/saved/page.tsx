
'use client';

import React from 'react';
import DiscoverPage from '../page';
import { User } from '../../types';

interface SavedProps {
  user: User | null;
}

export default function SavedPage({ user }: SavedProps) {
  return (
    <div className="pt-20 text-center">
      <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
      {/* Reusing DiscoverPage logic for prototype */}
      <DiscoverPage user={user} />
    </div>
  );
}
