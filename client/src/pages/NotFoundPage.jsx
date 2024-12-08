import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const NotFoundPage = () => {
  const { authenticated, loading } = useSelector(
    (state) => state.authUser.user
  );

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center px-4">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
