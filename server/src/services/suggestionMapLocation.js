import axios from "axios";

export const suggestionMapLocation = async (query) => {
  if (!query) throw new Error("Query is required");

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;

  try {
    const response = await axios.get(url);

    return response.data.map((item) => ({
      displayName: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
      place_id:item.place_id
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to fetch location suggestions");
  }
};

export default suggestionMapLocation;
