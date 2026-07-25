# Installation & Build Guide

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **Git**: For cloning the repository
- **Spotify Developer Account**: For API credentials

## Step 1: Install Dependencies

```bash
cd lyric-sync
npm install
```

## Step 2: Spotify OAuth Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in or create a Spotify account
3. Click "Create an App"
4. Accept the terms and create the app
5. Copy your **Client ID** and **Client Secret**
6. Click "Edit Settings"
7. Add Redirect URI: `http://localhost:3000/callback`
8. Save the settings

## Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Spotify credentials:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
VITE_LRCLIB_API=https://lrclib.net/api
```

## Step 4: Development

### Start Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:5173`
- Launch Electron app with hot reload
- Open React DevTools for debugging

### Available Dev Scripts

```bash
# Start dev server with Electron
npm run dev

# Run Electron only (after starting Vite in another terminal)
npm run electron-dev

# Preview production build
npm run preview
```

## Step 5: Production Build

### Build for All Platforms

```bash
npm run build
```

This creates:
- React production build in `dist/`
- Electron preload in `dist-electron/`

### Package Application

```bash
npm run electron-build
```

This generates installers in `release/`:
- **Windows**: NSIS installer + portable executable
- **macOS**: DMG file
- **Linux**: AppImage

## Windows Build Instructions

### Prerequisites
- Windows 7 or later
- Visual Studio Build Tools (for native modules)

### Build Steps

```bash
# Install Windows build tools
npm install --global windows-build-tools

# Build for Windows
npm run build
npm run electron-build
```

Output files will be in `release/` directory:
- `LyricSync Setup 1.0.0.exe` - NSIS installer
- `LyricSync 1.0.0.exe` - Portable executable

### Create Standalone Executable

```bash
# The portable .exe is a standalone executable
# No installation required - just run it directly
```

### Code Signing (Optional)

For production releases, you may want to code sign the executable:

```bash
# Install signtool (Windows SDK)
# Then add to electron-builder config in package.json
```

## macOS Build Instructions

### Prerequisites
- macOS 10.13 or later
- Xcode Command Line Tools

```bash
xcode-select --install
```

### Build Steps

```bash
npm run build
npm run electron-build
```

Output in `release/`:
- `LyricSync-1.0.0.dmg` - DMG installer
- `LyricSync-1.0.0.zip` - ZIP archive

### Code Signing (macOS)

1. Get a Developer Certificate from Apple
2. Add to `package.json`:

```json
"mac": {
  "certificateFile": "path/to/cert.p12",
  "certificatePassword": "password"
}
```

## Linux Build Instructions

### Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get install rpm

# Fedora/RHEL
sudo dnf install rpm-build
```

### Build Steps

```bash
npm run build
npm run electron-build
```

Output in `release/`:
- `lyric-sync-1.0.0.AppImage` - AppImage (universal)
- `lyric-sync-1.0.0.x86_64.rpm` - RPM package (optional)

## Troubleshooting

### Build Fails with Module Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Spotify API Not Working

1. Verify Client ID and Secret in `.env`
2. Check Redirect URI matches Spotify Dashboard
3. Clear browser cache and cookies
4. Re-authenticate

### LRCLIB API Issues

1. Check internet connection
2. Verify LRCLIB API is accessible
3. Try manual search with correct artist/track spelling

### Database Errors

```bash
# Delete cached database
rm database.db

# Restart application
npm run dev
```

### Electron Window Not Opening

1. Check Vite dev server is running
2. Verify port 5173 is available
3. Check firewall settings
4. Run with: `npm run electron-dev` after Vite starts

## Distribution

### Create Release

1. Update version in `package.json`
2. Build for all platforms:
   ```bash
   npm run build
   npm run electron-build
   ```
3. Upload files from `release/` to GitHub Releases
4. Create GitHub release notes with download links

### Auto-Update (Optional)

For auto-updates, configure `electron-updater` in `electron/main.ts`

## Development Certificates

For development, self-signed certificates are fine. For production distribution, obtain proper certificates from:

- **Windows**: DigiCert, Sectigo, etc.
- **macOS**: Apple Developer Program
- **Linux**: Generally not required

## Performance Tips

1. Use production build for testing: `npm run preview`
2. Monitor RAM usage: Usually 150-250MB
3. Check CPU usage with Task Manager/Activity Monitor
4. Disable animations in settings for slower machines

## Support

For issues:
1. Check GitHub Issues
2. Review error logs in DevTools console
3. Check `.env` configuration
4. Verify API credentials
5. Open a new issue with:
   - OS and version
   - Error message
   - Steps to reproduce
