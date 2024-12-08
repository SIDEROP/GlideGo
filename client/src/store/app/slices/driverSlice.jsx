import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const initialState = {
  drivers: [],
  loading: false,
  error: null,
  newRideRequest: null,
  acceptRide: {
    loading: false,
    error: null,
    data: null,
  },
  updateRide: {
    loading: false,
    error: null,
    data: null,
  },
};

// Thunk to fetch all drivers
export const fetchAllDrivers = createAsyncThunk(
  "drivers/fetchAllDrivers",
  async ({ originCoords, destinationCoords }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/allDrivers`,
        { originCoords, destinationCoords },
        { withCredentials: true }
      );
      return response.data.data.drivers;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching drivers"
      );
    }
  }
);

// Thunk to accept a ride (driver-side action)
export const acceptRide = createAsyncThunk(
  "drivers/acceptRide",
  async ({ rideId, otp }, { rejectWithValue, getState }) => {
    try {
      const token =
        localStorage.getItem("authToken") || getState().authUser?.token;
      if (!token) return rejectWithValue("No token found.");

      const response = await axios.put(
        `${apiUrl}/accept/${rideId}`,
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data?.data?.ride;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept the ride."
      );
    }
  }
);

// Thunk to update ride status
export const updateRideStatus = createAsyncThunk(
  "drivers/updateRideStatus",
  async ({ status, rideId }, { rejectWithValue, getState }) => {
    if (!status || !rideId)
      return rejectWithValue("No status and rideId found.");
    try {
      const token =
        localStorage.getItem("authToken") || getState().authUser?.token;
      if (!token) return rejectWithValue("No token found.");

      const response = await axios.put(
        `${apiUrl}/update-status/${rideId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data?.data?.ride; // Return updated ride data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update ride status."
      );
    }
  }
);

// Driver slice definition
const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    resetDriversState: (state) => {
      state.drivers = [];
      state.loading = false;
      state.error = null;
    },
    setRideRequest: (state, action) => {
      state.newRideRequest = action.payload;
    },
    resetRideRequestState: (state) => {
      state.newRideRequest = null;
      state.acceptRide = {
        loading: false,
        error: null,
        data: null,
      };
      state.updateRide = {
        loading: false,
        error: null,
        data: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchAllDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptRide.pending, (state) => {
        state.acceptRide.loading = true;
        state.acceptRide.error = null;
      })
      .addCase(acceptRide.fulfilled, (state, action) => {
        state.acceptRide.loading = false;
        state.acceptRide.data = action.payload;
      })
      .addCase(acceptRide.rejected, (state, action) => {
        state.acceptRide.loading = false;
        state.acceptRide.error = action.payload;
      })
      .addCase(updateRideStatus.pending, (state) => {
        state.updateRide.loading = true;
        state.updateRide.error = null;
      })
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.updateRide.loading = false;
        state.updateRide.data = action.payload;
      })
      .addCase(updateRideStatus.rejected, (state, action) => {
        state.updateRide.loading = false;
        state.updateRide.error = action.payload;
      });
  },
});

// Exporting actions and reducer
export const { resetDriversState, setRideRequest, resetRideRequestState } =
  driverSlice.actions;
export default driverSlice.reducer;
