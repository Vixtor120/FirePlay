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

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  metacritic?: number;
  price: number;
  originalPrice: number | null | undefined;
  discountPercentage: number | null | undefined;
  platforms: Platform[];
  genres: Genre[];
}

export interface GameDetails extends Game {
  description_raw: string;
  developers?: {
    id: number;
    name: string;
  }[];
  publishers?: {
    id: number;
    name: string;
  }[];
  screenshots?: {
    id: number;
    image: string;
  }[];
  website?: string;
}

export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}
