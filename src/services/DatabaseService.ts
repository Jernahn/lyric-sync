import Database from 'better-sqlite3';
import path from 'path';
import type { FavoriteSong, LyricsCache, PlaybackStats, Settings } from '@/types';

let db: Database.Database | null = null;

const getDatabase = (): Database.Database => {
  if (!db) {
    const dbPath = path.join(
      import.meta.env.VITE_APP_DATA_PATH || './data',
      'lyric-sync.db',
    );
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
};

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
    this.initializeSchema();
  }

  private initializeSchema(): void {
    // Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        theme TEXT DEFAULT 'dark',
        autoStart INTEGER DEFAULT 0,
        alwaysOnTop INTEGER DEFAULT 1,
        overlayOpacity REAL DEFAULT 0.9,
        transparencySlider REAL DEFAULT 0.7,
        fontSize INTEGER DEFAULT 16,
        fontFamily TEXT DEFAULT 'system-ui',
        accentColor TEXT DEFAULT '#1db954',
        enableAnimations INTEGER DEFAULT 1,
        enableKaraokeMode INTEGER DEFAULT 0,
        showNotifications INTEGER DEFAULT 1,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lyrics cache table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS lyrics_cache (
        id INTEGER PRIMARY KEY,
        trackId TEXT UNIQUE,
        artist TEXT,
        track TEXT,
        lyrics TEXT,
        syncedLyrics TEXT,
        cachedAt INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Favorite songs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS favorite_songs (
        id INTEGER PRIMARY KEY,
        trackId TEXT UNIQUE,
        trackName TEXT,
        artistName TEXT,
        albumArt TEXT,
        addedAt INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Playback stats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS playback_stats (
        id INTEGER PRIMARY KEY,
        songsPlayed INTEGER DEFAULT 0,
        listeningHours REAL DEFAULT 0,
        mostPlayedArtists TEXT,
        dailyListeningTime TEXT,
        weeklyListeningTime TEXT,
        monthlyListeningTime TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Playback history table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS playback_history (
        id INTEGER PRIMARY KEY,
        trackId TEXT,
        trackName TEXT,
        artistName TEXT,
        playedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  getSettings(): Settings | null {
    const stmt = this.db.prepare('SELECT * FROM settings LIMIT 1');
    return stmt.get() as Settings | undefined || null;
  }

  saveSettings(settings: Settings): void {
    const existing = this.getSettings();
    const stmt = existing
      ? this.db.prepare(`
          UPDATE settings SET
          theme = ?, autoStart = ?, alwaysOnTop = ?, overlayOpacity = ?,
          transparencySlider = ?, fontSize = ?, fontFamily = ?,
          accentColor = ?, enableAnimations = ?, enableKaraokeMode = ?,
          showNotifications = ?
          WHERE id = 1
        `)
      : this.db.prepare(`
          INSERT INTO settings (
          theme, autoStart, alwaysOnTop, overlayOpacity, transparencySlider,
          fontSize, fontFamily, accentColor, enableAnimations,
          enableKaraokeMode, showNotifications
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    stmt.run(
      settings.theme,
      settings.autoStart ? 1 : 0,
      settings.alwaysOnTop ? 1 : 0,
      settings.overlayOpacity,
      settings.transparencySlider,
      settings.fontSize,
      settings.fontFamily,
      settings.accentColor,
      settings.enableAnimations ? 1 : 0,
      settings.enableKaraokeMode ? 1 : 0,
      settings.showNotifications ? 1 : 0,
    );
  }

  getLyricsCache(trackId: string): LyricsCache | null {
    const stmt = this.db.prepare('SELECT * FROM lyrics_cache WHERE trackId = ?');
    const row = stmt.get(trackId) as any;
    if (!row) return null;

    return {
      trackId: row.trackId,
      artist: row.artist,
      track: row.track,
      lyrics: row.lyrics,
      syncedLyrics: row.syncedLyrics ? JSON.parse(row.syncedLyrics) : null,
      cachedAt: row.cachedAt,
    };
  }

  saveLyricsCache(trackId: string, cache: LyricsCache): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO lyrics_cache
      (trackId, artist, track, lyrics, syncedLyrics, cachedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      trackId,
      cache.artist,
      cache.track,
      cache.lyrics,
      cache.syncedLyrics ? JSON.stringify(cache.syncedLyrics) : null,
      cache.cachedAt,
    );
  }

  addFavoriteSong(song: FavoriteSong): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO favorite_songs
      (trackId, trackName, artistName, albumArt, addedAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(song.trackId, song.trackName, song.artistName, song.albumArt, song.addedAt);
  }

  removeFavoriteSong(trackId: string): void {
    const stmt = this.db.prepare('DELETE FROM favorite_songs WHERE trackId = ?');
    stmt.run(trackId);
  }

  getFavoriteSongs(): FavoriteSong[] {
    const stmt = this.db.prepare('SELECT * FROM favorite_songs ORDER BY addedAt DESC');
    return stmt.all() as FavoriteSong[];
  }

  getPlaybackStats(): PlaybackStats | null {
    const stmt = this.db.prepare('SELECT * FROM playback_stats LIMIT 1');
    const row = stmt.get() as any;
    if (!row) return null;

    return {
      songsPlayed: row.songsPlayed || 0,
      listeningHours: row.listeningHours || 0,
      mostPlayedArtists: row.mostPlayedArtists ? JSON.parse(row.mostPlayedArtists) : [],
      dailyListeningTime: row.dailyListeningTime ? JSON.parse(row.dailyListeningTime) : {},
      weeklyListeningTime: row.weeklyListeningTime ? JSON.parse(row.weeklyListeningTime) : {},
      monthlyListeningTime: row.monthlyListeningTime
        ? JSON.parse(row.monthlyListeningTime)
        : {},
    };
  }

  savePlaybackStats(stats: PlaybackStats): void {
    const existing = this.getPlaybackStats();
    const stmt = existing
      ? this.db.prepare(`
          UPDATE playback_stats SET
          songsPlayed = ?, listeningHours = ?, mostPlayedArtists = ?,
          dailyListeningTime = ?, weeklyListeningTime = ?, monthlyListeningTime = ?
          WHERE id = 1
        `)
      : this.db.prepare(`
          INSERT INTO playback_stats
          (songsPlayed, listeningHours, mostPlayedArtists,
           dailyListeningTime, weeklyListeningTime, monthlyListeningTime)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

    stmt.run(
      stats.songsPlayed,
      stats.listeningHours,
      JSON.stringify(stats.mostPlayedArtists),
      JSON.stringify(stats.dailyListeningTime),
      JSON.stringify(stats.weeklyListeningTime),
      JSON.stringify(stats.monthlyListeningTime),
    );
  }

  close(): void {
    if (db) {
      db.close();
      db = null;
    }
  }
}

export const databaseService = new DatabaseService();
