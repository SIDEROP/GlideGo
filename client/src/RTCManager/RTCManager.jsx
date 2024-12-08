import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
} from "../store/app/slices/socketSlice";
import { setRideRequest } from "../store/app/slices/driverSlice";
import { updateRide } from "../store/app/slices/riderSlice";
import {
  setdriverAll,
  setOriginUpdate,
  setStartRide,
} from "../store/app/slices/mapSlice";

const RTCManager = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { startRide } = useSelector((state) => state.map);
  const { authenticated, role, data } = useSelector(
    (state) => state.authUser?.user
  ); // Get user data (e.g., role)
  const {
    acceptRide: { data: rideData },
  } = useSelector((state) => state.driver);

  const [driverLocation, setDriverLocation] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    if (authenticated && !socket) {
      dispatch(connectSocket());
    }

    return () => {
      if (authenticated && socket) {
        dispatch(disconnectSocket());
      }
    };
  }, [dispatch, authenticated, socket]);

  useEffect(() => {
    if (authenticated && socket) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDriverLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting driver location:", error);
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    if (authenticated && socket) {
      setRiderLocation({
        lat: 23.123,
        lon: 79.456,
      });
    }
  }, []);

  useEffect(() => {
    if (authenticated && socket) {
      // driver
      socket.on("newRideRequest", (data) => {
        if (data) {
          dispatch(setRideRequest(data));
        }
      });

      // rider
      socket.on("acceptedRide", ({ message, ride }) => {
        dispatch(updateRide(ride));
      });

      socket.on("statusUpdate", ({ message, ride }) => {
        alert();
        dispatch(updateRide(ride));
      });

      socket.on("startRideResponse", ({ success, message, ride }) => {
        if (success && ride == "in-progress") {
          dispatch(
            setStartRide({
              start: true,
              status: "in-progress",
            })
          );
        }
      });

      // all rider finde driver show map location on
      socket.on("allDriverLocations", ({ driverAll }) => {
        if (driverAll.length > 0) {
          dispatch(setdriverAll(driverAll));
        }
      });
      // all rider finde driver show map location on
      socket.on("rcevedLocationToRider", ({ success, driverLocation }) => {
        console.log(driverLocation);
        dispatch(setOriginUpdate([driverLocation.lat, driverLocation.lon]));
      });

      return () => {
        socket.off("rcevedLocationToRider");
        socket.off("allDriverLocations");
        socket.off("startRideResponse");
        socket.off("newRideRequest");
        socket.off("acceptedRide");
        socket.off("statusUpdate");
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket && (driverLocation || riderLocation)) {
      const intervalId = setInterval(() => {
        if (role === "driver" && driverLocation) {
          socket.emit("sendDriverLocation", {
            driverLocation,
            socketId: data.socketId,
          });
          if (startRide.start && startRide.status == "in-progress") {
            dispatch(setOriginUpdate([driverLocation.lat, driverLocation.lon]));

            socket.emit("sendLocationToRider", {
              success: true,
              driverLocation,
              riderId: rideData.riderId?._id,
            });
          }
        } else if (role === "rider" && riderLocation) {
          socket.emit("sendRiderLocation", {
            riderLocation,
            socketId: data.socketId,
          });
        }
      }, 9000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [socket, driverLocation, riderLocation, role, data]);

  return null;
};

export default RTCManager;
