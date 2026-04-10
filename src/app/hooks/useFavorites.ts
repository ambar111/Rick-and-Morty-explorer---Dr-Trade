import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'rickandmorty-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (characterId: number) => {
    setFavorites((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  };

  const isFavorite = (characterId: number) => favorites.includes(characterId);

  const removeFavorite = (characterId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== characterId));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
  };
};
