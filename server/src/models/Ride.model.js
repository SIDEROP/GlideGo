import mongoose from "mongoose";
import { generateOTP, verifyOTP } from "../utils/otp.js";

const RideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    dropoffLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "in-progress", "completed", "canceled"],
      default: "requested",
    },
    fare: { type: String, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    otp: {
      type: String,
      require: true,
    },
    otpsecret: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

RideSchema.pre("save", async function (next) {
  if (this.isNew) {
    let { otp, secret } = generateOTP();
    this.otp = otp;
    this.otpsecret = secret;
  }
  next();
});

RideSchema.methods.validateOTP = function (enteredOTP) {
  return verifyOTP(enteredOTP, this.otpsecret);
};

export default mongoose.model("Ride", RideSchema);
