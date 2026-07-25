import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { LyricsDisplay } from '@/components/LyricsDisplay';
import { PlaybackControls } from '@/components/PlaybackControls';
import { SettingsPanel } from '@/components/SettingsPanel';
import { SpotifyAuth } from '@/components/SpotifyAuth';

export const MainWindow: React.FC = () => {
  const { spotifyToken } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);

  if (!spotifyToken) {
    return <SpotifyAuth />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-spotify" />
          <h1 className="text-lg font-bold">LyricSync</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {showSettings ? <SettingsPanel /> : <LyricsDisplay />}
      </div>

      {/* Playback Controls */}
      <PlaybackControls />
    </motion.div>
  );
};
