/**
 * Types for favorite game items
 */

export interface FavoriteItem {
  id: string;
  gameId: number;
  gameName: string;
  gameSlug: string;
  gameImage: string;
  gameRating: number;
  gamePrice: number;
  addedAt: string;
  userId?: string;
}

export interface FavoriteCache {
  data: FavoriteItem[];
  timestamp: string;
}
