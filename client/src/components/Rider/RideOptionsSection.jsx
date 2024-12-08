import React from "react";
import { useDispatch, useSelector } from "react-redux";
import carIcon from "../../assets/car.webp";
import bikeIcon from "../../assets/bike.webp";
import autoIcon from "../../assets/auto.png";
import { resetLocation } from "../../store/app/slices/mapSlice";

const RideOptionsSection = ({ closeButton, hideBtn, setRideData }) => {
  let dispatch = useDispatch()
  const { fare, durationDetails, distance, originName, destinationName } =
    useSelector((state) => state.map);

  const rides = [
    {
      type: "Car",
      price: `${fare.car}`,
      duration: `${durationDetails?.car}`,
      distance: `${distance} km`,
      icon: carIcon,
    },
    {
      type: "Bike",
      price: `${fare.bike}`,
      duration: `${durationDetails?.bike}`,
      distance: `${distance} km`,
      icon: bikeIcon,
    },
    {
      type: "Auto",
      price: `${fare.auto}`,
      duration: `${durationDetails?.auto}`,
      distance: `${distance} km`,
      icon: autoIcon,
    }
  ];

  return (
    <div className="w-full p-2 h-full">
      <div className="mb-1 absolute left-2 top-2">
        <button
          onClick={() => {
            dispatch(resetLocation())
            hideBtn(2)}}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
        >
          Back
        </button>
      </div>
      <h2 className="text-xl font-bold text-center mb-2">Choose Your Ride</h2>

      <div className="text-[10px] text-gray-500 mb-2 flex flex-col items-center">
        <p>
          <span className="font-semibold">From:</span> {originName}
        </p>
        <p>
          <span className="font-semibold">To:</span> {destinationName}
        </p>
      </div>

      <div className="overflow-y-auto h-full space-y-4 rounded-md cursor-pointer">
        {rides.map((ride, index) => (
          <div
            key={index}
            onClick={() => {
              setRideData({ ...ride, originName, destinationName });
              closeButton(true);
              hideBtn(4);
            }}
            className="border rounded-lg shadow-md bg-white cursor-pointer flex items-center p-2"
          >
            <img src={ride.icon} alt={ride.type} className="w-16 mr-4" />

            <div>
              <p className="text-gray-600 text-sm">Price: {ride.price}</p>
              <p className="text-gray-600 text-sm">Duration: {ride.duration}</p>
              <p className="text-gray-600 text-sm">Distance: {ride.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptionsSection;
