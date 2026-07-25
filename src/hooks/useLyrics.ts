import { useEffect, useState, useCallback } from 'react';
import { lyricsService } from '@/services/LyricsService';
import { useAppStore } from '@/store';
import type { SyncedLyricLine } from '@/types';

interface UseLyricsReturn {
  lyrics: SyncedLyricLine[];
  currentLyricIndex: number;
  isLoading: boolean;
  error: Error | null;
  isSynced: boolean;
}

export const useLyrics = (
  artist: string | undefined,
  trackName: string | undefined,
  currentTimeMs: number,
  duration: number,
): UseLyricsReturn => {
  const { getCacheEntry, setCacheEntry } = useAppStore();
  const [lyrics, setLyrics] = useState<SyncedLyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  const fetchLyrics = useCallback(async () => {
    if (!artist || !trackName) return;

    setIsLoading(true);
    setError(null);

    try {
      const trackId = `${artist}-${trackName}`;
      const cached = getCacheEntry(trackId);

      if (cached && Date.now() - cached.cachedAt < 86400000) {
        // 24 hour cache
        const parsed = cached.syncedLyrics || lyricsService.parsePlainLyrics(cached.lyrics);
        setLyrics(parsed);
        setIsSynced(!!cached.syncedLyrics);
        setIsLoading(false);
        return;
      }

      const result = await lyricsService.searchLyrics(artist, trackName, undefined, duration);

      if (result) {
        let parsedLyrics: SyncedLyricLine[] = [];
        let isSyncedLyrics = false;

        if (result.syncedLyrics) {
          parsedLyrics = lyricsService.parseSyncedLyrics(result.syncedLyrics);
          isSyncedLyrics = true;
        } else if (result.plainLyrics) {
          parsedLyrics = lyricsService.parsePlainLyrics(result.plainLyrics);
        }

        // Cache the lyrics
        setCacheEntry(trackId, {
          trackId,
          artist,
          track: trackName,
          lyrics: result.plainLyrics,
          syncedLyrics: isSyncedLyrics ? parsedLyrics : null,
          cachedAt: Date.now(),
        });

        setLyrics(parsedLyrics);
        setIsSynced(isSyncedLyrics);
      } else {
        setLyrics([]);
        setIsSynced(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch lyrics');
      setError(error);
      console.error('Error fetching lyrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [artist, trackName, duration, getCacheEntry, setCacheEntry]);

  useEffect(() => {
    fetchLyrics();
  }, [artist, trackName, fetchLyrics]);

  useEffect(() => {
    if (lyrics.length === 0) return;

    const currentTime = currentTimeMs / 1000;
    const index = lyricsService.getCurrentLyricIndex(currentTime, lyrics);
    setCurrentLyricIndex(Math.max(0, index));
  }, [currentTimeMs, lyrics]);

  return {
    lyrics,
    currentLyricIndex,
    isLoading,
    error,
    isSynced,
  };
};
