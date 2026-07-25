import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { useSpotifyService } from '@/hooks/useSpotifyService';
import { MainWindow } from '@/pages/MainWindow';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './App.css';

function App() {
  const { initializeSettings } = useAppStore();
  const { initializeSpotify } = useSpotifyService();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeSettings();
        await initializeSpotify();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initialize();
  }, []);

  return (
    <ThemeProvider>
      <MainWindow />
    </ThemeProvider>
  );
}

export default App;
