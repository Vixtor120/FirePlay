import axios from 'axios';
import { Game, GameDetails, Genre } from '../types/game.types';

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

// Define interfaces for API responses
interface ApiGameResponse {
  results: Game[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface ApiError {
  message: string;
  code?: number;
  status?: number;
}

// Función para asignar precios aleatorios a los juegos (simulación)
const assignPrice = (game: Game): Game => {
  const basePrice = game.rating > 4 ? 59.99 : game.rating > 3 ? 39.99 : 19.99;
  const price = +(basePrice - (Math.random() * 5)).toFixed(2);
  return { ...game, price };
};

// Obtener juegos populares para la página principal
export async function getPopularGames(page = 1, pageSize = 9): Promise<Game[]> {
  try {
    console.log(`Fetching popular games: page ${page}, size ${pageSize}`);
    const response = await axios.get<ApiGameResponse>(`${BASE_URL}/games`, {
      params: {
        key: RAWG_API_KEY,
        page,
        page_size: pageSize,
        ordering: '-rating',
      },
    });
    
    return response.data.results.map(assignPrice);
  } catch (error: unknown) {
    console.error('Error fetching popular games:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Unknown error occurred');
  }
}

// Obtener detalles de un juego específico
export async function getGameDetails(slug: string): Promise<GameDetails | null> {
  try {
    const response = await axios.get<GameDetails>(`${BASE_URL}/games/${slug}`, {
      params: {
        key: RAWG_API_KEY,
      },
    });
    
    // Obtener capturas de pantalla
    const screenshotsResponse = await axios.get<{ results: { id: number; image: string }[] }>(`${BASE_URL}/games/${slug}/screenshots`, {
      params: {
        key: RAWG_API_KEY,
      },
    });
    
    // Nos aseguramos de que todos los campos requeridos por GameDetails estén presentes
    return {
      ...assignPrice(response.data),
      screenshots: screenshotsResponse.data.results || [],
      description_raw: response.data.description_raw || '',
      developers: response.data.developers || [],
      publishers: response.data.publishers || []
    };
  } catch (error) {
    console.error(`Error fetching details for game ${slug}:`, error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Unknown error occurred');
  }
}

// Buscar juegos con filtros
export async function searchGames(
  query: string, 
  page = 1, 
  pageSize = 9, 
  genres?: number[], 
  platforms?: number[],
  ordering = '-rating'
): Promise<Game[]> {
  try {
    console.log(`Searching games: query "${query}", page ${page}, ordering ${ordering}`);
    
    const params: Record<string, string | number> = {
      key: RAWG_API_KEY,
      page,
      page_size: pageSize,
      ordering: ordering,
    };

    // Solo añadir search si hay un término de búsqueda
    if (query && query.trim() !== '') {
      params.search = query;
    }

    // Añadir filtros si están presentes
    if (genres && genres.length > 0) {
      params.genres = genres.join(',');
    }

    if (platforms && platforms.length > 0) {
      params.platforms = platforms.join(',');
    }

    const response = await axios.get<ApiGameResponse>(`${BASE_URL}/games`, { params });
    
    return response.data.results.map(assignPrice);
  } catch (error) {
    console.error('Error searching games:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Unknown error occurred');
  }
}

// Obtener lista de géneros
export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await axios.get<{ results: Genre[] }>(`${BASE_URL}/genres`, {
      params: {
        key: RAWG_API_KEY,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error fetching genres:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Unknown error occurred');
  }
}

// Obtener lista de plataformas
export async function getPlatforms(): Promise<{id: number; name: string; slug: string}[]> {
  try {
    const response = await axios.get<{ results: { id: number; name: string; slug: string }[] }>(`${BASE_URL}/platforms`, {
      params: {
        key: RAWG_API_KEY,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Unknown error occurred');
  }
}
