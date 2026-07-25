import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from 'lucide-react';
import { useSpotifyService } from '@/hooks/useSpotifyService';

export const PlaybackControls: React.FC = () => {
  const { currentPlayback, play, pause, nextTrack, previousTrack } = useSpotifyService();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    return `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
  };

  if (!currentPlayback?.item) return null;

  const progress = currentPlayback.progress_ms / currentPlayback.item.duration_ms;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full border-t border-gray-800 bg-gray-950/50 backdrop-blur-sm p-4"
    >
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={currentPlayback.item.album.images[0]?.url}
          alt={currentPlayback.item.name}
          className="w-12 h-12 rounded shadow"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{currentPlayback.item.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {currentPlayback.item.artists[0]?.name}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-gray-800 h-1 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-spotify"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentPlayback.progress_ms)}</span>
          <span>{formatTime(currentPlayback.item.duration_ms)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Shuffle className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousTrack}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={currentPlayback.is_playing ? pause : play}
          className="p-3 bg-spotify hover:bg-green-600 rounded-full transition-colors"
        >
          {currentPlayback.is_playing ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextTrack}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Repeat className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
