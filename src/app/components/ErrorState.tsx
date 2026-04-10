import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = 'Ha ocurrido un error al cargar los datos',
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Reintentar
        </Button>
      )}
    </div>
  );
};
