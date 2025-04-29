export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Screenshot {
  id: number;
  image: string;
  width: number;
  height: number;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  metacritic?: number;
  platforms: Platform[];
  genres: Genre[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
}

export interface GameDetails extends Game {
  description_raw?: string;
  developers?: Developer[];
  publishers?: Developer[];
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  };
  website?: string;
  screenshots?: Screenshot[];
}

// Tipos específicos para filtros
export interface PlatformParent {
  id: number;
  name: string;
  slug: string;
  platforms?: Platform[];
}
