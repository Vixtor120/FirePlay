import Link from 'next/link';
import { getPopularGames } from '../../lib/requests';
import GameCard from '../../components/GameCard';
import { Suspense } from 'react';

// Componente de carga mientras se obtienen los juegos
function GamesLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse rounded-lg overflow-hidden bg-slate-800/50 h-[280px]">
          <div className="h-[160px] bg-slate-700/60"></div>
          <div className="p-3">
            <div className="h-5 bg-slate-700/80 rounded mb-2 w-2/3"></div>
            <div className="h-4 bg-slate-700/80 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para obtener y mostrar juegos
async function PopularGames() {
  const games = await getPopularGames(1, 4);
  
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-8 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <p className="text-slate-400">No se pudieron cargar los juegos.</p>
        <button className="mt-3 text-violet-400 hover:text-violet-300" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Banner promocional mejorado sin imagen */}
      <section className="relative mb-12 px-6 py-12 bg-gradient-to-r from-violet-900/30 to-indigo-900/30 rounded-xl border border-violet-800/30 overflow-hidden text-center md:text-left">
        <div className="absolute inset-0 bg-[url('/pattern-dot.svg')] opacity-10"></div>
        
        {/* Fondo con gradientes animados para darle dinamismo */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        {/* Contenido */}
        <div className="relative z-10 max-w-xl mx-auto md:mx-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight">
            <span className="text-white">Descubre los </span>
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              mejores juegos
            </span>
          </h1>
          
          <p className="text-slate-300 mb-8 text-lg md:pr-4">
            Encuentra tus títulos favoritos en nuestra tienda a los mejores precios. 
            Contamos con una amplia selección para todas las plataformas.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link 
              href="/search" 
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 shadow-lg shadow-violet-600/20"
            >
              Explorar catálogo
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link 
              href="/register" 
              className="bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Sección destacada */}
      <section className="mb-12">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Juegos destacados
          </h2>
          <Link href="/search" className="flex items-center text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
            <span>Ver todos</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <Suspense fallback={<GamesLoading />}>
          <PopularGames />
        </Suspense>
      </section>

      {/* Categorías - Diseño moderno y simple */}
      <section className="mb-12">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Categorías
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {name: 'Acción', icon: '🎯', color: 'bg-gradient-to-br from-rose-600/80 to-rose-900/80'},
            {name: 'Aventura', icon: '🗺️', color: 'bg-gradient-to-br from-emerald-600/80 to-emerald-900/80'},
            {name: 'RPG', icon: '⚔️', color: 'bg-gradient-to-br from-amber-600/80 to-amber-900/80'},
            {name: 'Estrategia', icon: '🧩', color: 'bg-gradient-to-br from-blue-600/80 to-blue-900/80'},
          ].map((category) => (
            <Link 
              href={`/search?category=${category.name}`}
              key={category.name}
              className="relative rounded-lg overflow-hidden group h-24 hover:scale-[1.02] transition-transform"
            >
              <div className={`absolute inset-0 ${category.color}`}></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                <h3 className="text-white font-medium text-sm md:text-base">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action - Modernizado */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/cta-pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative p-8 md:p-10 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:flex-1 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-3 text-white">¿Listo para comenzar?</h2>
            <p className="text-slate-300 max-w-md mx-auto md:mx-0">
              Crea tu cuenta y disfruta de ofertas exclusivas, guarda tus favoritos y compra juegos al instante.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg transition-colors text-center sm:w-auto">
              Crear cuenta
            </Link>
            <Link href="/login" className="bg-transparent border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg transition-colors text-center sm:w-auto">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}