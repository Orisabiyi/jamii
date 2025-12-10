import React, { useState, useRef } from 'react';
import { User } from '../types';
import { db } from '../services/mockDatabase';
import { generatePropertyDescription } from '../services/geminiService';
import { Sparkles, Upload, MapPin, DollarSign, Video, X } from 'lucide-react';

interface CreateListingProps {
  user: User;
  onSuccess: () => void;
}

export const CreateListing: React.FC<CreateListingProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: 'Apartment',
    bedrooms: '1',
    bathrooms: '1',
    description: '',
    amenities: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL
      // In a real app with Uploadthing/Cloudinary, you would upload here and get a secure URL
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview); // Clean up memory
    }
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.location) {
      alert("Please fill in the title and location first.");
      return;
    }
    
    setGeneratingAI(true);
    const desc = await generatePropertyDescription(
      formData.title,
      formData.type,
      formData.amenities.split(',').map(s => s.trim()),
      formData.location
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setGeneratingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      const newProperty = {
        id: `p${Date.now()}`,
        ownerId: user.id,
        ownerName: user.name,
        ownerAvatar: user.avatar,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        type: formData.type as any,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: [
          `https://picsum.photos/seed/${Date.now()}/800/600`,
          `https://picsum.photos/seed/${Date.now() + 1}/800/600`
        ], // Mock images for prototype
        video: videoPreview || undefined,
        amenities: formData.amenities.split(',').map(s => s.trim()),
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };

      db.addProperty(newProperty);
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto pt-20 pb-24 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List Your Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
              placeholder="e.g., Sunny Downtown Loft"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (/mo)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full pl-9 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                  placeholder="2000"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                name="type"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Room</option>
                <option>Studio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                required
                className="w-full pl-9 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                placeholder="City, Neighborhood"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-900"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-900"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
             </div>
          </div>

        </div>

        {/* AI Description Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={generatingAI}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
            >
              <Sparkles size={14} />
              {generatingAI ? 'Writing...' : 'Auto-Write with AI'}
            </button>
          </div>
          
          <textarea
            name="description"
            rows={4}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-900"
            placeholder="Describe your property..."
            value={formData.description}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
            <input
              type="text"
              name="amenities"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-900"
              placeholder="Wifi, Gym, Pool..."
              value={formData.amenities}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="space-y-4">
          {/* Photos (Mock) */}
          <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center py-8 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-indigo-50 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="font-medium text-gray-900">Upload Photos</p>
            <p className="text-sm text-gray-500 mt-1">Mock upload for prototype</p>
          </div>

          {/* Video Upload */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="block text-sm font-medium text-gray-700">Property Video</h3>
            
            {!videoPreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="bg-indigo-50 p-3 rounded-full mb-3">
                  <Video className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="font-medium text-gray-900">Upload Video Tour</p>
                <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 50MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video 
                  src={videoPreview} 
                  controls 
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-3 right-3 bg-red-600/90 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleVideoSelect}
              accept="video/*"
              className="hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          {loading ? 'Publishing...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
};