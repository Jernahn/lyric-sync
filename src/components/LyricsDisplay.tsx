import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotifyService } from '@/hooks/useSpotifyService';
import { useLyrics } from '@/hooks/useLyrics';
import { useAppStore } from '@/store';

export const LyricsDisplay: React.FC = () => {
  const { currentPlayback } = useSpotifyService();
  const { settings } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const artist = currentPlayback?.item?.artists[0]?.name;
  const trackName = currentPlayback?.item?.name;
  const duration = currentPlayback?.item?.duration_ms || 0;
  const currentTime = currentPlayback?.progress_ms || 0;

  const { lyrics, currentLyricIndex, isLoading, isSynced } = useLyrics(
    artist,
    trackName,
    currentTime,
    duration,
  );

  useEffect(() => {
    if (!containerRef.current || lyrics.length === 0) return;

    const currentLyric = containerRef.current.querySelector('[data-current="true"]');
    if (currentLyric) {
      currentLyric.scrollIntoView({
        behavior: settings.enableAnimations ? 'smooth' : 'auto',
        block: 'center',
      });
    }
  }, [currentLyricIndex, lyrics, settings.enableAnimations]);

  if (!currentPlayback?.item) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No track playing</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-spotify rounded-full" />
        </div>
      </div>
    );
  }

  if (lyrics.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-4">
        <img
          src={currentPlayback.item.album.images[0]?.url}
          alt={currentPlayback.item.name}
          className="w-32 h-32 rounded-lg shadow-lg"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1">{currentPlayback.item.name}</h2>
          <p className="text-gray-400">{artist}</p>
          <p className="text-gray-500 mt-4">No lyrics available for this track</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-y-auto flex flex-col items-center justify-center px-4 py-8 gap-4"
    >
      <AnimatePresence mode="wait">
        {lyrics.map((lyric, index) => {
          const isCurrent = index === currentLyricIndex;
          const isPast = index < currentLyricIndex;

          return (
            <motion.div
              key={`${lyric.time}-${index}`}
              data-current={isCurrent}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isCurrent ? 1 : isPast ? 0.5 : 0.3,
                y: 0,
                scale: isCurrent ? 1.1 : 1,
              }}
              transition={{
                duration: settings.enableAnimations ? 0.3 : 0,
              }}
              className={`text-center transition-all ${
                isCurrent
                  ? 'text-2xl font-bold text-spotify'
                  : isPast
                    ? 'text-base text-gray-400'
                    : 'text-sm text-gray-600'
              }`}
              style={{
                fontSize: `${settings.fontSize}px`,
              }}
            >
              {lyric.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
