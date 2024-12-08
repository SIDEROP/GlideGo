import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/app/slices/authUserSlice";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const { authenticated, loading } = useSelector(
    (state) => state.authUser.user
  );

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "rider", // Default to 'rider'
    vehicleDetails: {
      vehicleType: "",
      color: "Black",
      capacity: "",
      numberPlet: "",
    },
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name in userData.vehicleDetails) {
      setUserData((prevData) => ({
        ...prevData,
        vehicleDetails: {
          ...prevData.vehicleDetails,
          [name]: value,
        },
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error
    const { name, email, password, role, vehicleDetails } = userData;

    if (!name || !email || !password || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      role === "driver" &&
      (!vehicleDetails.vehicleType ||
        !vehicleDetails.numberPlet ||
        !vehicleDetails.capacity ||
        !vehicleDetails.color)
    ) {
      setError("Please provide all vehicle details.");
      return;
    }

    try {
      const submissionData =
        role === "rider"
          ? { name, email, password, role }
          : userData;

      const result = await dispatch(registerUser(submissionData));
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-3">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-200 p-2 mb-4 text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={userData.role}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value === "rider") {
                  setUserData((prevData) => ({
                    ...prevData,
                    vehicleDetails: {
                      vehicleType: "",
                      color: "Black",
                      capacity: "",
                      numberPlet: "",
                    },
                  }));
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
            >
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Vehicle Details for Driver */}
          {userData.role === "driver" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={userData.vehicleDetails.vehicleType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Color
                </label>
                <select
                  name="color"
                  value={userData.vehicleDetails.color}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                >
                  <option value="Black">Black</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="White">White</option>
                  <option value="Silver">Silver</option>
                  <option value="Gray">Gray</option>
                  <option value="Green">Green</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={userData.vehicleDetails.capacity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter vehicle capacity"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Number Plate
                </label>
                <input
                  type="text"
                  name="numberPlet"
                  value={userData.vehicleDetails.numberPlet}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter vehicle number plate"
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
