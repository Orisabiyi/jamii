
'use client';

import React, { useState } from 'react';
import { db } from '../../services/mockDatabase';
import { User, UserRole } from '../../types';
import { Mail, ArrowRight, User as UserIcon, Check, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../hooks/useRouter';

interface LoginProps {
  onLogin: (user: User) => void;
}

type AuthStep = 'EMAIL' | 'OTP' | 'REGISTER';

export default function LoginPage({ onLogin }: LoginProps) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('EMAIL');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  // Registration State
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.RENTER);
  const [bio, setBio] = useState('');

  const SIMULATED_OTP = "123456";

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      alert(`Prototype: Your verification code is ${SIMULATED_OTP}`);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate OTP verification
    setTimeout(() => {
      if (otp !== SIMULATED_OTP) {
        setLoading(false);
        setError('Invalid code. Please try again.');
        return;
      }

      // Check if user exists
      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        // New user -> Registration
        setStep('REGISTER');
        setLoading(false);
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        role,
        bio,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`
      };

      const registeredUser = db.registerUser(newUser);
      onLogin(registeredUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-indigo-200">
            J
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'REGISTER' ? 'Create Profile' : 'Welcome to Jamii'}
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 'EMAIL' && 'Enter your email to continue'}
            {step === 'OTP' && `We sent a code to ${email}`}
            {step === 'REGISTER' && 'Tell us a bit about yourself'}
          </p>
        </div>

        {/* STEP 1: Email */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? 'Sending...' : 'Continue'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900 tracking-widest text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              className="w-full text-sm text-gray-500 hover:text-gray-900"
            >
              Change email
            </button>
          </form>
        )}

        {/* STEP 3: Registration */}
        {step === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.RENTER)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    role === UserRole.RENTER 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Find a place
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.OWNER)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    role === UserRole.OWNER 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  List properties
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900 text-sm"
                placeholder="Tell others a bit about you..."
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Complete Sign Up'}
              {!loading && <Check size={18} />}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
             {error}
          </div>
        )}
      </div>
    </div>
  );
}
