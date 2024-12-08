import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrigin,
  setDestination,
  setRoute,
  setRouteDetails,
  setError,
} from "../store/app/slices/mapSlice";

// Import vehicle icons
import carIcon from "../assets/map/Car.png";
import bikeIcon from "../assets/bike.webp";
import autoIcon from "../assets/auto.png";
import LoadingSpinner from "./LoadingSpinner";

// Customizing Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Function to select the correct vehicle icon based on type and add 3D-like effect
const getVehicleIcon = (vehicleType) => {
  let iconUrl;
  switch (vehicleType) {
    case "car":
      iconUrl = carIcon;
      break;
    case "moto":
      iconUrl = bikeIcon;
      break;
    case "auto":
      iconUrl = autoIcon;
      break;
    default:
      iconUrl = carIcon;
  }


  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [50, 64],
    shadowAnchor: [25, 50],
  });
};

const MapComponent = () => {
  const dispatch = useDispatch();
  const {
    driverAll,
    origin,
    destination,
    originName,
    destinationName,
    route,
    error,
  } = useSelector((state) => state.map);
  const { authenticated, role, data } = useSelector(
    (state) => state.authUser?.user
  );

  // Fetch the user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos?.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const locationName = response.data.display_name;

          // Set the origin in the Redux store
          dispatch(
            setOrigin({
              coordinates: [latitude, longitude],
              name: locationName,
            })
          );
        } catch (error) {
          console.error("Error fetching origin name:", error);
          dispatch(setError("Failed to fetch origin name."));
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        dispatch(setError("Failed to get your location."));
      }
    );
  }, [dispatch]);

  // Set destination manually or from a different logic
  useEffect(() => {
    const destinationCoordinates = [destination.lat, destination.lon];

    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${destinationCoordinates[0]}&lon=${destinationCoordinates[1]}`
      )
      .then((response) => {
        const destinationName = response.data.display_name;
        dispatch(
          setDestination({
            coordinates: destinationCoordinates,
            name: destinationName,
          })
        );
      })
      .catch((error) => {
        dispatch(setError("Failed to fetch destination name."));
      });
  }, [dispatch]);

  // Fetch route and route details (distance, duration, fare) when origin or destination changes
  useEffect(() => {
    const fetchRoute = async () => {
      if (origin && destination) {
        try {
          const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
          );
          const coords = response.data.routes[0].geometry.coordinates;
          const routePoints = coords.map(([lon, lat]) => [lat, lon]);
          dispatch(setRoute(routePoints));

          const { distance, duration } = response.data.routes[0];
          dispatch(setRouteDetails({ distance, duration }));
        } catch (error) {
          dispatch(setError("Failed to fetch route."));
        }
      }
    };
    fetchRoute();
  }, [origin, destination, dispatch]);

  return (
    <div className="h-[100%] w-[100%]">
      {origin ? (
        <MapContainer
          center={origin}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Origin Marker */}
          <Marker position={origin}>
            <Popup>{`Origin: ${originName}`}</Popup>
          </Marker>

          {/* Destination Marker */}
          {destination && (
            <Marker position={destination}>
              <Popup>{`Destination: ${destinationName}`}</Popup>
            </Marker>
          )}

          {/* Polyline for the Route */}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
          {/* Markers for vehicles from driveAll */}
          {authenticated &&
            role == "rider" &&
            driverAll &&
            driverAll.length > 0 &&
            driverAll.map((vehicle) => (
              <Marker
                key={vehicle?.driverId}
                position={[vehicle.lat, vehicle.lon]}
                icon={
                  new L.Icon({
                    iconUrl: getVehicleIcon(vehicle.vehicleType).options
                      .iconUrl,
                    iconSize: [60, 60],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30],
                    shadowSize: [30, 40],
                    shadowAnchor: [15, 30],
                  })
                }
              >
                <Popup>{`Vehicle Type: ${vehicle.vehicleType}`}</Popup>
              </Marker>
            ))}
        </MapContainer>
      ) : (
        <LoadingSpinner/>
      )}
    </div>
  );
};

export default MapComponent;
