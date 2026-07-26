import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';

export const useKeyboardShortcuts = () => {
  const { settings, updateSettings } = useAppStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+L - Toggle overlay
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        window.electron.ipcRenderer.invoke('toggle-overlay');
      }

      // Ctrl+Shift+T - Cycle themes
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        const themes: Array<typeof settings.theme> = [
          'dark',
          'light',
          'oled',
          'spotify',
          'glassmorphism',
          'neon',
        ];
        const currentIndex = themes.indexOf(settings.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
        updateSettings({ theme: nextTheme });
      }

      // Ctrl++ - Increase font size
      if ((event.ctrlKey || event.metaKey) && event.key === '+') {
        event.preventDefault();
        updateSettings({
          fontSize: Math.min(settings.fontSize + 2, 32),
        });
      }

      // Ctrl+- - Decrease font size
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        updateSettings({
          fontSize: Math.max(settings.fontSize - 2, 12),
        });
      }

      // Space - Play/Pause (when not focused on input)
      if (
        event.key === ' ' &&
        event.target instanceof HTMLElement &&
        !['INPUT', 'TEXTAREA'].includes(event.target.tagName)
      ) {
        event.preventDefault();
        window.electron.ipcRenderer.invoke('toggle-playback');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings, updateSettings, setTheme]);
};
