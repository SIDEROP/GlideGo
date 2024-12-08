import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRideDetails } from "../../store/app/slices/riderSlice";

const ActiveRide = () => {
  let dispatch = useDispatch();
  const { data: rides, loading } = useSelector(
    (state) => state.rider.getRideDetails
  );
  useEffect(() => {
    dispatch(getRideDetails());
  }, []);

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (!rides || rides.length === 0) {
    return (
      <div className="text-center text-gray-700">
        No active rides available.
      </div>
    );
  }

  console.log(rides);
  return (
    <div className="space-y-6">
      {rides.map((ride) => (
        <div
          key={ride._id}
          className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-md"
        >

          {/* Pickup Location */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Pickup Location:</h4>
            <p className="text-gray-600">{ride?.pickupLocation?.address}</p>
          </div>

          {/* Dropoff Location */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Dropoff Location:</h4>
            <p className="text-gray-600">{ride?.dropoffLocation?.address}</p>
          </div>

          {/* Rider Information */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Rider:</h4>
            <p className="text-gray-600">Name: {ride?.riderId?.name}</p>
            <p className="text-gray-600">Email: {ride?.riderId?.email}</p>
          </div>

          {/* Driver Information */}
          {ride?.driverId && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Driver:</h4>
              <p className="text-gray-600">Name: {ride?.driverId?.name}</p>
              <p className="text-gray-600">Email: {ride?.driverId?.email}</p>
              <p className="text-gray-600">
                Vehicle: {ride?.driverId?.vehicleDetails.make}{" "}
                {ride?.driverId?.vehicleDetails?.model}
              </p>
            </div>
          )}

          {/* Ride Status */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Status:</h4>
            <p className="text-gray-600">{ride?.status}</p>
            <p className="text-gray-600">Fare: {ride?.fare}</p>
            <p className="text-gray-600">Distance: {ride?.distance}</p>
            <p className="text-gray-600">Duration: {ride?.duration}</p>
          </div>

          {/* OTP */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">OTP:</h4>
            <p className="text-gray-600">{ride?.otp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveRide;
