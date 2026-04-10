import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CharacterDetail } from './pages/CharacterDetail';
import { Favorites } from './pages/Favorites';
import { Stats } from './pages/Stats';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/character/:id',
    element: (
      <Layout>
        <CharacterDetail />
      </Layout>
    ),
  },
  {
    path: '/favorites',
    element: (
      <Layout>
        <Favorites />
      </Layout>
    ),
  },
  {
    path: '/stats',
    element: (
      <Layout>
        <Stats />
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);
