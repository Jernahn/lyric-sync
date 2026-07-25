import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSpotifyService } from '@/hooks/useSpotifyService';
import { useLyrics } from '@/hooks/useLyrics';
import { useAppStore } from '@/store';

export const OverlayLyrics: React.FC = () => {
  const { currentPlayback } = useSpotifyService();
  const { settings } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const artist = currentPlayback?.item?.artists[0]?.name;
  const trackName = currentPlayback?.item?.name;
  const duration = currentPlayback?.item?.duration_ms || 0;
  const currentTime = currentPlayback?.progress_ms || 0;

  const { lyrics, currentLyricIndex } = useLyrics(artist, trackName, currentTime, duration);

  if (!lyrics.length || !currentPlayback?.item) {
    return null;
  }

  const currentLyric = lyrics[currentLyricIndex];
  const nextLyric = lyrics[currentLyricIndex + 1];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: settings.overlayOpacity }}
      className="w-full h-full flex flex-col items-center justify-center px-4 py-6 backdrop-blur-md rounded-2xl"
      style={{
        background: `rgba(29, 185, 84, ${settings.overlayOpacity * 0.1})`,
      }}
    >
      <motion.div
        key={currentLyricIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <p
          className="font-bold text-spotify leading-tight"
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {currentLyric?.text}
        </p>
        {nextLyric && (
          <p className="text-gray-400 text-sm mt-2 opacity-50">{nextLyric.text}</p>
        )}
      </motion.div>
    </motion.div>
  );
};
