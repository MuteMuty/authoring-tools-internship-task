import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { City, ParsedCity, CityQueryParams } from './types/city';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Read cities data
const citiesPath = path.join(__dirname, '../assets/cities.json');
const citiesData: City[] = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

// Helper function to parse city coordinates
const parseCityCoordinates = (city: City): ParsedCity => ({
  ...city,
  lat: parseFloat(city.lat.toString()),
  lng: parseFloat(city.lng.toString())
});

// Endpoint to get all cities or get first city by country if country is provided (used for county code of the geolocation country)
app.get('/api/cities', (req: Request<{}, {}, {}, CityQueryParams>, res: Response<ParsedCity[]>) => {
  const { country } = req.query;
  
  if (country) {
    const cityWithCountry = citiesData.find((city: City) => city.country === country);
    if (cityWithCountry) {
      res.json([parseCityCoordinates(cityWithCountry)]);
    } else {
      res.json([]);
    }
  } else {
    const parsedCities = citiesData.map(parseCityCoordinates);
    res.json(parsedCities);
  }
});

// Endpoint to get random cities (25 unique countries)
app.get('/api/random-cities', (req: Request, res: Response<ParsedCity[]>) => {
  const countries = new Set<string>();
  const selectedCities: ParsedCity[] = [];
  
  while (selectedCities.length < 25 && countries.size < citiesData.length) {
    const randomIndex = Math.floor(Math.random() * citiesData.length);
    const city = citiesData[randomIndex];
    
    if (!countries.has(city.country)) {
      countries.add(city.country);
      selectedCities.push(parseCityCoordinates(city));
    }
  }
  
  res.json(selectedCities);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
}); 