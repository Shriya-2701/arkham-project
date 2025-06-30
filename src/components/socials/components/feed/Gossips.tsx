import React, { useState, useRef } from 'react';
import {
  Search, X, Shield, Paperclip, Users, MapPin
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';

// ✅ FIX: Get countries once, outside component
const countries = Country.getAllCountries();

interface Whisper {
  id: string;
  content: string;
  location: string;
  author: string;
  timestamp: string;
  verifications: number;
  developments: number;
  fromFollowed: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export const Gossips = () => {
  const [newWhisper, setNewWhisper] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAllWhispers, setShowAllWhispers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Country, State, City selection
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  const whispers: Whisper[] = [
    {
      id: '1',
      content: 'Tech CEO steps down amid internal conflict.',
      location: 'San Francisco',
      author: 'Insider',
      timestamp: '2024-03-15T10:30:00Z',
      verifications: 12,
      developments: 5,
      fromFollowed: true,
      media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop' }]
    },
    {
      id: '2',
      content: 'Art sale hints at financial trouble.',
      location: 'New York',
      author: 'Art Watcher',
      timestamp: '2024-03-15T09:15:00Z',
      verifications: 8,
      developments: 3,
      fromFollowed: true
    }
  ];

  const filteredWhispers = whispers
    .filter(w => showAllWhispers || w.fromFollowed)
    .filter(w => {
      const loc = w.location.toLowerCase();
      const countryName = countries.find(c => c.isoCode === selectedCountry)?.name.toLowerCase() || '';
      const stateName = states.find(s => s.isoCode === selectedState)?.name.toLowerCase() || '';
      const cityName = selectedCity.toLowerCase();

      if (selectedCountry && !loc.includes(countryName)) return false;
      if (selectedState && !loc.includes(stateName)) return false;
      if (selectedCity && !loc.includes(cityName)) return false;

      return true;
    })
    .filter(w =>
      w.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWhisper = () => {
    console.log('Submitted Whisper:', {
      content: newWhisper,
      files: selectedFiles
    });
    setNewWhisper('');
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-white" />
          <h2 className="text-xl text-white">Anonymous Whispers</h2>
        </div>
        <p className="text-white/70">
          Share and discover anonymous whispers about various happenings. All posts are encrypted and untraceable.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Country */}
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedState('');
              setSelectedCity('');
            }}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity('');
            }}
            disabled={!selectedCountry}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAllWhispers(!showAllWhispers)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showAllWhispers ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60'
            }`}
          >
            {showAllWhispers ? 'Show Following Only' : 'Show All Whispers'}
          </button>
        </div>
      </div>

      {/* Whisper Input */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <textarea
          value={newWhisper}
          onChange={e => setNewWhisper(e.target.value)}
          placeholder="Share your whisper..."
          className="w-full h-32 bg-black/40 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none"
        />
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative aspect-square bg-black/40 rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-white/60 hover:text-white"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Attach files</span>
            </button>
          </div>
          <button
            onClick={handleSubmitWhisper}
            disabled={!newWhisper.trim()}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 disabled:opacity-50"
          >
            Whisper
          </button>
        </div>
      </div>

      {/* Whispers List */}
      <div className="space-y-4">
        {filteredWhispers.map(w => (
          <div key={w.id} className="bg-black/20 border border-white/20 rounded-lg p-6">
            <div className="flex justify-between mb-4 text-white/60 text-sm">
              <span>{new Date(w.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-white mb-4">{w.content}</p>
            {w.media?.length && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {w.media.map((m, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    {m.type === 'image' ? (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex space-x-6 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{w.verifications} verifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>{w.developments} developments</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{w.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};