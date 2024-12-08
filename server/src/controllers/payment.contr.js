import asyncHandler from "../utils/asyncHandler.js";
import Payment from "../models/Payment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create a payment record
export const createPayment = asyncHandler(async (req, res) => {
  const { rideId, driverId, amount, paymentMethod } = req.body;
  const riderId = req.user._id;

  if (!rideId || !driverId || !amount || !paymentMethod) {
    throw new ApiError(400, "Missing required fields");
  }

  const existingPayment = await Payment.findOne({ rideId });
  if (existingPayment) {
    throw new ApiError(400, "Payment already exists for this ride");
  }

  const payment = new Payment({
    riderId,
    driverId,
    rideId,
    amount,
    paymentMethod,
  });

  await payment.save();

  res.status(201).json(
    new ApiResponse(201, "Payment created successfully", {
      id: payment._id,
      riderId: payment.riderId,
      driverId: payment.driverId,
      rideId: payment.rideId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
    })
  );
});

// Update payment status (e.g., after processing)
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { paymentStatus, transactionId } = req.body;

  if (!["pending", "completed", "failed"].includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  payment.paymentStatus = paymentStatus;
  if (transactionId) {
    payment.transactionId = transactionId;
  }

  await payment.save();

  res.status(200).json(
    new ApiResponse(200, "Payment status updated successfully", {
      id: payment._id,
      paymentStatus: payment.paymentStatus,
      transactionId: payment.transactionId,
    })
  );
});

// Get payment details
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate("riderId", "name email")
    .populate("driverId", "name email")
    .populate("rideId");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Payment details retrieved successfully", payment)
    );
});
