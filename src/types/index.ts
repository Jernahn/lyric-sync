export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  uri: string;
}

export interface SpotifyPlaybackState {
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: SpotifyTrack | null;
  device: {
    id: string;
    name: string;
    type: string;
  };
}

export interface Lyric {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  createdAt: string;
}

export interface SyncedLyricLine {
  time: number;
  text: string;
}

export interface LyricsCache {
  trackId: string;
  artist: string;
  track: string;
  lyrics: string | null;
  syncedLyrics: SyncedLyricLine[] | null;
  cachedAt: number;
}

export interface Settings {
  theme: 'dark' | 'light' | 'oled' | 'spotify' | 'glassmorphism' | 'neon';
  autoStart: boolean;
  alwaysOnTop: boolean;
  overlayOpacity: number;
  transparencySlider: number;
  fontSize: number;
  fontFamily: string;
  accentColor: string;
  enableAnimations: boolean;
  enableKaraokeMode: boolean;
  showNotifications: boolean;
}

export interface PlaybackStats {
  songsPlayed: number;
  listeningHours: number;
  mostPlayedArtists: Array<{ artist: string; count: number }>;
  dailyListeningTime: Record<string, number>;
  weeklyListeningTime: Record<string, number>;
  monthlyListeningTime: Record<string, number>;
}

export interface FavoriteSong {
  id: string;
  trackId: string;
  trackName: string;
  artistName: string;
  albumArt: string;
  addedAt: number;
}

export interface SearchResult {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArt: string;
}
