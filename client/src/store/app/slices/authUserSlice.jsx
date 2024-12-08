import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

// Register User (existing)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const { data } = response.data;
      if (!response.status === 200) {
        throw new Error("Registration failed.");
      }

      localStorage.setItem("authToken", data.token);
      return data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const { data } = response.data;
      if (!response.status === 200) {
        throw new Error("Login failed.");
      }

      localStorage.setItem("authToken", data?.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Check for existing token and re-login
export const reLogin = createAsyncThunk(
  "auth/reLogin",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return rejectWithValue("No token found.");
    }

    try {
      const response = await axios.get(`${apiUrl}/relogin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { data } = response.data;
      return data;
    } catch (error) {
      dispatch(clearUser());
      return rejectWithValue("Failed to re-authenticate.");
    }
  }
);
// Logout
export const Logout = createAsyncThunk(
  "auth/Logout",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return rejectWithValue("No token found.");
    }

    try {
      const response = await axios.get(`${apiUrl}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { data } = response.data;

      dispatch(clearUser());

      return data;
    } catch (error) {
      dispatch(clearUser());
      return rejectWithValue("Failed to re-authenticate.");
    }
  }
);

// Initial state
const initialState = {
  user: {
    loading: false,
    error: null,
    data: null,
    authenticated: false,
    role: null,
    location: {
      lat: null,
      lon: null,
    },
  },
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {
        loading: false,
        error: null,
        data: null,
        authenticated: false,
        role: null, // Reset role to null on user logout
      };
      localStorage.removeItem("authToken");
    },
    authenticateUser: (state, action) => {
      state.user.authenticated = true;
      state.user.data = action.payload;
      state.user.role = action.payload.role; // Store role in state
    },
    logoutUser: (state) => {
      state.user.authenticated = false;
      state.user.data = null;
      state.user.error = null;
      state.user.role = null; // Reset role on logout
      localStorage.removeItem("authToken");
    },
    updateLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.user.location.lat = lat;
      state.user.location.lon = lon;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.data = action.payload;
        state.user.authenticated = true;
        state.user.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.payload || "Something went wrong.";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.data = action.payload;
        state.user.authenticated = true;
        state.user.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.payload || "Login failed.";
      })

      // Re-login
      .addCase(reLogin.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(reLogin.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.data = action.payload.user;
        state.user.authenticated = true;
        state.user.role = action.payload.user.role; // Ensure role is updated after re-login
      })
      .addCase(reLogin.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.payload || "Failed to re-authenticate.";
      });
  },
});

export const { clearUser, authenticateUser, logoutUser,updateLocation } =
  authUserSlice.actions;

export default authUserSlice.reducer;
