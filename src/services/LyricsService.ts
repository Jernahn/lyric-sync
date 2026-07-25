import axios from 'axios';
import type { SyncedLyricLine } from '@/types';

const LRCLIB_API = import.meta.env.VITE_LRCLIB_API || 'https://lrclib.net/api';

interface LrclibResponse {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export class LyricsService {
  async searchLyrics(
    artist: string,
    track: string,
    album?: string,
    duration?: number,
  ): Promise<LrclibResponse | null> {
    try {
      const params = new URLSearchParams({
        artist_name: artist,
        track_name: track,
      });

      if (album) {
        params.append('album_name', album);
      }
      if (duration) {
        params.append('duration', Math.round(duration / 1000).toString());
      }

      const response = await axios.get<LrclibResponse[]>(
        `${LRCLIB_API}/get?${params.toString()}`,
        {
          timeout: 5000,
        },
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }

      return null;
    } catch (error) {
      console.error('Failed to search lyrics:', error);
      return null;
    }
  }

  parseSyncedLyrics(syncedLyricsString: string | null): SyncedLyricLine[] {
    if (!syncedLyricsString) return [];

    const lines: SyncedLyricLine[] = [];
    const linesArray = syncedLyricsString.split('\n');

    for (const line of linesArray) {
      const match = line.match(/\[(\d{1,2}):(\d{2}(?:\.\d{2,3})?)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[3].trim();

        if (text) {
          lines.push({ time, text });
        }
      }
    }

    return lines;
  }

  parsePlainLyrics(plainLyricsString: string | null): SyncedLyricLine[] {
    if (!plainLyricsString) return [];

    const lines = plainLyricsString.split('\n').filter((line) => line.trim());
    const totalLines = lines.length;

    return lines.map((text, index) => ({
      time: (index / totalLines) * 100,
      text: text.trim(),
    }));
  }

  getCurrentLyricIndex(currentTime: number, lyrics: SyncedLyricLine[]): number {
    return lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentTime >= lyric.time && (nextLyric ? currentTime < nextLyric.time : true);
    });
  }
}

export const lyricsService = new LyricsService();
