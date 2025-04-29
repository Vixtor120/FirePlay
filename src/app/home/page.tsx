import Link from 'next/link';
import Image from 'next/image';
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
      {/* Hero Section - Featured Section with Image */}
      <section className="relative mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900 to-indigo-900 opacity-90 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="/hero-games-bg.jpg" 
            alt="Colección de juegos" 
            fill 
            className="object-cover opacity-30" 
            priority 
          />
        </div>
        <div className="relative z-20 py-20 px-6 md:px-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="inline-block py-1.5 px-4 bg-violet-600 bg-opacity-70 backdrop-blur-sm rounded-full text-sm font-medium text-white">
              La nueva era del gaming digital
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Tu destino de <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">juegos digitales</span> al mejor precio
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Miles de juegos, ofertas exclusivas y novedades a diario. Únete a la comunidad FirePlay y lleva tu experiencia gaming al siguiente nivel.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/search" className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg shadow-violet-700/30 transition-all hover:scale-105">
              Explorar catálogo
            </Link>
            <Link href="/register" className="bg-slate-800 backdrop-blur-sm bg-opacity-70 hover:bg-opacity-100 text-white border border-slate-600 px-8 py-3 rounded-lg transition-all hover:border-violet-500">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* What is FirePlay Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">¿Qué es FirePlay?</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-purple-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-violet-900/10">
              <div className="relative h-80">
                <Image 
                  src="/logo.png" 
                  alt="Sobre FirePlay" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-300 text-lg">
                FirePlay es una plataforma digital de compra y venta de videojuegos que te permite acceder a los mejores títulos del mercado a precios competitivos.
              </p>
              <p className="text-slate-300">
                Nuestra misión es hacer que los juegos sean accesibles para todos los jugadores, ofreciendo una experiencia de compra sencilla, segura y con beneficios exclusivos para nuestra comunidad.
              </p>
              
              {/* Developers information - New addition */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mt-4">
                <h3 className="text-white text-lg font-medium mb-2">Desarrollado por</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xs mr-2">
                      VH
                    </div>
                    <span className="text-slate-300">Víctor Hidalgo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xs mr-2">
                      AG
                    </div>
                    <span className="text-slate-300">Alejandro Gómez</span>
                  </div>
                </div>
                <Link href="/info" className="text-violet-400 hover:text-violet-300 text-sm inline-block mt-2">
                  Más información sobre el proyecto
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                  <div className="text-violet-400 font-bold text-3xl mb-1">5K+</div>
                  <div className="text-slate-400">Juegos disponibles</div>
                </div>
                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                  <div className="text-violet-400 font-bold text-3xl mb-1">24/7</div>
                  <div className="text-slate-400">Soporte técnico</div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/about" className="text-violet-400 hover:text-violet-300 flex items-center font-medium">
                  Conocer más sobre nosotros
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="mb-16 bg-slate-800/50 py-16 rounded-2xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">¿Cómo funciona?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Comprar tus juegos favoritos nunca ha sido tan fácil. Sigue estos simples pasos y comienza a disfrutar de tu biblioteca digital.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-purple-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-violet-500 transition-all">
              <div className="bg-violet-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Busca tu juego</h3>
              <p className="text-slate-300">
                Explora nuestro extenso catálogo o utiliza nuestro buscador para encontrar rápidamente el juego que deseas.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-violet-500 transition-all">
              <div className="bg-violet-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Realiza tu compra</h3>
              <p className="text-slate-300">
                Añade el juego a tu carrito, selecciona tu método de pago preferido y completa la transacción de manera segura.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-violet-500 transition-all">
              <div className="bg-violet-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Descarga y juega</h3>
              <p className="text-slate-300">
                Recibe tu clave de activación al instante y comienza a disfrutar de tus juegos favoritos en cualquier plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="mb-16">
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

      {/* Call to Action Section */}
      <section className="mb-16 relative">
        <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-dot.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">¿Listo para descubrir nuevos mundos?</h2>
              <p className="text-slate-200 text-lg mb-6">
                Explora nuestro catálogo completo y encuentra tu próximo juego favorito. Tenemos títulos para todos los gustos y plataformas.
              </p>
              <Link 
                href="/search" 
                className="inline-block bg-white hover:bg-slate-100 text-violet-900 font-medium px-8 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
              >
                Ir al catálogo de juegos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}