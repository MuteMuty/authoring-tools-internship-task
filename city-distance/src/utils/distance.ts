// Haversine formula for distance calculation
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (degrees: number): number => degrees * (Math.PI / 180);
  const R: number = 6371;

  const dLat: number = toRad(lat2 - lat1);
  const dLon: number = toRad(lon2 - lon1);
  const radLat1: number = toRad(lat1);
  const radLat2: number = toRad(lat2);

  const hav: number = Math.pow(Math.sin(dLat / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.pow(Math.sin(dLon / 2), 2);
  
  const distance: number = 2 * R * Math.asin(Math.sqrt(hav));

  return distance;
};

// AI-generated Haversine formula for distance calculation
export const calculateDistanceAI = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R: number = 6371; // Earth's radius in kilometers
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  const dLat: number = toRadians(lat2 - lat1);
  const dLon: number = toRadians(lon2 - lon1);

  const radLat1: number = toRadians(lat1);
  const radLat2: number = toRadians(lat2);

  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}; 