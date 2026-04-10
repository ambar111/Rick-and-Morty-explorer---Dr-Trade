import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Página no encontrada
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button size="lg">
          <Home className="w-5 h-5 mr-2" />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
};
