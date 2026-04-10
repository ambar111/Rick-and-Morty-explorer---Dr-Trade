import { Character } from '../types/character';
import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const CharacterCard = ({
  character,
  isFavorite,
  onToggleFavorite,
}: CharacterCardProps) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-[#1b263b]/95 backdrop-blur-sm border-2 border-[#97ce4c]/20 hover:border-[#97ce4c]/50 relative group">
        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#97ce4c]/0 via-[#00b5cc]/0 to-[#f77f00]/0 group-hover:from-[#97ce4c]/10 group-hover:via-[#00b5cc]/10 group-hover:to-[#f77f00]/10 transition-all duration-300 pointer-events-none" />
        
        <Link to={`/character/${character.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <Badge
              className={`absolute top-3 left-3 ${getStatusColor(character.status)} text-white font-semibold border-0 shadow-lg backdrop-blur-sm`}
            >
              {character.status}
            </Badge>
          </div>
        </Link>
        <CardContent className="p-5 relative z-10">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link to={`/character/${character.id}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 truncate text-[#e0fbfc] hover:text-[#97ce4c] transition-all duration-300">
                {character.name}
              </h3>
            </Link>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(character.id);
                }}
                className="shrink-0 hover:bg-[#d62828]/20"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFavorite ? 'fill-[#d62828] text-[#d62828]' : 'text-[#98c1d9]'
                  }`}
                />
              </Button>
            </motion.div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1b2a]/80 border border-[#97ce4c]/20">
              <span className="text-lg">🧬</span>
              <span className="font-semibold text-[#97ce4c]">Especie:</span>
              <span className="text-[#e0fbfc]">{character.species}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1b2a]/80 border border-[#00b5cc]/20">
              <MapPin className="w-4 h-4 text-[#00b5cc]" />
              <span className="font-semibold text-[#00b5cc]">Origen:</span>
              <span className="truncate text-[#e0fbfc]">{character.origin.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};