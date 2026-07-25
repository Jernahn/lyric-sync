import { create } from 'zustand';
import type { Settings, PlaybackStats, FavoriteSong, LyricsCache } from '@/types';

interface AppState {
  settings: Settings;
  stats: PlaybackStats;
  favorites: FavoriteSong[];
  lyricsCache: Map<string, LyricsCache>;
  spotifyToken: string | null;
  currentTrackId: string | null;
  isPlaying: boolean;

  updateSettings: (settings: Partial<Settings>) => void;
  updateStats: (stats: Partial<PlaybackStats>) => void;
  addFavorite: (song: FavoriteSong) => void;
  removeFavorite: (trackId: string) => void;
  setCacheEntry: (trackId: string, cache: LyricsCache) => void;
  getCacheEntry: (trackId: string) => LyricsCache | undefined;
  setSpotifyToken: (token: string) => void;
  setCurrentTrack: (trackId: string) => void;
  setIsPlaying: (playing: boolean) => void;
  initializeSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  theme: 'dark',
  autoStart: false,
  alwaysOnTop: true,
  overlayOpacity: 0.9,
  transparencySlider: 0.7,
  fontSize: 16,
  fontFamily: 'system-ui',
  accentColor: '#1db954',
  enableAnimations: true,
  enableKaraokeMode: false,
  showNotifications: true,
};

const defaultStats: PlaybackStats = {
  songsPlayed: 0,
  listeningHours: 0,
  mostPlayedArtists: [],
  dailyListeningTime: {},
  weeklyListeningTime: {},
  monthlyListeningTime: {},
};

export const useAppStore = create<AppState>((set, get) => ({
  settings: defaultSettings,
  stats: defaultStats,
  favorites: [],
  lyricsCache: new Map(),
  spotifyToken: null,
  currentTrackId: null,
  isPlaying: false,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),

  addFavorite: (song) =>
    set((state) => ({
      favorites: [...state.favorites, song],
    })),

  removeFavorite: (trackId) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.trackId !== trackId),
    })),

  setCacheEntry: (trackId, cache) =>
    set((state) => {
      state.lyricsCache.set(trackId, cache);
      return { lyricsCache: new Map(state.lyricsCache) };
    }),

  getCacheEntry: (trackId) => get().lyricsCache.get(trackId),

  setSpotifyToken: (token) => set({ spotifyToken: token }),

  setCurrentTrack: (trackId) => set({ currentTrackId: trackId }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  initializeSettings: async () => {
    try {
      const saved = await window.electron.ipcRenderer.invoke('get-settings');
      if (saved) {
        set({ settings: { ...defaultSettings, ...saved } });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },
}));
