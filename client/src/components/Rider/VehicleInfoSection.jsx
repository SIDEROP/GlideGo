import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRide,
  getRideDetails,
  requestRide,
  resetRideState,
} from "../../store/app/slices/riderSlice";

const VehicleInfoSection = ({ closeButton, hideBtn, rideData }) => {
  const { ride, loading } = useSelector((state) => state.rider);
  const dispatch = useDispatch();

  const handleConfirmRide = () => {
    dispatch(requestRide({ rideData }))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Error requesting ride:", error);
      });
      dispatch(getRideDetails())
  };

  const handleCancelRide = async () => {
    const result = await dispatch(cancelRide());
    if (result.type.endsWith("/fulfilled")) {
      console.log("Ride canceled successfully");
      dispatch(resetRideState());
      hideBtn(3);
    } else if (result.type.endsWith("/rejected")) {
      console.error("Error canceling ride:", result.payload);
    }
  };

  const handlePayNow = async () => {
    hideBtn(5);
  };

  return (
    <div className="w-full h-full px-2">
      {!ride && (
        <div className="mb-1 absolute left-2 top-2">
          <button
            onClick={() => hideBtn(3)}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      )}

      <div className="h-full overflow-y-auto relative">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Confirm Your Ride</h2>
        </div>

        <div className="flex justify-center mb-4">
          <img
            src={rideData?.icon}
            alt={rideData?.type}
            className="w-32 h-32 object-contain"
          />
        </div>

        <div className="mb-4 text-center">
          <p className="text-lg font-semibold">Vehicle: {rideData?.type}</p>
          <p className="text-gray-600">Price: {rideData?.price}</p>
          <p className="text-gray-600">Duration: {rideData?.duration}</p>
          <p className="text-gray-600">Distance: {rideData?.distance}</p>
        </div>

        {ride && (
          <>
            <div className="text-center">
              <p className="text-gray-600">Status: {ride?.status}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Otp: {ride?.otp}</p>
            </div>
          </>
        )}
      </div>

      {/* Conditionally render the Cancel and Pay Now buttons */}
      {ride?.status === "in-progress" || ride?.status === "requested" ? (
        <button
          className="w-full px-4 py-2 bg-gray-600 text-white rounded cursor-pointer mt-2"
          onClick={handleCancelRide}
        >
          Cancel Ride
        </button>
      ) : null}

      {ride?.status === "in-progress" || ride?.status === "completed" ? (
        <button
          className="w-full px-4 py-2 bg-green-500 text-white rounded cursor-pointer mt-2"
          onClick={handlePayNow}
        >
          Pay Now
        </button>
      ) : !ride ? (
        <button
          className="w-full px-4 py-2 bg-red-500 text-white rounded  cursor-pointer mt-2"
          onClick={handleConfirmRide}
        >
          {loading ? "Loading..." : "Confirm Ride"}
        </button>
      ) : null}
    </div>
  );
};

export default VehicleInfoSection;
