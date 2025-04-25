import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Read cities data
const citiesPath = path.join(__dirname, '../../assets/cities.json');
const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

// Helper function to parse city coordinates
const parseCityCoordinates = (city: any) => ({
  ...city,
  lat: parseFloat(city.lat),
  lng: parseFloat(city.lng)
});

// Endpoint to get all cities
app.get('/api/cities', (req, res) => {
  const parsedCities = citiesData.map(parseCityCoordinates);
  res.json(parsedCities);
});

// Endpoint to get random cities (25 unique countries)
app.get('/api/random-cities', (req, res) => {
  const countries = new Set();
  const selectedCities = [];
  
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 