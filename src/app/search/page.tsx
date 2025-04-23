'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchGames, getPopularGames } from '@/lib/requests';
import GameCard from '@/components/GameCard';
import { Game } from '@/types/game.types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Load games - either popular games or search results
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        
        if (searchTerm) {
          // If search is active, show search results
          const searchResults = await searchGames(searchTerm, page, 12);
          setGames(searchResults);
          setIsSearchActive(true);
        } else {
          // Otherwise show popular games
          const popularGames = await getPopularGames(page, 12);
          setGames(popularGames);
          setIsSearchActive(false);
        }
        
        setTotalPages(Math.min(Math.ceil(100 / 12), 8)); // Limit to 8 pages for simplicity
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [page, searchTerm]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
    setPage(1);
  };

  // Clear search and return to popular games
  const clearSearch = () => {
    setQuery('');
    setSearchTerm('');
    setPage(1);
  };

  // Render skeleton loading state
  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with Search */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-violet-900/80 to-indigo-900/80">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Explora nuestros juegos</h1>
          
          {/* Search Form - Centered and prominent */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar juegos..."
                className="w-full p-4 pl-12 rounded-lg bg-slate-800/90 backdrop-blur border border-slate-700 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-lg text-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {query && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-16 px-3 text-slate-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              <button 
                type="submit"
                className="absolute inset-y-0 right-0 px-6 py-2 bg-violet-600 text-white rounded-r-lg hover:bg-violet-700 transition-colors"
              >
                Buscar
              </button>
            </div>
            
            {/* Popular Categories as buttons */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {["Acción", "Aventura", "RPG", "Shooter", "Estrategia"].map(category => (
                <button 
                  key={category} 
                  type="button"
                  onClick={() => {
                    setQuery(category);
                    setSearchTerm(category);
                    setPage(1);
                  }}
                  className="text-sm px-4 py-2 bg-slate-800/80 backdrop-blur text-slate-200 rounded-full hover:bg-violet-600/60 hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            {isSearchActive ? (
              <>
                <span>Resultados para: "{searchTerm}"</span>
                <button 
                  onClick={clearSearch}
                  className="ml-3 text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
                >
                  Volver a populares
                </button>
              </>
            ) : (
              <span>Juegos Populares</span>
            )}
          </h2>
        </div>
        
        {/* Games Grid */}
        {loading ? (
          renderSkeleton()
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-slate-300 text-xl mb-3">No se encontraron juegos que coincidan con tu búsqueda</p>
            <button 
              onClick={clearSearch}
              className="text-violet-400 hover:text-violet-300 font-medium text-lg"
            >
              Ver juegos populares
            </button>
          </div>
        )}
        
        {/* Pagination - Only show if we have games */}
        {games.length > 0 && !loading && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg">
                {page} / {totalPages}
              </span>
              
              <button
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
