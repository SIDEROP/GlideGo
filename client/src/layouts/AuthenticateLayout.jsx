import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reLogin } from "../store/app/slices/authUserSlice";
import { Navigate, Outlet } from "react-router-dom";
import MapComponent from "../components/MapComponent";

const AuthenticateLayout = () => {
  const dispatch = useDispatch();
  const { authenticated, loading } = useSelector(
    (state) => state.authUser.user
  );

  useEffect(() => {
    if (!authenticated) {
      dispatch(reLogin());
    }
  }, [dispatch, authenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <main className="flex w-[100%] h-[100%] relative bg-transparent">
        <MapComponent className="flex-1 h-[100%]" />

        <div className=" w-fit h-fit sm:w-[40%] sm:h-full sm:absolute lg:left-0 sm:top-0 bg-transparent:">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthenticateLayout;
