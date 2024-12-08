import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthenticateLayout from "./layouts/AuthenticateLayout"; // For authenticated routes
import { useDispatch, useSelector } from "react-redux";
import { reLogin, updateLocation } from "./store/app/slices/authUserSlice";
import { startLocationUpdates } from "./utils/startLocationUpdates";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Rider from "./pages/Rider";
import Driver from "./pages/Driver";
import NotFoundPage from "./pages/NotFoundPage";
import RTCManager from "./RTCManager/RTCManager";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  const dispatch = useDispatch();
  const { authenticated, role, loading } = useSelector(
    (state) => state.authUser.user
  );

  useEffect(() => {
    startLocationUpdates(dispatch, updateLocation);
  }, [dispatch]);

  useEffect(() => {
    if (!authenticated) {
      dispatch(reLogin());
    }
  }, [dispatch, authenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      {authenticated && <RTCManager />}
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Routes */}
        <Route element={<AuthenticateLayout />}>
          {authenticated && role === "driver" ? (
            <>
              <Route path="/" element={<Driver />} />
            </>
          ) : null}
          {authenticated && role === "rider" ? (
            <>
              <Route path="/" element={<Rider />} />
            </>
          ) : null}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
