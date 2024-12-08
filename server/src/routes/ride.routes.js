import { Router } from "express";
import {
  requestRide,
  acceptRide,
  updateRideStatus,
  cancelRide,
  getRideDetails,
  findAvailableRides,
} from "../controllers/ride.contr.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Public Routes


// Protected Routes (authentication required)
router.post("/request", authMiddleware, requestRide);
router.put("/accept/:rideId", authMiddleware, acceptRide);
router.put("/update-status/:rideId", authMiddleware, updateRideStatus);
router.delete("/cancel/:rideId", authMiddleware, cancelRide);
router.get("/getRideDetails", authMiddleware, getRideDetails);
router.get("/available-rides", authMiddleware, findAvailableRides);

export default router;
