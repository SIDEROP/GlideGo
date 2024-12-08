import React from "react";

const LoadingSpinner = ({
  size = "16",
  primaryColor = "blue-500",
  secondaryColor = "gray-300",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`w-${size} h-${size} border-4 border-${primaryColor} border-l-${secondaryColor} rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
