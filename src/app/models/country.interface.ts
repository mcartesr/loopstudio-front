export interface CountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
}

export interface Country {
  name: string;
  capital: string;
  region: string;
  subregion: string;
  votes: number; // Requerido para votación
}

export interface Vote {
  id: string;
  name: string;
  email: string;
  country: string;
  timestamp: Date;
}