import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { useNotification } from '@/components/NotificationContainer';

export const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  const { notify } = useNotification();

  const isFavorited = useCallback(
    (trackId: string) => {
      return favorites.some((fav) => fav.trackId === trackId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (trackId: string, trackName: string, artistName: string, albumArt: string) => {
      if (isFavorited(trackId)) {
        removeFavorite(trackId);
        notify('info', 'Removed from favorites', undefined, 2000);
      } else {
        addFavorite({
          id: trackId,
          trackId,
          trackName,
          artistName,
          albumArt,
          addedAt: Date.now(),
        });
        notify('success', 'Added to favorites', undefined, 2000);
      }
    },
    [isFavorited, addFavorite, removeFavorite, notify],
  );

  return {
    favorites,
    isFavorited,
    toggleFavorite,
  };
};
