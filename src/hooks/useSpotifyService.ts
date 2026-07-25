import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store';
import { spotifyService } from '@/services/SpotifyService';
import type { SpotifyPlaybackState } from '@/types';

interface UseSpotifyServiceReturn {
  currentPlayback: SpotifyPlaybackState | null;
  isLoading: boolean;
  error: Error | null;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  initializeSpotify: () => Promise<void>;
}

export const useSpotifyService = (): UseSpotifyServiceReturn => {
  const { setCurrentTrack, setIsPlaying } = useAppStore();
  const [currentPlayback, setCurrentPlayback] = useRef<SpotifyPlaybackState | null>(null);
  const [isLoading, setIsLoading] = useRef(false);
  const [error, setError] = useRef<Error | null>(null);

  const fetchCurrentPlayback = useCallback(async () => {
    try {
      setIsLoading(true);
      const playback = await spotifyService.getCurrentPlayback();
      setCurrentPlayback(playback);

      if (playback?.item) {
        setCurrentTrack(playback.item.id);
        setIsPlaying(playback.is_playing);
      }

      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Failed to fetch playback:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentTrack, setIsPlaying]);

  const play = useCallback(async () => {
    try {
      await spotifyService.play();
      await fetchCurrentPlayback();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to play');
      setError(error);
    }
  }, [fetchCurrentPlayback]);

  const pause = useCallback(async () => {
    try {
      await spotifyService.pause();
      await fetchCurrentPlayback();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to pause');
      setError(error);
    }
  }, [fetchCurrentPlayback]);

  const nextTrack = useCallback(async () => {
    try {
      await spotifyService.nextTrack();
      await fetchCurrentPlayback();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to skip');
      setError(error);
    }
  }, [fetchCurrentPlayback]);

  const previousTrack = useCallback(async () => {
    try {
      await spotifyService.previousTrack();
      await fetchCurrentPlayback();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to go back');
      setError(error);
    }
  }, [fetchCurrentPlayback]);

  const seek = useCallback(
    async (position: number) => {
      try {
        await spotifyService.seek(position);
        await fetchCurrentPlayback();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to seek');
        setError(error);
      }
    },
    [fetchCurrentPlayback],
  );

  const initializeSpotify = useCallback(async () => {
    try {
      // Check if token exists in localStorage or environment
      const token = localStorage.getItem('spotify_token');
      if (token) {
        spotifyService.setAccessToken(token);
        await fetchCurrentPlayback();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize');
      setError(error);
    }
  }, [fetchCurrentPlayback]);

  useEffect(() => {
    // Poll for playback updates every second
    const interval = setInterval(() => {
      fetchCurrentPlayback();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchCurrentPlayback]);

  return {
    currentPlayback: currentPlayback.current,
    isLoading: isLoading.current,
    error: error.current,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    initializeSpotify,
  };
};
