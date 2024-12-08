import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setOrigin,
  setDestination,
  setRoute,
  setError,
} from "../../store/app/slices/mapSlice";
import { fetchAllDrivers } from "../../store/app/slices/driverSlice";

const LocationInput = ({ closeButton, hideBtn }) => {
  const dispatch = useDispatch();
  const [origin, setOriginState] = useState("Sarond, Patan");
  const [destination, setDestinationState] = useState("Adhartal, Jabalpur");
  const [originCoords, setOriginCoords] = useState({ lat: null, lon: null });
  const [destinationCoords, setDestinationCoords] = useState({
    lat: null,
    lon: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const handleLocationInput = async (input, setInput, inputType) => {
    setInput(input);
    setActiveInput(inputType); // Set the active input
    if (input.trim().length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${input}&format=json`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if the input length is less than 3 characters
    }
  };

  const handleSelectSuggestion = (location, setLocation, setCoords) => {
    const locationName = location.display_name;
    const coordinates = {
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
    };

    setLocation(locationName);
    setCoords(coordinates);
    setSuggestions([]);
    setActiveInput(null);
  };

  const handleSubmit = () => {
    if (originCoords.lat && destinationCoords.lat) {
      dispatch(
        setOrigin({
          coordinates: [originCoords.lat, originCoords.lon],
          name: origin,
        })
      );
      dispatch(
        setDestination({
          coordinates: [destinationCoords.lat, destinationCoords.lon],
          name: destination,
        })
      );
      dispatch(setRoute({ originCoords, destinationCoords }));

      dispatch(fetchAllDrivers({ originCoords, destinationCoords }));

      closeButton(true);
      hideBtn(3);
    } else {
      dispatch(
        setError("Please select valid origin and destination locations.")
      );
    }
  };

  return (
    <div className="p-2 relative">
      <h2 className="text-2xl font-bold mb-4 w-full text-center">
        Plan Your Ride
      </h2>

      {/* Origin Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Where are you starting from?
        </label>
        <input
          type="text"
          value={origin}
          onFocus={() => closeButton(true)}
          onChange={(e) =>
            handleLocationInput(e.target.value, setOriginState, "origin")
          }
          className="w-full p-3 border border-gray-300 rounded-md mt-2 text-[14px]"
          placeholder="Enter origin location"
        />
      </div>

      {/* Destination Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Where do you want to go?
        </label>
        <input
          type="text"
          value={destination}
          onFocus={() => closeButton(true)}
          onChange={(e) =>
            handleLocationInput(
              e.target.value,
              setDestinationState,
              "destination"
            )
          }
          className="w-full p-3 border border-gray-300 rounded-md mt-2  text-[14px]"
          placeholder="Enter destination location"
        />
      </div>

      {origin.length > 0 && destination.length > 0 && (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Choose Ride
          </button>
        </div>
      )}

      {/* Suggestions for Origin */}
      {activeInput === "origin" && suggestions.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-lg mt-2 max-h-40 overflow-y-auto shadow-lg flex flex-col">
          {suggestions.map((location) => (
            <li
              key={location.place_id}
              onClick={() =>
                handleSelectSuggestion(
                  location,
                  setOriginState,
                  setOriginCoords
                )
              }
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer border-b last:border-none text-[12px]"
            >
              <i className="ri-map-pin-line text-gray-500 text-lg mr-3"></i>
              {location.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Suggestions for Destination */}
      {activeInput === "destination" && suggestions.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-lg mt-2 max-h-40 overflow-y-auto shadow-lg flex flex-col">
          {suggestions.map((location) => (
            <li
              key={location.place_id}
              onClick={() =>
                handleSelectSuggestion(
                  location,
                  setDestinationState,
                  setDestinationCoords
                )
              }
              className="flex items-center text-[12px] px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-black cursor-pointer border-b last:border-none"
            >
              <i className="ri-map-pin-line text-gray-500 text-lg mr-3"></i>
              {location.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
