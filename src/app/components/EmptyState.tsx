import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState = ({
  message = 'No se encontraron resultados',
  description = 'Intenta con otro término de búsqueda',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <SearchX className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-[#98c1d9] mb-2">{message}</h3>
      <p className="text-center max-w-md text-[#868b93]">{description}</p>
    </div>
  );
};