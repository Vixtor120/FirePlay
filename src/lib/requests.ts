import { Game, GameDetails, SearchResponse } from '@/types/game.types';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || 'your-api-key';
const BASE_URL = 'https://api.rawg.io/api';

// Función para añadir precios y descuentos a los juegos (ya que la API no los proporciona)
function addPriceInfo(games: any[]): Game[] {
  return games.map(game => {
    // Generamos precio aleatorio entre 20 y 60 euros
    let price = Math.floor(Math.random() * 40) + 20;
    
    // En 70% de los casos, aplicamos descuento
    let originalPrice: number | null = null;
    let discountPercentage: number | null = null;
    
    if (Math.random() < 0.7) {
      discountPercentage = Math.floor(Math.random() * 6) * 5; // Descuentos de 5%, 10%, 15%, 20%, 25% o 30%
      originalPrice = price + Math.round(price * discountPercentage / 100);
    }
    
    // Asegurar que se devuelve un objeto Game completo
    return {
      ...game,
      price,
      originalPrice,
      discountPercentage
    } as Game;
  });
}

// Obtener juegos populares
export async function getPopularGames(page = 1, pageSize = 20): Promise<Game[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page=${page}&page_size=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const data = await response.json();
    return addPriceInfo(data.results);
  } catch (error) {
    console.error('Error fetching popular games:', error);
    throw error;
  }
}

// Buscar juegos
export async function searchGames(query: string, page = 1, pageSize = 20): Promise<Game[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const data = await response.json();
    return addPriceInfo(data.results);
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
}

// Obtener detalles de un juego específico
export async function getGameDetails(slug: string): Promise<GameDetails | null> {
  try {
    // Obtener datos básicos del juego
    const response = await fetch(`${BASE_URL}/games/${slug}?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const gameData = await response.json();
    
    // Obtener capturas de pantalla
    const screenshotsResponse = await fetch(
      `${BASE_URL}/games/${slug}/screenshots?key=${API_KEY}`
    );
    
    let screenshots = [];
    if (screenshotsResponse.ok) {
      const screenshotsData = await screenshotsResponse.json();
      screenshots = screenshotsData.results;
    }
    
    // Añadir precio y descuento
    const priceData = addPriceInfo([gameData])[0];
    
    // Combinar todo en un objeto GameDetails
    const gameDetails: GameDetails = {
      ...priceData,
      screenshots,
      description_raw: gameData.description_raw || '',
      developers: gameData.developers || [],
      publishers: gameData.publishers || [],
      website: gameData.website || ''
    };
    
    return gameDetails;
  } catch (error) {
    console.error('Error getting game details:', error);
    return null;
  }
}
