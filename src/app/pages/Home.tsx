import { useState, useEffect } from 'react';
import { rickAndMortyApi } from '../services/rickAndMortyApi';
import { Character } from '../types/character';
import { useFavorites } from '../hooks/useFavorites';
import { CharacterCard } from '../components/CharacterCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { PaginationControls } from '../components/PaginationControls';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const Home = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await rickAndMortyApi.getCharacters(
          currentPage,
          debouncedSearchTerm || undefined,
          statusFilter || undefined
        );
        setCharacters(data.results);
        setTotalPages(data.info.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const handleToggleFavorite = (id: number) => {
    toggleFavorite(id);
    const character = characters.find((c) => c.id === id);
    if (character) {
      if (isFavorite(id)) {
        toast.success(`${character.name} eliminado de favoritos`);
      } else {
        toast.success(`${character.name} añadido a favoritos`);
      }
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#97ce4c] via-[#6fb83e] to-[#4a9028] bg-clip-text text-transparent">
              Personajes de Rick & Morty
            </h1>
          </div>
          <p className="text-[#e0fbfc] text-lg font-medium">
            Explora todos los personajes del multiverso
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 max-w-2xl mx-auto"
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar personaje por nombre..."
          onStatusChange={setStatusFilter}
          currentStatus={statusFilter}
        />
      </motion.div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : characters.length === 0 ? (
        <EmptyState
          message="No se encontraron personajes"
          description={
            debouncedSearchTerm
              ? `No hay resultados para "${debouncedSearchTerm}"`
              : 'No hay personajes disponibles'
          }
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </motion.div>
  );
};