# LyricSync - Development Guide

## Architecture Overview

### Tech Stack

- **Electron** - Desktop application framework
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Zustand** - Global state management
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **SQLite** - Local database
- **Axios** - HTTP client

### Project Structure

```
src/
├── components/         # Reusable React components
│   ├── LyricsDisplay.tsx      # Main lyrics display
│   ├── PlaybackControls.tsx   # Spotify controls
│   ├── SettingsPanel.tsx      # Settings UI
│   ├── OverlayLyrics.tsx      # Overlay window lyrics
│   ├── ErrorBoundary.tsx      # Error handling
│   ├── NotificationContainer.tsx  # Toast notifications
│   ├── FavoritesList.tsx      # Favorites display
│   ├── SearchPanel.tsx        # Lyrics search
│   ├── StatisticsPanel.tsx    # Stats display
│   ├── LoadingSpinner.tsx     # Loading indicator
│   └── ProgressBar.tsx        # Progress visualization
├── pages/              # Full page components
│   ├── MainWindow.tsx         # Main app window
│   └── SpotifyAuth.tsx        # Auth page
├── hooks/              # Custom React hooks
│   ├── useSpotifyService.ts   # Spotify API hooks
│   ├── useLyrics.ts           # Lyrics fetching
│   ├── useKeyboardShortcuts.ts # Keyboard handling
│   ├── useOnline.ts           # Online status
│   ├── useLocalStorage.ts     # LocalStorage wrapper
│   └── useFavorites.ts        # Favorites management
├── services/           # Business logic
│   ├── SpotifyService.ts      # Spotify API client
│   ├── LyricsService.ts       # Lyrics parsing
│   └── DatabaseService.ts     # SQLite wrapper
├── store/              # Zustand state
│   └── index.ts        # Global app state
├── contexts/           # React contexts
│   └── ThemeContext.tsx       # Theme management
├── types/              # TypeScript definitions
│   ├── index.ts        # Main types
│   ├── spotify.ts      # Spotify types
│   └── electron.ts     # Electron types
├── utils/              # Utility functions
│   ├── formatting.ts   # Format helpers
│   ├── colors.ts       # Color utilities
│   ├── image.ts        # Image utilities
│   └── network.ts      # Network utilities
├── assets/             # Static files
├── App.tsx             # Root component
├── main.tsx            # React entry
└── index.css           # Global styles

electron/
├── main.ts             # Electron main process
├── preload.ts          # IPC context bridge
└── types.ts            # Electron types
```

## Key Components

### LyricsDisplay

The main component that displays synchronized lyrics:

```typescript
- Fetches lyrics via useLyrics hook
- Auto-scrolls to current lyric
- Highlights current line
- Fades previous/future lyrics
- Smooth animations between lyrics
```

### PlaybackControls

Spotify player controls:

```typescript
- Play/Pause toggle
- Next/Previous track
- Seek bar with progress
- Time display
- Album artwork thumbnail
```

### SettingsPanel

User settings configuration:

```typescript
- Theme selection (6 themes)
- Font size slider (12-32px)
- Overlay opacity slider
- Boolean toggles for features
- Live preview of changes
```

## State Management (Zustand)

### useAppStore

Global state for entire app:

```typescript
{
  settings: Settings              // User preferences
  stats: PlaybackStats            // Listening stats
  favorites: FavoriteSong[]       // Favorite tracks
  lyricsCache: Map<...>           // Lyrics cache
  spotifyToken: string | null     // Auth token
  currentTrackId: string | null   // Current playing track
  isPlaying: boolean              // Playback state
}
```

## Services

### SpotifyService

Handles Spotify Web API integration:

```typescript
- OAuth authentication
- Token refresh
- Get current playback
- Playback control (play, pause, skip, seek)
- Error handling and retry logic
```

### LyricsService

Manages lyrics fetching and parsing:

```typescript
- Search LRCLIB API
- Parse synced lyrics (LRC format)
- Parse plain lyrics
- Find current lyric by timestamp
- Handle formatting edge cases
```

### DatabaseService

SQLite database operations:

```typescript
- Settings persistence
- Lyrics caching
- Favorites management
- Statistics tracking
- Playback history
```

## Custom Hooks

### useSpotifyService

Manages Spotify integration:

```typescript
- Fetches current playback every second
- Handles play/pause/skip
- Manages auth tokens
- Provides error handling
```

### useLyrics

Fetches and manages lyrics:

```typescript
- Searches for lyrics
- Caches results (24-hour TTL)
- Parses synced/plain lyrics
- Tracks current lyric index
- Detects if lyrics are synced
```

