import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { rickAndMortyApi } from '../services/rickAndMortyApi';
import { Character } from '../types/character';
import { useFavorites } from '../hooks/useFavorites';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, ArrowLeft, Users, Dna, MapPin, Globe, Tv, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await rickAndMortyApi.getCharacterById(parseInt(id));
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!character) return;
    toggleFavorite(character.id);
    if (isFavorite(character.id)) {
      toast.success(`${character.name} eliminado de favoritos`);
    } else {
      toast.success(`${character.name} añadido a favoritos`);
    }
  };

  if (loading) return <LoadingState />;
  if (error || !character) {
    return (
      <ErrorState
        message={error || 'Personaje no encontrado'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'Dead':
        return 'bg-gradient-to-r from-red-400 to-rose-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-purple-50 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative">
            <img
              src={character.image}
              alt={character.name}
              className="w-full rounded-3xl shadow-2xl border-4 border-white/50"
            />
            <Badge
              className={`absolute top-6 left-6 ${getStatusColor(
                character.status
              )} text-white text-lg px-6 py-2 border-0 shadow-lg backdrop-blur-sm`}
            >
              {character.status}
            </Badge>
            
            {/* Floating heart button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-6 right-6"
            >
              <Button
                size="lg"
                onClick={handleToggleFavorite}
                className={`rounded-2xl shadow-2xl ${
                  isFavorite(character.id)
                    ? 'bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700'
                    : 'bg-white/90 hover:bg-white text-gray-700'
                } backdrop-blur-sm border-2 border-white/50`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isFavorite(character.id) ? 'fill-white text-white' : 'text-red-500'
                  }`}
                />
                {isFavorite(character.id) ? 'Favorito' : 'Agregar'}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {character.name}
            </h1>
            <p className="text-gray-500 text-lg">ID: #{character.id}</p>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 p-2 rounded-xl">
                    <Dna className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">Especie</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{character.species}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 p-2 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">Género</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{character.gender}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-200 shadow-xl hover:shadow-2xl transition-all">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Información Detallada
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {character.type && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Dna className="w-4 h-4 text-orange-600" />
                      <h3 className="text-sm font-semibold text-orange-800">
                        Tipo
                      </h3>
                    </div>
                    <p className="text-gray-700">{character.type}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-green-800">
                      Origen
                    </h3>
                  </div>
                  <p className="text-gray-700">{character.origin.name}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-800">
                      Última ubicación conocida
                    </h3>
                  </div>
                  <p className="text-gray-700">{character.location.name}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Tv className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-purple-800">
                      Apariciones en episodios
                    </h3>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {character.episode.length} episodios
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};