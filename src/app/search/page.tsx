'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchGames, getGenres, getPlatforms, getPopularGames } from '@/lib/requests';
import GameCard from '@/components/GameCard';
import { Game, Genre } from '@/types/game.types';
import Image from 'next/image';
import Link from 'next/link';

interface Platform {
  id: number;
  name: string;
  slug: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery || categoryParam);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [sortOrder, setSortOrder] = useState('-rating');

  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [popularGamesPage, setPopularGamesPage] = useState(1);
  const [popularGamesTotalPages, setPopularGamesTotalPages] = useState(1);
  
  const [newReleases, setNewReleases] = useState<Game[]>([]);
  const [newReleasesPage, setNewReleasesPage] = useState(1);
  const [newReleasesTotalPages, setNewReleasesTotalPages] = useState(1);
  
  const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Explorar", "Más populares", "Nuevos lanzamientos", "Ofertas"];

  useEffect(() => {
    const loadInitialGames = async () => {
      if (activeTab === 0 && (games.length === 0 || page !== 1)) {
        try {
          setLoading(true);
          
          if (searchTerm || selectedGenres.length > 0 || selectedPlatforms.length > 0) {
            const gamesData = await searchGames(
              searchTerm, 
              page, 
              9,
              selectedGenres.length > 0 ? selectedGenres : undefined,
              selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
              sortOrder
            );
            setGames(gamesData);
            setTotalPages(Math.min(Math.ceil(100 / 9), 10));
          } else {
            const initialGames = await getPopularGames(page, 9);
            setGames(initialGames);
            setTotalPages(Math.min(Math.ceil(100 / 9), 10));
          }
        } catch (error) {
          console.error('Error loading initial games:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialGames();
  }, [activeTab, games.length, page, searchTerm, selectedGenres, selectedPlatforms, sortOrder]);

  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === 1) {
        await loadPopularGames(popularGamesPage);
      } else if (activeTab === 2) {
        await loadNewReleases(newReleasesPage);
      }
    };
    
    loadTabData();
  }, [activeTab, popularGamesPage, newReleasesPage]);

  const loadPopularGames = async (pageNum: number) => {
    setLoadingCategories(true);
    try {
      const popular = await getPopularGames(pageNum, 9);
      setPopularGames(popular);
      setPopularGamesTotalPages(Math.min(Math.ceil(100 / 9), 10));
    } catch (error) {
      console.error('Error loading popular games:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadNewReleases = async (pageNum: number) => {
    setLoadingCategories(true);
    try {
      const newReleasesData = await searchGames('', pageNum, 9, undefined, undefined, '-released');
      setNewReleases(newReleasesData);
      setNewReleasesTotalPages(Math.min(Math.ceil(100 / 9), 10));
    } catch (error) {
      console.error('Error loading new releases:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    const loadDiscountedGames = async () => {
      if (activeTab === 3 && discountedGames.length === 0) {
        setLoadingCategories(true);
        try {
          const games = await getPopularGames(1, 9);
          const discounted = games.map(game => ({
            ...game,
            originalPrice: Number((game.price ?? 0) * 1.3).toFixed(2), // Convert to number after toFixed
            price: Number((game.price ?? 0).toFixed(2)) // Ensure price is a number
          }));
          
          setDiscountedGames(discounted);
        } catch (error) {
          console.error('Error loading discounted games:', error);
        } finally {
          setLoadingCategories(false);
        }
      }
    };
    
    loadDiscountedGames();
  }, [activeTab, discountedGames.length]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      const genresData = await getGenres();
      const platformsData = await getPlatforms();
      
      setGenres(genresData);
      setPlatforms(platformsData);
      
      if (categoryParam) {
        const matchingGenre = genresData.find(genre => 
          genre.name.toLowerCase() === categoryParam.toLowerCase()
        );
        
        if (matchingGenre) {
          setSelectedGenres([matchingGenre.id]);
        }
      }
    };
    
    loadFilterOptions();
  }, [categoryParam]);

  useEffect(() => {
    setActiveFiltersCount(selectedGenres.length + selectedPlatforms.length);
  }, [selectedGenres, selectedPlatforms]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
    setPage(1);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setPage(1);
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setSearchTerm('');
    setQuery('');
    setPage(1);
    setSortOrder('-rating');
  };

  const sortOptions = [
    { value: '-rating', label: 'Mejor puntuación' },
    { value: '-released', label: 'Más recientes' },
    { value: 'name', label: 'Nombre (A-Z)' },
    { value: '-name', label: 'Nombre (Z-A)' },
  ];

  const renderGameGrid = (gamesList: Game[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div key={item} className="animate-pulse bg-slate-800 rounded-lg overflow-hidden shadow-md border border-slate-700">
              <div className="h-48 bg-slate-700"></div>
              <div className="p-4">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    } 
    
    if (gamesList.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-slate-300 mb-3">No se encontraron juegos que coincidan con tus criterios</p>
        {activeTab === 0 && (
          <button onClick={resetFilters} className="text-violet-400 hover:text-violet-300">
            Limpiar filtros y buscar de nuevo
          </button>
        )}
      </div>
    );
  };

  const renderPagination = (currentPage: number, totalPages: number, setPageFunction: (page: number) => void) => {
    return (
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          <button
            onClick={() => setPageFunction(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Anterior
          </button>
          
          <span className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setPageFunction(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };

  const renderExploreTab = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 sticky top-24">
            <h3 className="font-medium text-lg text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-violet-400">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              Filtrar por
            </h3>
            
            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar juegos..."
                  className="w-full p-2.5 pl-10 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full mt-2 bg-violet-600 text-white py-2 px-6 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Buscar
              </button>
            </form>
            
            <div className="mb-5">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Ordenar por:</h4>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-violet-500 focus:border-violet-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-5">
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex justify-between">
                <span>Géneros</span>
                {selectedGenres.length > 0 && (
                  <span className="text-xs text-violet-400 cursor-pointer hover:text-violet-300" onClick={() => setSelectedGenres([])}>
                    Limpiar
                  </span>
                )}
              </h4>
              <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                {genres.map(genre => (
                  <label 
                    key={genre.id} 
                    className={`flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors mb-1 ${
                      selectedGenres.includes(genre.id) ? 'bg-violet-900/30 border border-violet-800/50' : ''
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedGenres.includes(genre.id)} 
                      onChange={() => toggleGenre(genre.id)} 
                      className="accent-violet-500 h-4 w-4"
                    />
                    <span className="text-sm text-slate-200">{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex justify-between">
                <span>Plataformas</span>
                {selectedPlatforms.length > 0 && (
                  <span className="text-xs text-violet-400 cursor-pointer hover:text-violet-300" onClick={() => setSelectedPlatforms([])}>
                    Limpiar
                  </span>
                )}
              </h4>
              <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                {platforms.slice(0, 10).map(platform => (
                  <label 
                    key={platform.id} 
                    className={`flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors mb-1 ${
                      selectedPlatforms.includes(platform.id) ? 'bg-violet-900/30 border border-violet-800/50' : ''
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedPlatforms.includes(platform.id)} 
                      onChange={() => togglePlatform(platform.id)} 
                      className="accent-violet-500 h-4 w-4"
                    />
                    <span className="text-sm text-slate-200">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {(selectedGenres.length > 0 || selectedPlatforms.length > 0 || searchTerm) && (
              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {(searchTerm || selectedGenres.length > 0 || selectedPlatforms.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6"></div>
          )}
          
          {games.length > 0 && !loading && (
            <div className="flex justify-between items-center text-slate-300 text-sm mb-4">
              <div>
                Mostrando {games.length} {games.length === 1 ? 'juego' : 'juegos'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Ordenar por:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-700 border-none text-slate-200 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 py-1 px-2"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {renderGameGrid(games, loading)}
          
          {games.length > 0 && !loading && (
            renderPagination(page, totalPages, setPage)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="relative rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-900/80 to-indigo-900/80 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Juegos</h1>
              <p className="text-slate-300 max-w-xl">
                Explora nuestra colección completa de títulos. Usa los filtros y categorías para encontrar exactamente lo que buscas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/search?category=RPG" className="bg-violet-700 hover:bg-violet-600 py-2 px-4 rounded-lg text-white">
                Juegos RPG
              </Link>
              <Link href="/search?category=Acción" className="bg-slate-700 hover:bg-slate-600 py-2 px-4 rounded-lg text-white">
                Juegos de Acción
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-1 rounded-xl bg-slate-800/50 p-1 overflow-x-auto scrollbar-thin">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                w-full min-w-[100px] whitespace-nowrap rounded-lg py-2.5 text-sm font-medium leading-5 
                ${activeTab === index 
                  ? index === 3 
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-violet-600 text-white shadow' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                transition-all duration-200
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 0 && renderExploreTab()}

      {activeTab === 1 && (
        <div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-semibold text-white">Juegos mejor valorados</h2>
              <p className="text-slate-400 mt-1">Los títulos con las mejores puntuaciones por parte de los jugadores.</p>
            </div>
            
            <div className="p-6">
              {renderGameGrid(popularGames, loadingCategories)}
            </div>
            
            {!loadingCategories && popularGames.length > 0 && (
              <div className="p-4 bg-slate-800/50 border-t border-slate-700">
                {renderPagination(popularGamesPage, popularGamesTotalPages, setPopularGamesPage)}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 2 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-semibold text-white">Nuevos lanzamientos</h2>
            <p className="text-slate-400 mt-1">Los títulos más recientes que acaban de llegar a nuestra tienda.</p>
          </div>
          
          <div className="p-6">
            {renderGameGrid(newReleases, loadingCategories)}
          </div>
          
          {!loadingCategories && newReleases.length > 0 && (
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              {renderPagination(newReleasesPage, newReleasesTotalPages, setNewReleasesPage)}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 3 && (
        <>
          <div className="relative mb-8">
            <div className="bg-gradient-to-r from-red-700/20 to-amber-700/20 p-1 rounded-xl">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-tr from-red-900/90 to-red-700/90 p-8 text-center"></div>
            </div>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-semibold text-white">Juegos en oferta</h2>
              <p className="text-slate-400 mt-1">¡Aprovecha estos descuentos temporales!</p>
            </div>
            
            <div className="p-6">
              {renderGameGrid(discountedGames, loadingCategories)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