### useKeyboardShortcuts

Handles keyboard shortcuts:

```typescript
Ctrl+L      - Toggle overlay
Ctrl+Shift+T - Cycle themes
Ctrl++      - Increase font
Ctrl+-      - Decrease font
Space       - Play/Pause
```

## Themes

### Available Themes

1. **Dark** - Default dark theme
2. **Light** - Light theme
3. **OLED** - Pure black (OLED optimized)
4. **Spotify** - Spotify green branding
5. **Glassmorphism** - Modern glass effect
6. **Neon** - Purple neon accent

Themes are managed via `ThemeContext` and stored in settings.

## Animations

### Framer Motion Usage

```typescript
// Lyric transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>

// Button interactions
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// Window opening
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
/>
```

## Database Schema

### settings table

Stores user preferences:

```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  theme TEXT,
  fontSize INTEGER,
  overlayOpacity REAL,
  -- ... other fields
  updatedAt DATETIME
)
```

### lyrics_cache table

Caches fetched lyrics:

```sql
CREATE TABLE lyrics_cache (
  id INTEGER PRIMARY KEY,
  trackId TEXT UNIQUE,
  lyrics TEXT,
  syncedLyrics TEXT,
  cachedAt INTEGER
)
```

### favorite_songs table

User's favorite tracks:

```sql
CREATE TABLE favorite_songs (
  id INTEGER PRIMARY KEY,
  trackId TEXT UNIQUE,
  trackName TEXT,
  artistName TEXT,
  albumArt TEXT,
  addedAt INTEGER
)
```

### playback_stats table

Listening statistics:

```sql
CREATE TABLE playback_stats (
  id INTEGER PRIMARY KEY,
  songsPlayed INTEGER,
  listeningHours REAL,
  mostPlayedArtists TEXT,
  -- ... other fields
  updatedAt DATETIME
)
```

## Spotify OAuth Flow

1. User clicks "Connect with Spotify"
2. App redirects to Spotify auth endpoint
3. User authorizes app
4. Spotify redirects back with auth code
5. App exchanges code for access token
6. Token stored in localStorage and state
7. App fetches current playback

## Error Handling

### Error Boundary

Catches React component errors:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### API Errors

Handled with retry logic:

```typescript
await retryWithBackoff(
  () => spotifyService.getCurrentPlayback(),
  3,     // max retries
  1000   // backoff ms
)
```

### Network Errors

Detected via useOnline hook:

```typescript
const isOnline = useOnline();
if (!isOnline) {
  // Show offline UI
}
```

## Performance Optimizations

### React Optimizations

- `React.memo` for expensive components
- `useCallback` for stable function references
- `useMemo` for computed values
- Lazy loading components

### Animation Optimizations

- Use GPU-accelerated properties (transform, opacity)
- Disable animations in settings for low-end machines
- Virtualize long lists of lyrics

### Database Optimizations

- WAL mode for SQLite
- Indexed queries
- Batch updates
- 24-hour cache TTL for lyrics

## Testing

### Manual Testing Checklist

- [ ] Spotify authentication
- [ ] Real-time playback detection
- [ ] Lyrics fetching and display
- [ ] Smooth scrolling
- [ ] Theme switching
- [ ] Settings persistence
- [ ] Keyboard shortcuts
- [ ] Overlay window
- [ ] Error handling
- [ ] Performance on low-end machine

### Development Tools

```bash
# React DevTools (built-in during dev)
# Electron DevTools: Open with Dev Tools in menu
# Database browser: Use SQLite Browser
```

## Debugging

### Enable Debugging

```bash
# In electron/main.ts, dev mode opens DevTools automatically
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

### Console Logging

```typescript
// React console
console.log('Debug message');

// Electron main process
console.log('Main process log');

// Check database
const settings = dbService.getSettings();
```

## Future Enhancements

- [ ] Discord Rich Presence
- [ ] Mini player widget
- [ ] Desktop visualizer
- [ ] Lyrics translation
- [ ] Export lyrics
- [ ] Cloud sync
- [ ] Advanced search
- [ ] Custom themes
- [ ] Lyrics editing
- [ ] Multi-language support

## Contributing Guidelines

1. Follow TypeScript strict mode
2. Use named exports
3. Add JSDoc comments for complex functions
4. Test on Windows, macOS, Linux
5. Follow Tailwind CSS conventions
6. Use motion for all transitions
7. Handle errors gracefully
8. Add proper types for everything

## Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [LRCLIB API](https://lrclib.net/api-docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://github.com/pmndrs/zustand)
