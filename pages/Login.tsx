import React, { useState } from 'react';
import { db } from '../services/mockDatabase';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('sarah@example.com');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.login(email);
    if (user) {
      onLogin(user);
    } else {
      setError('User not found. Try sarah@example.com or mike@example.com');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            J
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Jamii</h1>
          <p className="text-gray-500 mt-2">Enter your details to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Prototype Hint:</p>
          <p className="mt-1">Use <span className="font-mono bg-gray-100 px-1 rounded">sarah@example.com</span> (Owner)</p>
          <p>Use <span className="font-mono bg-gray-100 px-1 rounded">mike@example.com</span> (Renter)</p>
        </div>
      </div>
    </div>
  );
};