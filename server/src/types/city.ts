export interface City {
  name: string;
  country: string;
  country_name: string;
  altnames?: string;
  lat: number;
  lng: number;
}

export interface ParsedCity extends City {
  lat: number;
  lng: number;
}

export interface CityQueryParams {
  country?: string;
} 