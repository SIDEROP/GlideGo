const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };
  
  const fareBetweenLocations = (origin, destination, vehicleType) => {
    if (!origin || !destination) throw new Error("Origin and destination are required");
    if (!vehicleType) throw new Error("Vehicle type is required");
  
    const distance = haversineDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );
  
    let ratePerKm;
  
    switch (vehicleType.toLowerCase()) {
      case "car":
        ratePerKm = 15;
        break;
      case "moto":
        ratePerKm = 10;
        break;
      case "auto":
        ratePerKm = 12;
        break;
      default:
        throw new Error("Invalid vehicle type. Choose from 'car', 'moto', or 'auto'.");
    }
  
    const fare = Math.round(distance * ratePerKm); 
  
    return {
      distance: distance.toFixed(1),
      fare: fare.toFixed(0),
      vehicleType,
    };
  };
  
  export default fareBetweenLocations;
  