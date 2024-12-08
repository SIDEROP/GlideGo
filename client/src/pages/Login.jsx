import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/app/slices/authUserSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const { authenticated, loading } = useSelector(
    (state) => state.authUser.user
  );
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "rider",
  });

  useEffect(() => {
    if (authenticated) {
      return navigate("/");
    }
  }, [authenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error

    const { email, password, role } = userData;

    // Basic validation
    if (!email || !password || !role) {
      setError("Email, password, and role are required.");
      return;
    }

    try {
      const result = await dispatch(loginUser(userData));
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--light-gray)] px-3">
      <div className="bg-[var(--bg-color)] p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-[var(--primary-accent)] mb-6">
          Log In to Your Account
        </h2>

        {error && (
          <div className="bg-[var(--danger-accent)] text-white p-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-dark-color)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 border border-[var(--medium-gray)] rounded-md mt-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-dark-color)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-3 border border-[var(--medium-gray)] rounded-md mt-2"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-dark-color)]">
              Role
            </label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="w-full p-3 border border-[var(--medium-gray)] rounded-md mt-2"
            >
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[var(--primary-accent)] text-white rounded-md hover:bg-[var(--secondary-accent)] mt-4 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-[var(--text-color)]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--primary-accent)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
