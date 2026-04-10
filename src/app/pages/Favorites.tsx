import { useState, useEffect } from 'react';
import { rickAndMortyApi } from '../services/rickAndMortyApi';
import { Character } from '../types/character';
import { useFavorites } from '../hooks/useFavorites';
import { CharacterCard } from '../components/CharacterCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const Favorites = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await rickAndMortyApi.getMultipleCharacters(favorites);
        setCharacters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const handleToggleFavorite = (id: number) => {
    const character = characters.find((c) => c.id === id);
    toggleFavorite(id);
    if (character) {
      toast.success(`${character.name} eliminado de favoritos`);
    }
  };

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-[#d62828] fill-[#d62828]" />
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#d62828] via-[#e63946] to-[#ff4d6d] bg-clip-text text-transparent">
              Mis Favoritos
            </h1>
            
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#e0fbfc] text-lg font-medium"
          >
            {favorites.length === 0
              ? 'No tienes personajes favoritos aún'
              : `${favorites.length} personaje${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}`}
          </motion.p>
        </motion.div>
      </div>

      {characters.length === 0 ? (
        <EmptyState
          message="No tienes favoritos"
          description="Explora los personajes y añade tus favoritos haciendo clic en el corazón"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CharacterCard
                character={character}
                isFavorite={isFavorite(character.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};