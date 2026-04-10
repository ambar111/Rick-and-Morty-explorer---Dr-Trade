import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <p className="mt-4 text-gray-600">Cargando...</p>
    </div>
  );
};
