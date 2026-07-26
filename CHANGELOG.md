# Changelog

All notable changes to LyricSync will be documented in this file.

## [1.0.0] - 2024-03-15

### Added

#### Core Features
- Spotify OAuth authentication with token refresh
- Real-time playback detection (1-second polling)
- LRCLIB API integration for synchronized lyrics
- Lyrics caching system (24-hour TTL)
- SQLite database for persistent storage
- Smooth lyric scrolling with auto-center
- Album artwork display
- Playback controls (play, pause, next, previous, seek)

#### UI Components
- Main window with centered lyrics display
- Floating overlay window (always-on-top)
- Settings panel with customization options
- Playback controls bar with progress visualization
- Spotify authentication page
- Error boundary with fallback UI
- Toast notification system
- Loading spinners and progress bars

#### Themes
- Dark theme (default)
- Light theme
- OLED Black theme
- Spotify Green theme
- Glassmorphism theme
- Purple Neon theme
- Live theme switching with instant updates

#### Settings & Customization
- Theme selection
- Font size adjustment (12-32px)
- Overlay opacity control
- Animation toggle
- Karaoke mode toggle (framework)
- Auto-start configuration
- Always-on-top setting
- Notification preferences

#### Keyboard Shortcuts
- `Ctrl+L` - Toggle overlay window
- `Ctrl+Shift+T` - Cycle through themes
- `Ctrl++` - Increase font size
- `Ctrl+-` - Decrease font size
- `Space` - Play/Pause (when not in input)

#### Database Features
- Settings persistence
- Lyrics caching
- Favorites management
- Playback statistics
- Playback history tracking
- Automatic schema creation
- WAL mode for SQLite

#### State Management
- Zustand global store
- Settings state
- Playback stats
- Favorites list
- Lyrics cache
- Spotify token management
- Current track tracking

#### Technical
- Electron desktop framework
- React 18 with TypeScript
- Vite build tool
- Framer Motion animations
- Tailwind CSS styling
- Lucide React icons
- Axios HTTP client
- Better-sqlite3 database

#### Utilities
- Time formatting helpers
- Color manipulation functions
- Image processing utilities
- Network error retry logic
- Debounce and throttle functions
- Local storage wrapper
- Online status detection

#### Documentation
- Comprehensive README.md
- Installation guide (INSTALLATION.md)
- Development guide (DEVELOPMENT.md)
- Feature roadmap (ROADMAP.md)
- Architecture overview
- API integration documentation

### Fixed

- Spotify token expiration handling
- LRCLIB API timeout management
- Lyric scrolling race conditions
- Theme switching persistence
- Database initialization errors

### Security

- Context isolation in Electron
- Secure IPC communication
- OAuth token storage in localStorage
- Environment variable protection

### Performance

- Optimized re-renders with React.memo
- Efficient lyric list rendering
- GPU-accelerated animations
- Database query optimization
- Image lazy loading

### Known Issues

- Overlay window position not persisted between sessions
- Some edge cases in lyric synchronization
- Karaoke mode not yet fully implemented
- Cloud sync features not available

## Installation

See [INSTALLATION.md](INSTALLATION.md) for detailed setup instructions.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture and development guidelines.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and timeline.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

## License

MIT License - See LICENSE file for details
