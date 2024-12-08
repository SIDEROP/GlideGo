import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const initialState = {
  ride: null,
  loading: false,
  error: null,
  getRideDetails: {
    data: null,
    loading: false,
    error: null,
  },
};

export const requestRide = createAsyncThunk(
  "rider/requestRide",
  async ({ rideData }, { rejectWithValue, getState }) => {
    const { origin, destination, originName, destinationName } = getState().map;

    if (
      !origin ||
      !destination ||
      !originName ||
      !destinationName ||
      !rideData
    ) {
      return rejectWithValue(
        "Origin and destination information are required."
      );
    }

    try {
      const token = localStorage.getItem("authToken") || getState().auth?.token;

      if (!token) return rejectWithValue("No token found.");

      const response = await axios.post(
        `${apiUrl}/request`,
        {
          pickupLocation: {
            latitude: origin[0],
            longitude: origin[1],
            address: originName,
          },
          dropoffLocation: {
            latitude: destination[0],
            longitude: destination[1],
            address: destinationName,
          },
          rideData,
        },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const cancelRide = createAsyncThunk(
  "rider/cancelRide",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const rideId = getState().rider?.ride?._id;
    if (!rideId) return rejectWithValue("No ride ID available.");

    try {
      const token = localStorage.getItem("authToken") || getState().auth?.token;
      if (!token) return rejectWithValue("No token found.");

      const response = await axios.delete(`${apiUrl}/cancel/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      dispatch(resetRideState());

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel the ride."
      );
    }
  }
);

export const getRideDetails = createAsyncThunk(
  "rider/getRideDetails",
  async (_, { rejectWithValue, getState }) => {

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No token found.");

      const response = await axios.get(`${apiUrl}/getRideDetails`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return response.data?.data; // Assuming your response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ride details."
      );
    }
  }
);

const riderSlice = createSlice({
  name: "rider",
  initialState,
  reducers: {
    resetRideState: (state) => {
      state.ride = null;
      state.loading = false;
      state.error = null;
    },
    updateRide: (state, action) => {
      const updatedRide = action.payload;
      state.ride = { ...state.ride, ...updatedRide };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload?.ride;
      })
      .addCase(requestRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelRide.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
      })
      .addCase(cancelRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getRideDetails.pending, (state) => {
        state.getRideDetails.loading = true;
        state.getRideDetails.error = null;
      })
      .addCase(getRideDetails.fulfilled, (state, action) => {
        state.getRideDetails.loading = false;
        state.getRideDetails.data = action.payload?.ride;
      })
      .addCase(getRideDetails.rejected, (state, action) => {
        state.getRideDetails.loading = false;
        state.getRideDetails.error = action.payload;
      });
  },
});

export const { resetRideState, updateRide } = riderSlice.actions;
export default riderSlice.reducer;
