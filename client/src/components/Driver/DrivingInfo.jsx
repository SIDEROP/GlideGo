import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrigin, setDestination, setStartRide } from "../../store/app/slices/mapSlice";
import { updateRideStatus } from "../../store/app/slices/driverSlice";

const DrivingInfo = () => {
  const dispatch = useDispatch();
  const {
    acceptRide: { data, loading },
    updateRide: { loading: loadingUp },
  } = useSelector((state) => state.driver);
  const { socket } = useSelector((state) => state.socket);

  if (loading) return <p>Loading...</p>;

  const rideData = data || {};

  const [status, setStatus] = useState(rideData.status || "requested");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleStatusUpdate = () => {
    dispatch(updateRideStatus({ status, rideId: data?._id }));
  };

  useEffect(() => {
    if (data) {
      dispatch(
        setOrigin({
          coordinates: [
            rideData?.pickupLocation?.latitude,
            rideData?.pickupLocation?.longitude,
          ],
          name: rideData?.pickupLocation?.address,
        })
      );
      dispatch(
        setDestination({
          coordinates: [
            rideData?.dropoffLocation?.latitude,
            rideData?.dropoffLocation?.longitude,
          ],
          name: rideData?.dropoffLocation?.address,
        })
      );
    }
  }, [data]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-text-dark-color text-center mb-6">
        Driving Information
      </h2>

      <div className="space-y-4 mb-6">
        <div className="text-center">
          <p className="text-sm font-medium text-medium-gray">
            <strong>Pickup Location:</strong>{" "}
            {rideData.pickupLocation?.address || "N/A"}
          </p>
          <p className="text-sm font-medium text-medium-gray">
            <strong>Dropoff Location:</strong>{" "}
            {rideData.dropoffLocation?.address || "N/A"}
          </p>
          <p className="text-sm text-medium-gray">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-sm text-medium-gray">
            <strong>Fare:</strong>
            {rideData.fare}
          </p>
          <p className="text-sm text-medium-gray">
            <strong>Distance:</strong> {rideData.distance}
          </p>
          <p className="text-sm text-medium-gray">
            <strong>Duration:</strong> {rideData.duration}
          </p>
        </div>
      </div>

      {/* Status Change Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-medium-gray mb-2">
          Change Status:
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full px-4 py-2 border rounded-lg bg-white text-medium-gray shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div>
          <button
            onClick={() => {
              if (socket) {
                socket.emit("startRide", {
                  rideId: rideData?._id,
                  riderId: rideData?.riderId,
                });
                dispatch(setStartRide({
                  start:true,
                  status:"in-progress"
                }));
              } else {
                console.error("Socket is not initialized!");
              }
            }}
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loadingUp ? "Loding" : "Start"}
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-4 mt-2">
        <div>
          <button
            onClick={handleStatusUpdate}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loadingUp ? "Loding" : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrivingInfo;
