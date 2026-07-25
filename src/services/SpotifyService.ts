import axios, { AxiosInstance } from 'axios';
import type { SpotifyPlaybackState, SpotifyTrack, SpotifyTokenResponse } from '@/types';

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';

export class SpotifyService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: SPOTIFY_API_ENDPOINT,
    });
  }

  async authenticate(code: string): Promise<SpotifyTokenResponse> {
    try {
      const response = await axios.post<SpotifyTokenResponse>(
        SPOTIFY_TOKEN_ENDPOINT,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token || null;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;

      return response.data;
    } catch (error) {
      console.error('Spotify authentication failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<SpotifyTokenResponse>(
        SPOTIFY_TOKEN_ENDPOINT,
        {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    if (Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
  }

  async getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
    await this.ensureValidToken();

    try {
      const response = await this.client.get<SpotifyPlaybackState>('/me/player/currently-playing');
      return response.data || null;
    } catch (error) {
      console.error('Failed to get current playback:', error);
      return null;
    }
  }

  async play(): Promise<void> {
    await this.ensureValidToken();

    try {
      await this.client.put('/me/player/play');
    } catch (error) {
      console.error('Failed to play:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    await this.ensureValidToken();

    try {
      await this.client.put('/me/player/pause');
    } catch (error) {
      console.error('Failed to pause:', error);
      throw error;
    }
  }

  async nextTrack(): Promise<void> {
    await this.ensureValidToken();

    try {
      await this.client.post('/me/player/next');
    } catch (error) {
      console.error('Failed to skip to next:', error);
      throw error;
    }
  }

  async previousTrack(): Promise<void> {
    await this.ensureValidToken();

    try {
      await this.client.post('/me/player/previous');
    } catch (error) {
      console.error('Failed to go to previous:', error);
      throw error;
    }
  }

  async seek(positionMs: number): Promise<void> {
    await this.ensureValidToken();

    try {
      await this.client.put(`/me/player/seek?position_ms=${positionMs}`);
    } catch (error) {
      console.error('Failed to seek:', error);
      throw error;
    }
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
      scope: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
      ].join(' '),
    });

    return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export const spotifyService = new SpotifyService();
