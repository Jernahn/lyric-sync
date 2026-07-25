import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spotify } from 'lucide-react';
import { spotifyService } from '@/services/SpotifyService';
import { useAppStore } from '@/store';

export const SpotifyAuth: React.FC = () => {
  const { setSpotifyToken } = useAppStore();

  useEffect(() => {
    // Check for auth code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      authenticateWithSpotify(code);
    }
  }, []);

  const authenticateWithSpotify = async (code: string) => {
    try {
      const response = await spotifyService.authenticate(code);
      localStorage.setItem('spotify_token', response.access_token);
      localStorage.setItem('spotify_refresh_token', response.refresh_token || '');
      localStorage.setItem('spotify_token_expiry', (Date.now() + response.expires_in * 1000).toString());
      setSpotifyToken(response.access_token);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleLogin = () => {
    const authUrl = spotifyService.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-spotify via-gray-900 to-black gap-8"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Spotify className="w-20 h-20 text-white" />
      </motion.div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">LyricSync</h1>
        <p className="text-gray-400 text-lg">Real-time synchronized lyrics for Spotify</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        className="px-8 py-3 bg-spotify hover:bg-green-600 text-white font-bold rounded-full transition-colors"
      >
        Connect with Spotify
      </motion.button>
    </motion.div>
  );
};
