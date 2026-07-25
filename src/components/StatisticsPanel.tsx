import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store';
import type { PlaybackStats } from '@/types';

const defaultStats: PlaybackStats = {
  songsPlayed: 0,
  listeningHours: 0,
  mostPlayedArtists: [],
  dailyListeningTime: {},
  weeklyListeningTime: {},
  monthlyListeningTime: {},
};

export const StatisticsPanel: React.FC = () => {
  const { stats } = useAppStore();
  const [displayStats] = useState(stats || defaultStats);

  const topArtists = displayStats.mostPlayedArtists.slice(0, 5);
  const maxPlays = Math.max(...topArtists.map((a) => a.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-y-auto p-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-6">Listening Statistics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-spotify to-green-700 rounded-lg p-6 text-white"
        >
          <p className="text-sm font-semibold opacity-90 mb-1">Songs Played</p>
          <p className="text-3xl font-bold">{displayStats.songsPlayed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white"
        >
          <p className="text-sm font-semibold opacity-90 mb-1">Listening Hours</p>
          <p className="text-3xl font-bold">{displayStats.listeningHours.toFixed(1)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-6 text-white"
        >
          <p className="text-sm font-semibold opacity-90 mb-1">Top Artists</p>
          <p className="text-3xl font-bold">{topArtists.length}</p>
        </motion.div>
      </div>

      {/* Top Artists */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-spotify" />
          Top Artists
        </h3>
        <div className="space-y-3">
          {topArtists.map((artist, index) => (
            <motion.div
              key={artist.artist}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{artist.artist}</p>
              </div>
              <div className="w-24 bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(artist.count / maxPlays) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-spotify to-green-500"
                />
              </div>
              <p className="text-sm text-gray-400 w-8">{artist.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
