export interface City {
  name: string;
  country: string;
  country_name: string;
  altnames?: string;
  lat: number;
  lng: number;
  distance?: number;
  distanceAI?: number;
  weather?: {
    temperature: number;
    conditions: string;
    description: string;
    icon: string;
  };
} 