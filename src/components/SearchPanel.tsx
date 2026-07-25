import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { lyricsService } from '@/services/LyricsService';
import type { SearchResult } from '@/types';

export const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'artist' | 'track'>('track');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Mock search - integrate with real search API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResults([]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col p-6 space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Search Lyrics</h2>
        <div className="flex gap-2 mb-4">
          {(['artist', 'track'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                searchType === type
                  ? 'bg-spotify text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Search by ${searchType}...`}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spotify transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-2 bg-spotify hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSearching ? (
            <div className="animate-spin inline-block">
              <Search className="w-4 h-4" />
            </div>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {results.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
            >
              <img
                src={result.albumArt}
                alt={result.trackName}
                className="w-10 h-10 rounded shadow"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{result.trackName}</p>
                <p className="text-xs text-gray-400 truncate">{result.artistName}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isSearching && results.length === 0 && query && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </motion.div>
  );
};
