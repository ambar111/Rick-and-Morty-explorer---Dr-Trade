import { Search, X, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onStatusChange?: (status: string) => void;
  currentStatus?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Buscar personaje...',
  onStatusChange,
  currentStatus = '',
}: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: '', label: 'All', color: '#98c1d9' },
    { value: 'alive', label: 'Alive', color: '#97ce4c' },
    { value: 'dead', label: 'Dead', color: '#d62828' },
    { value: 'unknown', label: 'Unknown', color: '#f77f00' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full flex gap-2"
    >
      <div className="relative group flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-[#97ce4c] via-[#00b5cc] to-[#f77f00] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
        <div className="relative bg-[#1b263b]/95 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#97ce4c]/30 group-hover:border-[#97ce4c]/50 transition-all">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#97ce4c]" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-12 pr-12 h-14 border-2 border-transparent focus:border-[#97ce4c] rounded-2xl text-base bg-transparent text-[#e0fbfc] placeholder:text-[#98c1d9]/60 font-medium"
          />
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange('')}
                className="h-10 w-10 rounded-xl hover:bg-[#d62828]/20"
              >
                <X className="w-5 h-5 text-[#98c1d9] hover:text-[#d62828]" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Filter Button */}
      <div className="relative" ref={filterRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00b5cc] to-[#97ce4c] rounded-2xl blur opacity-25 hover:opacity-40 transition-opacity" />
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`relative h-14 px-6 rounded-2xl font-medium transition-all border-2 ${
            currentStatus
              ? 'bg-[#00b5cc]/90 border-[#00b5cc] text-white shadow-lg shadow-[#00b5cc]/30'
              : 'bg-[#1b263b]/95 border-[#00b5cc]/30 hover:border-[#00b5cc]/50 text-[#e0fbfc]'
          }`}
        >
          <Filter className="w-5 h-5" />
        </Button>

        {/* Dropdown */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-[#1b263b]/95 backdrop-blur-sm border-2 border-[#00b5cc]/30 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange?.(option.value);
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${
                  currentStatus === option.value
                    ? 'bg-[#00b5cc]/20 text-[#e0fbfc] font-bold'
                    : 'text-[#98c1d9] hover:bg-[#00b5cc]/10 hover:text-[#e0fbfc]'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};