import Link from 'next/link';
import { getPopularGames } from '../../lib/requests';
import GameCard from '../../components/GameCard';
import { Suspense } from 'react';
import TrendingGameCard from '../../components/TrendingGameCard';

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

      {/* Nueva sección de Trending Games con iconos */}
      <section className="mb-12 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending ahora
          </h2>
          <Link href="/search?sort=popularity" className="flex items-center text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
            <span>Ver tendencias</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* Grid de tarjetas de tendencia con iconos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrendingGameCard 
            title="Aventuras de Acción" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
            genre="Acción" 
            gradient="linear-gradient(135deg, rgba(225,29,72,0.7) 0%, rgba(153,27,78,0.85) 100%)"
            accentColor="text-rose-300"
          />
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <TrendingGameCard 
              title="Mundos Abiertos" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              }
              genre="Aventura" 
              gradient="linear-gradient(135deg, rgba(16,185,129,0.7) 0%, rgba(5,150,105,0.85) 100%)"
              accentColor="text-emerald-300"
            />
            <TrendingGameCard 
              title="Estrategia" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                </svg>
              }
              genre="Estrategia" 
              gradient="linear-gradient(135deg, rgba(37,99,235,0.7) 0%, rgba(29,78,216,0.85) 100%)"
              accentColor="text-blue-300"
            />
          </div>
          <TrendingGameCard 
            title="Fantasía RPG" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            }
            genre="RPG" 
            gradient="linear-gradient(135deg, rgba(245,158,11,0.7) 0%, rgba(217,119,6,0.85) 100%)"
            accentColor="text-amber-300"
          />
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