import User from "../models/User.model.js";
import Ride from "../models/Ride.model.js";

export let driver = {};
export let rider = {};
export let driverLocations = {}; // To store all driver locations

const rtcConnections = async (socket, io) => {
  const { userId, role } = socket.handshake.query;

  if (!userId || !role) {
    console.log("User ID or Role is missing, disconnecting...");
    socket.disconnect();
    return;
  }

  // Handle different roles
  if (role === "driver") {
    const existingUser = await User.findById(userId);

    if (existingUser && existingUser.role === "driver") {
      existingUser.socketId = socket.id;
      await existingUser.save();

      driver[userId] = socket.id;
      console.log(`Driver connected: ${userId}, Socket ID: ${socket.id}`);
    }

    // Handle sending driver locations to all clients
    socket.on("sendDriverLocation", (driverLocation) => {
      driverLocations[userId] = {
        socketId: socket.id,
        location: driverLocation,
      };

      const driverAll = Object.entries(driverLocations).map(
        ([driverId, { socketId, location }]) => ({
          driverId,
          socketId,
          lat: location.driverLocation.lat,
          lon: location.driverLocation.lon,
        })
      );

      io.emit("allDriverLocations", { driverAll });
    });

    // startRide
    socket.on("startRide", async ({ rideId, riderId }) => {
      try {
        if (!rideId || !riderId) {
          console.error("Missing rideId or riderId");
          socket.emit("startRideResponse", {
            success: false,
            error: "Invalid data received.",
          });
          return;
        }

        const ride = await Ride.findById(rideId).populate({
          path: "riderId",
          select: "name email phone",
        });
        if (!ride) {
          console.error("Ride not found");
          socket.emit("startRideResponse", {
            success: false,
            error: "Ride not found.",
          });
          return;
        }

        // Update ride status
        ride.status = "in-progress";
        await ride.save();

        const riderSocketId = rider[ride?.riderId?._id];

        io.to(riderSocketId).emit("statusUpdate", {
          message: "Your ride has been accepted",
          ride: { status: "in-progress" },
        });

        io.to(rider).emit("startRideResponse", {
          success: true,
          message: "Ride started successfully.",
          ride: { status: "in-progress" },
        });
      } catch (error) {
        console.error("Error handling startRide event:", error);
        socket.emit("startRideResponse", {
          success: false,
          error: "Internal server error.",
        });
      }

      // startRide end
    });
    // startDriver Locatin sher to rider
    socket.on(
      "sendLocationToRider", ({ success, driverLocation, riderId }) => {
        if (!riderId || !driverLocation) {
          console.error("Missing rideId or riderId");
          return;
        }
        console.log(riderId)
        const riderSocketId = rider[riderId];
        console.log(riderSocketId,"hello");
        io.to(riderSocketId).emit("rcevedLocationToRider", {
          success: true,
          driverLocation,
        });
        // startDriver Locatin sher to rider end
      }
    );

    // When driver disconnects, remove from the driver list and locations
    socket.on("disconnect", () => {
      console.log(`Driver disconnected: ${userId}`);
      delete driver[userId];
      delete driverLocations[userId];
    });
  } else if (role === "rider") {
    const existingUser = await User.findById(userId);

    if (existingUser && existingUser.role === "rider") {
      existingUser.socketId = socket.id;
      await existingUser.save();

      rider[userId] = socket.id;
      console.log(`Rider connected: ${userId}, Socket ID: ${socket.id}`);
    }

    // Handle rider events (e.g., request a driver)
    socket.on("findDriver", (rideDetails) => {
      console.log(`Rider looking for driver: ${rideDetails}`);
      if (Object.keys(driver).length > 0) {
        const driverSocketId = Object.values(driver)[0];
        io.to(driverSocketId).emit("rideRequest", rideDetails);
      } else {
        console.log("No drivers available");
      }
    });

    // When rider disconnects, remove from the rider list
    socket.on("disconnect", () => {
      console.log(`Rider disconnected: ${userId}`);
      delete rider[userId];
    });
  } else {
    socket.disconnect();
  }
};

export default rtcConnections;
