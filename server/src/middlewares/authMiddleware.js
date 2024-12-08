import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ApiError(401, "User not found");

    res.user = req.user;
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, token failed");
  }
});
export default authMiddleware