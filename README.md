# LyricSync

A modern, production-ready desktop application that automatically displays synchronized lyrics for songs currently playing on Spotify.

## Features

### Core Features

- 🎵 **Spotify Integration** - Real-time playback detection with OAuth authentication
- 🎤 **Synchronized Lyrics** - Automatic lyrics fetching from LRCLIB API with caching
- ✨ **Beautiful UI** - Modern glassmorphism design with smooth animations
- 🎨 **Multiple Themes** - Dark, Light, OLED Black, Spotify Green, Glassmorphism, Purple Neon
- 🎤 **Karaoke Mode** - Progressive word highlighting with timestamp animations
- 🪟 **Floating Overlay** - Always-on-top transparent window for minimal distraction
- ⌨️ **Keyboard Shortcuts** - Quick access to common functions
- 📊 **Statistics** - Track listening habits and favorite songs
- 🔔 **Notifications** - Real-time updates for song changes and events
- 💾 **Local Database** - SQLite for caching and offline functionality

### UI/UX Features

- Responsive layout
- Smooth scrolling lyrics
- Album artwork display
- Playback progress visualization
- Settings panel with multiple customization options
- Error boundaries and graceful error handling

## Tech Stack

- **Desktop Framework**: Electron
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Animations**: Framer Motion
- **UI Components**: Lucide React
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **HTTP Client**: Axios
- **APIs**: Spotify Web API, LRCLIB API

## Project Structure

```
lyric-sync/
├── electron/              # Electron main process
│   ├── main.ts           # Main window and app lifecycle
│   └── preload.ts        # IPC context bridge
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Full page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic services
│   │   ├── SpotifyService.ts
│   │   ├── LyricsService.ts
│   │   └── DatabaseService.ts
│   ├── store/            # Zustand state management
│   ├── contexts/         # React contexts (Theme)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── assets/           # Static assets
│   ├── App.tsx           # Root component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── database/             # SQLite database files
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Spotify Developer Account
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jernahn/lyric-sync.git
   cd lyric-sync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure Spotify OAuth**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Copy your Client ID and Client Secret
   - Add to `.env`:
     ```
     VITE_SPOTIFY_CLIENT_ID=your_client_id
     VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
     VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
     ```

## Development

### Start Development Server

```bash
npm run dev
```

This will start:
- Vite development server on `http://localhost:5173`
- Electron app with hot reload
- React DevTools (in dev mode)

### Build for Production

```bash
npm run build
```

This creates:
- Optimized React build in `dist/`
- Electron build in `dist-electron/`

### Package Application

```bash
npm run electron-build
```

Creates installers in `release/` for:
- Windows (NSIS installer + portable)
- macOS (DMG)
- Linux (AppImage)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Toggle overlay window |
| `Ctrl+Shift+T` | Cycle through themes |
| `Ctrl++` | Increase font size |
| `Ctrl+-` | Decrease font size |
| `Space` | Play/Pause |
| `→` | Next track |
| `←` | Previous track |

## Configuration

### Themes

Available themes:
- **Dark**: Default dark theme
- **Light**: Light theme for daytime use
- **OLED Black**: Pure black for OLED displays
- **Spotify Green**: Spotify brand colors
- **Glassmorphism**: Modern glassmorphism effect
- **Purple Neon**: Neon purple accent colors

### Settings

Customize via Settings panel:
- Theme selection
- Font size (12-32px)
- Overlay opacity (0.1-1.0)
- Karaoke mode toggle
- Animation toggle
- Notification preferences
- Auto-start on system startup
- Always-on-top behavior

## API Integration

### Spotify Web API

Used for:
- User authentication (OAuth 2.0)
- Current playback information
- Playback control (play, pause, skip)
- User profile data

### LRCLIB API

Used for:
- Synchronized lyrics search
- Plain lyrics as fallback
- Lyrics caching (24-hour TTL)

## Database Schema

### Tables

- `settings` - User preferences and configuration
- `lyrics_cache` - Cached lyrics with sync data
- `favorite_songs` - User's favorite tracks
- `playback_stats` - Listening statistics
- `playback_history` - Play history with timestamps

## Performance Optimizations

- Lazy component loading
- Virtualized lyrics rendering
- Optimized re-renders with React.memo
- Efficient animation frame usage
- SQLite WAL mode for faster queries
- In-memory lyric caching
- Debounced API calls

## Error Handling

- Graceful fallbacks for missing lyrics
- Network error recovery with retry logic
- Token refresh handling for Spotify auth
- Database error boundaries
- User-friendly error notifications

## Troubleshooting

### Spotify Authentication Issues

1. Verify Client ID and Secret in `.env`
2. Check Redirect URI matches Spotify dashboard settings
3. Clear browser cache and cookies
4. Re-authorize the application

### No Lyrics Found

1. Check artist and track name spelling
2. Try a different LRCLIB query
3. Verify internet connection
4. Check LRCLIB API status

### Overlay Window Not Showing

1. Check `alwaysOnTop` setting is enabled
2. Verify window position is on-screen
3. Try moving main window first
4. Restart application

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Spotify for the Web API
- LRCLIB for lyrics database
- Electron, React, and open-source community

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section

## Roadmap

- [ ] Discord Rich Presence integration
- [ ] Mini player widget
- [ ] Desktop visualizer
- [ ] Lyrics translation
- [ ] Export lyrics feature
- [ ] Cloud sync for favorites
- [ ] Advanced filtering and search
- [ ] Custom theme builder

---

**LyricSync** - Making music more meaningful with synchronized lyrics.
