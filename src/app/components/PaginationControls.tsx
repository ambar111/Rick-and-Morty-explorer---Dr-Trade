import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-2 mt-12"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border-2 border-[#97ce4c]/30 bg-[#1b263b]/90 text-[#e0fbfc] hover:border-[#97ce4c] hover:bg-[#97ce4c]/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-2 bg-[#1b263b]/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#97ce4c]/30">
        {getPageNumbers().map((page, index) => (
          <div key={typeof page === 'number' ? `page-${page}` : `ellipsis-${index}`}>
            {page === '...' ? (
              <span className="px-2 text-[#98c1d9]">...</span>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => onPageChange(page as number)}
                  className={`rounded-xl ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#97ce4c] to-[#00b5cc] text-[#0d1b2a] font-bold shadow-lg'
                      : 'text-[#e0fbfc] hover:bg-[#97ce4c]/20 hover:text-[#97ce4c]'
                  }`}
                >
                  {page}
                </Button>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border-2 border-[#97ce4c]/30 bg-[#1b263b]/90 text-[#e0fbfc] hover:border-[#97ce4c] hover:bg-[#97ce4c]/20 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};