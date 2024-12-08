import asyncHandler from "../utils/asyncHandler.js";
import Ride from "../models/Ride.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { io } from "../index.js";
import { driver, rider } from "../socket/rtcConnections.js";
import mongoose from "mongoose";

// Request a ride
export const requestRide = asyncHandler(async (req, res) => {
  const { pickupLocation, dropoffLocation, rideData } = req.body;
  const riderId = req.user._id;
  if (!pickupLocation || !dropoffLocation) {
    throw new ApiError(400, "Pickup and dropoff locations are required");
  }

  const newRide = await Ride.create({
    riderId,
    pickupLocation,
    dropoffLocation,
    status: "requested",
    fare: rideData.price,
    distance: rideData.distance,
    duration: rideData.duration,
  });

  Object.keys(driver).forEach((socketId) => {
    io.to(driver[socketId]).emit("newRideRequest", {
      rideId: newRide._id,
      pickupLocation: newRide.pickupLocation,
      dropoffLocation: newRide.dropoffLocation,
      riderId: newRide.riderId,
    });
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, "Ride requested successfully", { ride: newRide })
    );
});

// Accept a ride (driver) using populate to include vehicle details
export const acceptRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { otp } = req.body; // OTP sent from the driver
  const driverId = req.user._id;

  // Find the ride and populate rider and driver details with vehicle info
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.status !== "requested") {
    throw new ApiError(400, "Ride is not available for acceptance");
  }

  if (!otp) {
    throw new ApiError(400, "OTP is required to accept the ride");
  }

  const isValidOTP = ride.validateOTP(otp, "hello");
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Assign the driver to the ride
  ride.driverId = driverId;
  ride.status = "accepted";

  const updatedRide = await ride.save().then(() =>
    Ride.findById(rideId).populate([
      { path: "driverId", select: "name email phone vehicleDetails" },
      {
        path: "riderId",
        select: "name email phone",
      },
    ])
  );

  const riderSocketId = rider[updatedRide?.riderId?._id];
  if (riderSocketId) {
    io.to(riderSocketId).emit("acceptedRide", {
      message: "Your ride has been accepted",
      ride: updatedRide,
    });
  } else {
    console.log(`Rider socket ID not found for rider: ${updatedRide.riderId}`);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Ride accepted successfully", { ride: updatedRide })
    );
});

// Update ride status with OTP verification when completing
export const updateRideStatus = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;

  if (!["in-progress", "completed", "canceled"].includes(status)) {
    throw new ApiError(400, "Invalid status update");
  }

  const ride = await Ride.findById(rideId).populate({
    path: "riderId",
    select: "name email phone",
  });
  if (!ride) throw new ApiError(404, "Ride not found");

  if (ride.driverId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this ride");
  }
  if (ride.status === "canceled" || ride.status === "requested") {
    throw new ApiError(404, "Ride status is already 'canceled' or 'requested'");
  }

  ride.status = status;
  await ride.save();

  const riderSocketId = rider[ride?.riderId?._id];

  if (riderSocketId) {
    io.to(riderSocketId).emit("statusUpdate", {
      message: "Your ride has been accepted",
      ride: { status },
    });
  } else {
    console.log(`Rider socket ID not found for rider: ${updatedRide.riderId}`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Ride status updated successfully", { ride }));
});

// Cancel a ride (rider or driver)
export const cancelRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId);
  if (!ride) throw new ApiError(404, "Ride not found");

  ride.status = "canceled";
  await ride.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Ride canceled successfully", { ride }));
});

// Get ride details
export const getRideDetails = asyncHandler(async (req, res) => {
  const riderId = req.user._id;

  const ride = await Ride.find({ riderId: riderId })
    .populate([
      { path: "driverId", select: "name email phone vehicleDetails" },
      { path: "riderId", select: "name email phone" }
    ]);
  
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  res.status(200).json(new ApiResponse(200, "Ride details fetched successfully", { ride }));
});

// Find available rides for drivers
export const findAvailableRides = asyncHandler(async (req, res) => {
  const { latitude, longitude, range } = req.query;
  const driverId = req.user._id;

  let query = { status: "requested" };

  if (latitude && longitude && range) {
    const radiusInKm = parseFloat(range) || 10;
    const EARTH_RADIUS_KM = 6371;

    query.pickupLocation = {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusInKm / EARTH_RADIUS_KM],
      },
    };
  }

  const availableRides = await Ride.find(query)
    .populate("riderId", "name email")
    .select("-otpsecret");

  if (!availableRides.length) {
    throw new ApiError(404, "No available rides found");
  }

  res.status(200).json(
    new ApiResponse(200, "Available rides fetched successfully", {
      availableRides,
    })
  );
});
