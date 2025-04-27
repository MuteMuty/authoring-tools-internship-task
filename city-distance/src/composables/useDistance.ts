export const useDistance = () => {
  // Haversine formula for distance calculation
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (degrees: number): number => degrees * (Math.PI / 180);
    const R = 6371;
  
    const dlat1 = toRad(lat1);
    const dlat2 = toRad(lat2);
    const avg_dlat = toRad(lat2 - lat1);
    const avg_dlon = toRad(lon2 - lon1);
  
    const hav = Math.sin(avg_dlat / 2) * Math.sin(avg_dlat / 2) +
              Math.cos(dlat1) * Math.cos(dlat2) *
              (Math.sin(avg_dlon / 2) * Math.sin(avg_dlon / 2));
    
    const distance = 2 * R * Math.asin(Math.sqrt(hav));
  
    return distance;
  };

  // AI-generated Haversine formula for distance calculation
  const calculateDistanceAI = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  };

  return {
    calculateDistance,
    calculateDistanceAI
  };
}; 