import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDrivers } from "../store/app/slices/driverSlice"; // Action to fetch drivers
import carIcon from "../assets/car.webp"; // Car icon
import bikeIcon from "../assets/bike.webp"; // Bike icon
import autoIcon from "../assets/auto.png"; // Auto icon

const RideOptionsSection = ({ closeButton, hideBtn }) => {
  const { drivers, loading, error } = useSelector((state) => state.driver); // Select driver state from Redux store

  // Display loading state
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Handle error if there is an issue fetching drivers
  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="w-full p-2 h-full">
      <h2 className="text-xl font-bold text-center mb-4">Choose Your Ride</h2>
      <div className="overflow-y-auto h-full space-y-4 rounded-md">
        {drivers && drivers.length > 0 ? (
          drivers.map((driver, index) => {
            const { vehicleDetails, rating } = driver;
            let vehicleIcon;
            switch (vehicleDetails.vehicleType) {
              case "car":
                vehicleIcon = carIcon;
                break;
              case "moto":
                vehicleIcon = bikeIcon;
                break;
              case "auto":
                vehicleIcon = autoIcon;
                break;
              default:
                vehicleIcon = carIcon;
            }

            return (
              <div
                key={index}
                onClick={() => {
                  closeButton(true);
                  hideBtn(3);
                }}
                className="border rounded-lg shadow-md bg-white cursor-pointer flex items-center"
              >
                <img
                  src={vehicleIcon}
                  alt={vehicleDetails.vehicleType}
                  className="w-16 mr-4"
                />
                <div>
                  <p className="text-gray-600">
                    Vehicle: {vehicleDetails.vehicleType}
                  </p>
                  <p className="text-gray-600">Color: {vehicleDetails.color}</p>
                  <p className="text-gray-600">
                    Capacity: {vehicleDetails.capacity}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No drivers available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default RideOptionsSection;



import React, { useEffect, useState } from "react";
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
import { setOrigin, setError } from "../store/app/slices/mapSlice";

// Customizing Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = () => {
  const dispatch = useDispatch();
  const { origin, destination, originName, destinationName, route } =
    useSelector((state) => state.map);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const locationName = response.data.display_name;
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

  return (
    <div className="h-full w-full">
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
          <Marker position={origin}>
            <Popup>{`Origin: ${originName}`}</Popup>
          </Marker>
          {destination && (
            <Marker position={destination}>
              <Popup>{`Destination: ${destinationName}`}</Popup>
            </Marker>
          )}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      ) : (
        <div>Loading your location...</div>
      )}
    </div>
  );
};

export default MapComponent;





import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOrigin, setDestination, setRoute, setError } from "../store/app/slices/mapSlice";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = () => {
  const dispatch = useDispatch();
  const { origin, destination, originName, destinationName, route } = useSelector(
    (state) => state.map
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const locationName = response.data.display_name;
          
          dispatch(setOrigin({ coordinates: [latitude, longitude], name: locationName }));
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
    const destinationCoordinates = [37.7749, -122.4194]; // Example destination (San Francisco)

    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${destinationCoordinates[0]}&lon=${destinationCoordinates[1]}`
      )
      .then((response) => {
        const destinationName = response.data.display_name;
        dispatch(setDestination({ coordinates: destinationCoordinates, name: destinationName }));
      })
      .catch((error) => {
        console.error("Error fetching destination name:", error);
        dispatch(setError("Failed to fetch destination name."));
      });
  }, [dispatch]);

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
        } catch (error) {
          console.error("Error fetching route:", error);
          dispatch(setError("Failed to fetch route."));
        }
      }
    };
    fetchRoute();
  }, [origin, destination, dispatch]);

  return (
    <div className="h-full w-full">
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
          <Marker position={destination}>
            <Popup>{`Destination: ${destinationName}`}</Popup>
          </Marker>

          {/* Polyline for the Route */}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      ) : (
        <div>Loading your location...</div>
      )}
    </div>
  );
};

export default MapComponent;
