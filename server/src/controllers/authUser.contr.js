import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import fareBetweenLocations from "../services/fareBetweenLocations.js";

// register
export let register = asyncHandler(async (req, res) => {
  const { name, email, password, role, vehicleDetails } = req.body;
  console.log(req.body);

  if ([email, name, role].some((val) => !val)) {
    throw new ApiError(400, "Missing required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const urlImg = `https://avatar.iran.liara.run/username?username=${name}&bold=false&length=1;`;

  if (role === "rider" && vehicleDetails) {
    throw new ApiError(400, "Riders should not provide vehicle details");
  }

  if (role === "driver" && !vehicleDetails) {
    throw new ApiError(400, "Vehicle details are required for drivers");
  }

  const user = new User({
    name,
    email,
    password,
    role,
    profilePicture: urlImg,
    vehicleDetails: role === "driver" ? vehicleDetails : undefined,
  });

  await user.save();

  const token = user.generateAuthToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(
      new ApiResponse(201, "User registered successfully", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        vehicleDetails: user.vehicleDetails,
        token,
      })
    );
});

// login
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new ApiError(400, "Email role and password are required");
  }

  const user = await User.findOne({ email, role });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateAuthToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(200, "Login successful", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token,
      })
    );
});

// reLogin
export const reLogin = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json(
      new ApiResponse(200, "User is authenticated", {
        authenticated: true,
        user: req.user,
      })
    );
  } else {
    res.status(401).json(new ApiResponse(401, "User is not authenticated"));
  }
});

//   logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
});

// Get all drivers
export const getAllDrivers = asyncHandler(async (req, res) => {
  let { originCoords, destinationCoords} = req.body;


  if ([originCoords, destinationCoords].some((val) => !val)) {
    throw new ApiError(400, "Missing required fields");
  }

  const drivers = await User.find({ role: "driver" })

  if (!drivers || drivers.length === 0) {
    throw new ApiError(404, "No drivers found");
  }

  const origin = { latitude: originCoords?.lat, longitude: originCoords?.lon };
  const destination = { latitude:destinationCoords?.lat, longitude: destinationCoords?.lon };

  const moto = fareBetweenLocations(origin, destination, "moto");
  const car = fareBetweenLocations(origin, destination, "car");
  const auto = fareBetweenLocations(origin, destination, "auto");

  res.status(200).json(
    new ApiResponse(200, "Drivers fetched successfully", {
      drivers,
      moto,
      car,
      auto
    })
  );
});
