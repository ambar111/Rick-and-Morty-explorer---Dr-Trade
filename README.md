# 🛸 Rick & Morty Explorer

Portal web para explorar el universo de Rick and Morty. Permite buscar personajes, ver su detalle, marcarlos como favoritos y visualizar estadísticas generales, consumiendo la [Rick and Morty API](https://rickandmortyapi.com/).

🔗 **Demo en vivo:** [rick-and-morty-explorer-dr-trade.vercel.app](https://rick-and-morty-explorer-dr-trade.vercel.app)  
📁 **Repositorio:** [github.com/ambar111/Rick-and-Morty-explorer---DR-Trade](https://github.com/ambar111/Rick-and-Morty-explorer---DR-Trade)


---

## 🛠 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 18.3.1 | Framework principal |
| **TypeScript** | — | Tipado estático en todo el proyecto |
| **Vite** | 6.3.5 | Bundler y servidor de desarrollo |
| **Tailwind CSS** | 4.1.12 | Estilos y diseño responsive |
| **React Router** | 7.13.0 | Enrutamiento entre páginas |
| **Recharts** | 2.15.2 | Gráficos de estadísticas |
| **shadcn/ui + Radix UI** | — | Componentes de interfaz accesibles |
| **Motion** | 12.23.24 | Animaciones de transición |
| **Sonner** | 2.0.3 | Notificaciones toast |
| **Lucide React** | 0.487.0 | Iconografía |

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- **Node.js** v18 o superior
- **npm** v9 o superior

### Instalación y ejecución

```bash
# 1. Clona el repositorio
git clone https://github.com/ambar111/Rick-and-Morty-explorer---DR-Trade.git

# 2. Entra al directorio
cd Rick-and-Morty-explorer---DR-Trade

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### Build de producción

```bash
npm run build
```

Los archivos compilados quedarán en la carpeta `/dist`.

> **Nota:** No requiere ninguna variable de entorno ni API key. Consume directamente la API pública de Rick and Morty en `https://rickandmortyapi.com/api`.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/               # Componentes base de shadcn/ui (Button, Card, Badge, etc.)
│   │   ├── CharacterCard.tsx # Tarjeta de personaje con botón de favorito
│   │   ├── SearchBar.tsx     # Barra de búsqueda con filtro de estado
│   │   ├── PaginationControls.tsx  # Navegación entre páginas
│   │   ├── LoadingState.tsx  # Indicador de carga
│   │   ├── ErrorState.tsx    # Pantalla de error con retry
│   │   ├── EmptyState.tsx    # Pantalla de lista vacía
│   │   └── Layout.tsx        # Layout general con navbar
│   ├── hooks/
│   │   └── useFavorites.ts   # Hook de favoritos con persistencia en localStorage
│   ├── pages/
│   │   ├── Home.tsx          # Listado principal con búsqueda y paginación
│   │   ├── CharacterDetail.tsx  # Vista de detalle del personaje
│   │   ├── Favorites.tsx     # Lista de favoritos
│   │   ├── Stats.tsx         # Gráficos de estadísticas
│   │   └── NotFound.tsx      # Página 404
│   ├── services/
│   │   └── rickAndMortyApi.ts  # Capa de acceso a la API (fetch centralizado)
│   ├── types/
│   │   └── character.ts      # Interfaces TypeScript: Character, ApiResponse
│   └── routes.tsx            # Definición de rutas con React Router
├── styles/
│   ├── tailwind.css
│   ├── theme.css             # Variables de tema (colores Rick & Morty)
│   └── index.css
└── main.tsx
```

---

## 🧠 Decisiones técnicas

### React + Vite en lugar de Next.js
La prueba menciona Next.js como preferido, pero se eligió React con Vite porque la aplicación no requiere SSR (Server Side Rendering — renderizado en el servidor) ni generación estática de páginas. Al ser una SPA (Single Page Application — aplicación de una sola página) que consume una API pública sin requisitos de SEO (Search Engine Optimization — posicionamiento en buscadores), Vite ofrece una configuración más ligera y un ciclo de desarrollo más rápido. En un entorno productivo con requisitos de SEO, Next.js sería la elección correcta.

### `fetch` nativo en lugar de axios
Se usó `fetch` nativo para mantener las dependencias al mínimo. Toda la lógica de peticiones está centralizada en `rickAndMortyApi.ts`, lo que permite migrar a axios u otro cliente HTTP en el futuro sin modificar ningún componente.

### Custom hook `useFavorites`
La lógica de favoritos (estado en memoria, sincronización con `localStorage`, toggle y remove) está encapsulada en un custom hook reutilizable. Esto permite consumirlo desde cualquier página — Home, Detalle y Favoritos — sin duplicar código.

### Debounce de 500ms en el buscador
Para evitar llamadas a la API en cada keystroke, la búsqueda espera 500ms desde que el usuario deja de escribir antes de disparar la petición. Esto reduce significativamente las llamadas innecesarias y mejora la experiencia de usuario.

### `localStorage` para persistencia de favoritos
Se eligió `localStorage` por ser la solución más directa para persistir datos en el cliente sin necesidad de backend. En una aplicación real, esta lógica se reemplazaría por una API propia o un servicio como Supabase.

### Manejo del edge case de la API
La API de Rick and Morty devuelve un objeto cuando se consulta un único ID, pero un array cuando se consultan varios. Esto se maneja explícitamente en `getMultipleCharacters` con `Array.isArray(data) ? data : [data]` para evitar errores en la página de favoritos.

### shadcn/ui + Radix UI para componentes
Se usaron componentes accesibles de Radix UI a través de shadcn/ui para mantener buenas prácticas de accesibilidad (ARIA, navegación por teclado) sin construir desde cero.

### Recharts para gráficos
Se eligió Recharts por su integración natural con React, componentes declarativos, buen soporte de TypeScript y documentación clara.

---

## 🔮 Qué mejoraría con más tiempo

- **React Query / SWR:** Reemplazaría la gestión manual de estados de carga y error (`useState` + `useEffect`) por React Query, que ofrece caché automático, revalidación, reintentos y estados de carga más robustos sin código repetitivo.

- **Migración a Next.js:** Aprovechar Server Components, SSR (Server Side Rendering) y mejor rendimiento inicial de carga, además de mejorar el SEO de la aplicación.

- **Optimización de la página de Stats:** Actualmente hace hasta ~42 peticiones simultáneas con `Promise.all` para obtener todos los personajes. Lo mejoraría con carga progresiva por páginas o cacheando los resultados en un estado global con Zustand o Context.

- **Tests con Vitest + React Testing Library:** Añadiría tests unitarios e integración para el hook `useFavorites` y la capa de servicio `rickAndMortyApi`, garantizando que la lógica crítica no se rompa con futuros cambios.

- **Filtros adicionales en el listado:** Agregar filtros por especie y género aprovechando que la API ya soporta estos parámetros de query (`?species=Human&gender=Female`).

- **Infinite scroll:** Ofrecer scroll infinito como alternativa a la paginación por botones, mejorando la experiencia especialmente en dispositivos móviles.

- **Mejoras de accesibilidad (a11y):** Revisar contraste de colores, añadir `aria-labels` en botones de icono y asegurar navegación completa por teclado.

---

## 📄 Licencia

Proyecto desarrollado como prueba técnica para Dr Trade.  
Los datos pertenecen a [The Rick and Morty API](https://rickandmortyapi.com/) — creada por Axel Fuhrmann.
  