import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../store/app/slices/authUserSlice";

const RiderProfile = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.authUser?.user);

  return (
    <div className="flex flex-col items-center  p-2">
      <h1 className="text-lg font-bold text-center mb-3">User Profile</h1>
      {/* Profile Picture and Name */}
      <div className="flex items-center justify-center flex-col  mb-3 w-full">
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-bold">
          {data?.name ? data.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="ml-4 flex items-center flex-col">
          <h2 className="text-xl font-bold text-gray-800">
            {data?.name || "Anonymous User"}
          </h2>
          <p className="text-gray-500">{data?.role?.charAt(0).toUpperCase() + data?.role?.slice(1) || "No role specified"}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 uppercase">Email</h3>
          <p className="text-gray-700">{data?.email || "No email provided"}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm text-gray-500 uppercase">Phone</h3>
          <p className="text-gray-700">{data?.phone || "No phone number provided"}</p>
        </div>

      </div>

      {/* Edit Profile Button */}
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
          Edit Profile
        </button>
      </div>
      <div className=" mt-3">
        <button
          onClick={() => {
            dispatch(Logout());
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 text-[12px]"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default RiderProfile;
