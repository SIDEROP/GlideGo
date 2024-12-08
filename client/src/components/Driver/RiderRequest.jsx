import React, { useState } from "react";
import { acceptRide, resetRideRequestState } from "../../store/app/slices/driverSlice";
import { useDispatch } from "react-redux";

const RiderRequest = ({ onHide,setRootChacking,newRideRequest}) => {
  const dispatch = useDispatch()
  const [rideDetails] = useState({
    origin: "Location A",
    destination: "Location B",
    distance: 12,
    price: 320,
  });

  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [otp, setOtp] = useState("");

  const handleAccept = () => {
    onHide(false)
    setIsAccepted(true);
  };

  const handleReject = () => {
    setIsRejected(true);
    dispatch(resetRideRequestState())
    setRootChacking(0)
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async () => {
    if (!otp) return;
  
    try {
      const result = await dispatch(acceptRide({ rideId: newRideRequest?.rideId, otp }));
      if (acceptRide.fulfilled.match(result)) {
        setRootChacking(3)
        onHide(true)
      }
    } catch (error) {
      console.error("Failed to accept the ride:", error);
    }
  };
  

  return (
    <div className="w-full h-full p-4 bg-white rounded-md overflow-hidden shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Rider Request</h2>
      
      <div className="max-h-[300px] overflow-auto p-2">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold">Origin: {rideDetails.origin}</p>
          <p className="text-sm font-semibold">Destination: {rideDetails.destination}</p>
          <p className="text-sm text-gray-600">Distance: {rideDetails.distance} km</p>
          <p className="text-sm text-gray-600">Price: ₹{rideDetails.price}</p>
        </div>


        {isRejected ? (
          <div className="flex justify-center mt-6">
            <p className="text-red-500 font-bold text-xl">Ride Rejected</p>
          </div>
        ) : !isAccepted ? (
          <div className="space-y-4">
            <button
              className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              onClick={handleAccept}
            >
              Accept Ride
            </button>
            <button
              className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              onClick={handleReject}
            >
              Reject Ride
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Enter OTP to Confirm Ride</h3>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
              placeholder="Enter OTP"
            />
            <button
              className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              onClick={handleOtpSubmit}
            >
              Submit OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderRequest;
