import { Game, GameDetails } from '@/types/game.types';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || 'your-api-key';
const BASE_URL = 'https://api.rawg.io/api';

// Función para añadir precios y descuentos a los juegos (ya que la API no los proporciona)
function addPriceInfo(games: any[]): Game[] {
  return games.map(game => {
    // Generamos precio aleatorio entre 20 y 60 euros
    let price = Math.floor(Math.random() * 40) + 20;
    
    // Creamos descuento en aproximadamente 30% de los juegos
    const hasDiscount = Math.random() <= 0.3;
    let originalPrice = null;
    let discountPercentage = null;
    
    if (hasDiscount) {
      // Descuentos de 10%, 15%, 20%, 25% o 50%
      const possibleDiscounts = [10, 15, 20, 25, 50];
      discountPercentage = possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];
      
      // Calculamos precio original y luego el precio con descuento
      originalPrice = price;
      price = Math.round((price * (100 - discountPercentage) / 100) * 100) / 100;
    }
    
    return {
      ...game,
      price,
      originalPrice: hasDiscount ? originalPrice : undefined,
      discountPercentage: hasDiscount ? discountPercentage : undefined
    };
  });
}

// Obtener juegos populares
export async function getPopularGames(page: number = 1, pageSize: number = 10): Promise<Game[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`
    );
    
    if (!response.ok) throw new Error('Error fetching games');
    
    const data = await response.json();
    return addPriceInfo(data.results);
  } catch (error) {
    console.error('Error getting popular games:', error);
    return [];
  }
}

// Buscar juegos
export async function searchGames(query: string, page: number = 1, pageSize: number = 10): Promise<Game[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=${pageSize}`
    );
    
    if (!response.ok) throw new Error('Error searching games');
    
    const data = await response.json();
    return addPriceInfo(data.results);
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
}

// Obtener detalles de un juego específico
export async function getGameDetails(slug: string): Promise<GameDetails | null> {
  try {
    // Obtener datos básicos del juego
    const gameResponse = await fetch(`${BASE_URL}/games/${slug}?key=${API_KEY}`);
    
    if (!gameResponse.ok) throw new Error('Error fetching game details');
    
    const gameData = await gameResponse.json();
    
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
    const gameWithPrice = addPriceInfo([gameData])[0];
    
    // Retornar el objeto combinado
    return {
      ...gameWithPrice,
      screenshots
    };
  } catch (error) {
    console.error('Error getting game details:', error);
    return null;
  }
}
