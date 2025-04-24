export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  price: number;
  genres: Genre[];
  platforms: Platform[];
  // ...other properties
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    // Any other properties your API returns
  };
  // Any other properties at this level
}

export interface Genre {
  id: number;
  name: string;
}

export interface GameDetails extends Game {
  description_raw: string;
  developers: Developer[];
  publishers: Publisher[];
  screenshots: Screenshot[];
}

export interface Developer {
  id: number;
  name: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Screenshot {
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
