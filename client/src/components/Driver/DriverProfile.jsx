import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../store/app/slices/authUserSlice";

const DriverProfile = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const dispatch = useDispatch();
  const { data } = useSelector((stet) => stet.authUser.user);
  console.log(data);
  // Sample driver details
  const driverDetails = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    vehicleName: "Toyota Camry",
    vehicleCapacity: 4,
  };

  return (
    <div className="h-full overflow-auto p-2 rounded-lg">
      <h1 className="text-lg font-bold text-center">Driver Profile</h1>

      {/* Driver Profile Animation */}
      <div className="driver-profile mb-6 text-center">
        <img
          src={data?.profilePicture}
          alt="Driver"
          className="rounded-full mx-auto mb-4 w-36 h-36 object-cover shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-900">
          {" "}
          {data?.name?.toUpperCase()}
        </h2>
        <p className="text-gray-600">
          {data?.role?.charAt(0).toUpperCase() +
            data?.role?.slice(1).toLowerCase()}
        </p>
      </div>

      {/* Driver Contact Information */}
      <div className="contact-info mb-1 text-center">
        <p className="text-sm font-semibold text-blue-600">
          Email:{" "}
          <a
            href={`mailto:${data?.email}`}
            className="underline hover:text-blue-800 transition-colors"
          >
            {data?.email}
          </a>
        </p>
        <p className="text-md font-semibold text-green-600">
          Phone:{" "}
          <a
            href={`tel:${data?.phone}`}
            className="underline hover:text-green-800 transition-colors"
          >
            {data?.vehicleDetails?.phone}
          </a>
        </p>
      </div>

      {/* Driver Vehicle Information */}
      <div className="vehicle-info mb-1 text-center">
        <p className="text-md font-semibold text-gray-800">
          Vehicle: {data?.vehicleName}
        </p>
        <p className="text-gray-600">
          Capacity: {data?.vehicleDetails?.capacity} passengers
        </p>
        <p className="text-gray-600">
          Plate: {data?.vehicleDetails?.numberPlet}
        </p>
      </div>

      {/* Driver Availability Status */}
      <div className="driver-availability mb-1 text-center">
        <p
          className={`text-md font-semibold ${
            isAvailable ? "text-green-500" : "text-red-500"
          }`}
        >
          {isAvailable ? "Available" : "Not Available"}
        </p>
      </div>

      {/* Availability Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsAvailable((prev) => !prev)}
          className="px-6 py-2 text-sm  bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          {!isAvailable ? "Set Available" : "Set Not Available"}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            dispatch(Logout());
          }}
          className="px-6 py-2 mt-4 bg-black text-white rounded-full hover:bg-red-500 transition-colors"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default DriverProfile;
