export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  price?: number; // Para simular una tienda
  platforms: Platform[];
  genres: Genre[];
}

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

export interface GameDetails extends Game {
  description_raw: string;
  developers: Developer[];
  publishers: Publisher[];
  screenshots: Screenshot[];
}

interface Developer {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface Screenshot {
  id: number;
  image: string;
}

// Tipos específicos para filtros
export interface PlatformParent {
  id: number;
  name: string;
  slug: string;
  platforms?: Platform[];
}
