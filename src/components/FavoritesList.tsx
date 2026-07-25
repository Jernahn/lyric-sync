import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store';
import type { FavoriteSong } from '@/types';

interface FavoritesListProps {
  favorites: FavoriteSong[];
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites }) => {
  const { removeFavorite } = useAppStore();

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No favorite songs yet</p>
          <p className="text-sm text-gray-600 mt-1">
            Mark songs as favorites to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {favorites.map((song) => (
        <motion.div
          key={song.trackId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
        >
          <img
            src={song.albumArt}
            alt={song.trackName}
            className="w-12 h-12 rounded shadow"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{song.trackName}</p>
            <p className="text-xs text-gray-400 truncate">{song.artistName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => removeFavorite(song.trackId)}
            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-900/50 text-red-400 rounded transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
};
