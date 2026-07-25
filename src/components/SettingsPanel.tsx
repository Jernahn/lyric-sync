import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';
import type { Settings } from '@/types';

const THEMES: Array<Settings['theme']> = ['dark', 'light', 'oled', 'spotify', 'glassmorphism', 'neon'];

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: Settings['theme']) => {
    setTheme(theme);
    updateSettings({ theme });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-y-auto p-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
      </div>

      {/* Themes */}
      <div>
        <label className="block text-sm font-semibold mb-4">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <motion.button
              key={theme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThemeChange(theme)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                settings.theme === theme
                  ? 'bg-spotify text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {theme}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-semibold mb-4">
          Font Size: {settings.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="32"
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Overlay Opacity */}
      <div>
        <label className="block text-sm font-semibold mb-4">
          Overlay Opacity: {Math.round(settings.overlayOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.overlayOpacity}
          onChange={(e) => updateSettings({ overlayOpacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        {[
          { key: 'autoStart', label: 'Auto-start on system startup' },
          { key: 'alwaysOnTop', label: 'Always on top' },
          { key: 'enableAnimations', label: 'Enable animations' },
          { key: 'enableKaraokeMode', label: 'Enable karaoke mode' },
          { key: 'showNotifications', label: 'Show notifications' },
        ].map(({ key, label }) => (
          <motion.button
            key={key}
            whileHover={{ x: 2 }}
            onClick={() =>
              updateSettings({
                [key]: !settings[key as keyof Settings],
              })
            }
            className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-sm">{label}</span>
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                settings[key as keyof Settings]
                  ? 'bg-spotify'
                  : 'bg-gray-700'
              }`}
            >
              <motion.div
                layout
                className="w-5 h-5 bg-white rounded-full m-0.5"
                animate={{
                  x: settings[key as keyof Settings] ? 18 : 0,
                }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
