'use client';

import { getGameDetails } from '../../../lib/requests';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { GameDetails } from '@/types/game.types';

// Componente de carga para usar con Suspense
function GameDetailsLoading() {
  return (
    <div className="pt-28 animate-pulse">
      <div className="h-80 bg-slate-700 rounded-xl mb-8"></div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-2/3">
          <div className="h-10 bg-slate-700 rounded-full w-3/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded-full w-full"></div>
            <div className="h-4 bg-slate-700 rounded-full w-full"></div>
            <div className="h-4 bg-slate-700 rounded-full w-3/4"></div>
          </div>
        </div>
        <div className="md:w-1/3 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="h-8 bg-slate-700 rounded-full w-1/2 mb-6"></div>
          <div className="h-10 bg-slate-700 rounded-lg w-full mb-4"></div>
          <div className="h-10 bg-slate-700 rounded-lg w-full"></div>
        </div>
      </div>
      <div className="h-8 bg-slate-700 rounded-full w-1/6 mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="h-32 bg-slate-700 rounded-xl"></div>
        <div className="h-32 bg-slate-700 rounded-xl"></div>
        <div className="h-32 bg-slate-700 rounded-xl"></div>
        <div className="h-32 bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  );
}

// Componente para mostrar los detalles del juego
function GameDetailsContent({ game }: { game: GameDetails | null }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user || !game) return;

      try {
        const favoriteRef = doc(db, 'favorites', `${user.uid}_${game.id}`);
        const favoriteSnap = await getDoc(favoriteRef);
        setIsFavorite(favoriteSnap.exists());
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [user, game]);

  if (!game) {
    return <div className="pt-28 text-center py-12 text-slate-300">No se pudo cargar la información del juego.</div>;
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }

    setIsAddingFavorite(true);

    try {
      const documentId = `${user.uid}_${game.id}`;
      const favoriteRef = doc(db, 'favorites', documentId);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
      } else {
        const favoriteData = {
          userId: user.uid,
          gameId: game.id,
          gameName: game.name,
          gameSlug: game.slug,
          gameImage: game.background_image || '',
          gameRating: game.rating || 0,
          gamePrice: game.price || 0, // Use default value of 0 if undefined
          addedAt: new Date().toISOString(),
        };

        await setDoc(favoriteRef, favoriteData);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(`Error al ${isFavorite ? 'eliminar de' : 'añadir a'} favoritos`);
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);

    try {
      addToCart({ 
        ...game,
        price: game.price || 0 
      }, quantity);  
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al añadir al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="pt-20 container mx-auto">
      {/* Cabecera del juego - Rediseñada sin hero image */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Imagen principal */}
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-xl">
            <Image
              src={game.background_image || '/placeholder-game.jpg'}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {game.platforms?.slice(0, 3).map((p) => (
                  <span key={p.platform.id} className="inline-block bg-slate-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-slate-200">
                    {p.platform.name}
                  </span>
                ))}
                {game.platforms && game.platforms.length > 3 && (
                  <span className="inline-block bg-slate-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-slate-200">
                    +{game.platforms.length - 3} más
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Información principal y descripciones */}
        <div className="md:col-span-2 flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-white">{game.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center bg-amber-600/20 text-amber-400 px-2.5 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{game.rating.toFixed(1)}</span>
            </div>
            <div className="text-slate-400">
              {new Date(game.released).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div className="bg-slate-800/60 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-medium mb-2 text-white">Acerca de este juego</h2>
            <div className="text-slate-300 leading-relaxed line-clamp-4 md:line-clamp-none">
              {game.description_raw}
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-3 gap-2">
            <div className="col-span-3 md:col-span-1">
              <div className="bg-slate-800/60 p-3 rounded-lg h-full">
                <h3 className="text-sm uppercase text-slate-400 mb-1">Desarrolladores</h3>
                <div className="flex flex-wrap gap-1">
                  {game.developers.map((dev) => (
                    <span key={dev.id} className="text-white text-sm">{dev.name}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <div className="bg-slate-800/60 p-3 rounded-lg h-full">
                <h3 className="text-sm uppercase text-slate-400 mb-1">Géneros</h3>
                <div className="flex flex-wrap gap-1">
                  {game.genres.map((genre) => (
                    <span key={genre.id} className="bg-violet-500/20 text-violet-300 text-xs px-2 py-0.5 rounded">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <div className="bg-slate-800/60 p-3 rounded-lg h-full">
                <h3 className="text-sm uppercase text-slate-400 mb-1">Lanzamiento</h3>
                <div className="text-white">
                  {new Date(game.released).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detalles del juego con acciones de compra (2 columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Columna izquierda con detalles */}
        <div className="lg:col-span-2">
          {/* Capturas de pantalla con estilo moderno */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800 text-white">Capturas de pantalla</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {game.screenshots.map((screenshot) => (
                  <button 
                    key={screenshot.id} 
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                      selectedScreenshot === screenshot.image ? 'ring-2 ring-violet-500 scale-[1.02]' : ''
                    }`}
                    onClick={() => setSelectedScreenshot(screenshot.image)}
                  >
                    <Image
                      src={screenshot.image}
                      alt={`Captura ${screenshot.id}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover hover:scale-110 transition-all duration-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Vista previa de screenshot seleccionada */}
          {selectedScreenshot && (
            <div className="mb-8 relative rounded-xl overflow-hidden aspect-video">
              <Image
                src={selectedScreenshot}
                alt="Vista previa"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
                aria-label="Cerrar vista previa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Requisitos del sistema (demo) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800 text-white">Requisitos del sistema</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-lg">
                <h3 className="font-medium text-violet-400 mb-2">Mínimos:</h3>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• SO: Windows 10 64-bit</li>
                  <li>• Procesador: Intel Core i5-2500K / AMD FX-6300</li>
                  <li>• Memoria: 8 GB RAM</li>
                  <li>• Gráficos: Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB</li>
                  <li>• Almacenamiento: 70 GB</li>
                </ul>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-lg">
                <h3 className="font-medium text-violet-400 mb-2">Recomendados:</h3>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• SO: Windows 10 64-bit</li>
                  <li>• Procesador: Intel Core i7-4770K / AMD Ryzen 5 1500X</li>
                  <li>• Memoria: 12 GB RAM</li>
                  <li>• Gráficos: Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 580 4GB</li>
                  <li>• Almacenamiento: 70 GB SSD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Precio y compra */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-6 rounded-xl sticky top-24 border border-slate-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="text-3xl font-bold text-white">
                ${((game.price || 0) * quantity).toFixed(2)}
              </div>
              {/* Indicador de Stock */}
              <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                En Stock
              </span>
            </div>
            
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-2">Cantidad</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-l-lg text-white"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className="w-16 bg-slate-900 border-y border-slate-700 py-2 text-center text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-r-lg text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                  addedToCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                {isAddingToCart ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Añadiendo...
                  </span>
                ) : addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ¡Añadido al carrito!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Añadir al carrito
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleToggleFavorite}
                disabled={isAddingFavorite}
                className="w-full py-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                {isAddingFavorite ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isFavorite ? 
                      <span className="text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        Quitar de favoritos
                      </span> : 
                      <span className="text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        Añadir a favoritos
                      </span>
                    }
                  </span>
                )}
              </button>
            </div>
            
            {/* Información adicional de compra */}
            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entrega digital inmediata
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Métodos de pago seguros
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="flex justify-between items-center border-t border-slate-800 pt-6">
        <Link href="/home" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a la tienda
        </Link>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors"
        >
          <span>Volver arriba</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Función para obtener datos del juego
async function fetchGameDetails(slug: string): Promise<GameDetails | null> {
  try {
    return await getGameDetails(slug);
  } catch (error) {
    console.error(`Error fetching game details: ${error}`);
    return null;
  }
}

// Componente principal que gestiona la carga de datos
export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [slugValue, setSlugValue] = useState<string | null>(null);

  useEffect(() => {
    async function resolveSlug() {
      try {
        const resolvedParams = await Promise.resolve(params);
        const slug = resolvedParams.slug;
        setSlugValue(slug);
      } catch (error) {
        console.error("Error resolviendo parámetros:", error);
        setLoading(false);
      }
    }
    
    resolveSlug();
  }, [params]);

  useEffect(() => {
    if (!slugValue) return;
    
    const loadGame = async () => {
      setLoading(true);
      try {
        const gameData = await fetchGameDetails(slugValue);
        setGame(gameData);
      } catch (error) {
        console.error(`Error loading game:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [slugValue]);

  return (
    <>
      {loading ? <GameDetailsLoading /> : <GameDetailsContent game={game} />}
      <div id="toast" className="hidden fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50"></div>
    </>
  );
}
