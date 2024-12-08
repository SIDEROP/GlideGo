import React, { useState } from "react";
import RiderProfile from "./Rider/RiderProfile";
import ActiveRide from "../pages/Rider/ActiveRide";

const UserProfile = () => (
  <h2 className="text-lg font-semibold">User Profile Content</h2>
);

const History = () => (
  <h2 className="text-lg font-semibold">History Content</h2>
);

const DashboardUser = () => {
  const [stage, setStage] = useState(1); // Default to stage 1 (User Profile)

  return (
    <div className="overflow-auto max-h-screen relative flex flex-col w-full">
      {/* Header */}
      <div className="bg-white p-6 flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex space-x-6 mb-6 px-6">
        <button
          onClick={() => setStage(1)} // Stage 1: User Profile
          className={`text-sm font-semibold ${
            stage === 1
              ? "text-blue-600 underline"
              : "text-blue-500 hover:text-blue-600"
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setStage(2)} // Stage 2: Active Ride
          className={`text-sm font-semibold ${
            stage === 2
              ? "text-blue-600 underline"
              : "text-blue-500 hover:text-blue-600"
          }`}
        >
          Active Ride
        </button>
        <button
          onClick={() => setStage(3)} // Stage 3: History
          className={`text-sm font-semibold ${
            stage === 3
              ? "text-blue-600 underline"
              : "text-blue-500 hover:text-blue-600"
          }`}
        >
          History
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-grow rounded-lg overflow-auto h-full">
        {stage === 1 && <RiderProfile />}
        {stage === 2 && <ActiveRide />}
        {stage === 3 && <History />}
        {stage === 0 && (
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome to the Dashboard! Select a section to view.
          </h2>
        )}
      </div>
    </div>
  );
};

export default DashboardUser;
