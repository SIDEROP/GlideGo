import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";

let { VITE_API_URL_SOCKET } = import.meta.env;


const API_URL = VITE_API_URL_SOCKET || "http://localhost:4000";

const initialState = {
  socket: null,
  loading: false,
  error: null,
};

export const connectSocket = createAsyncThunk(
  "socket/connectSocket",
  async (_, { rejectWithValue, getState }) => {
    const { _id, role } = getState().authUser.user?.data;

    if (!_id || !role) {
      return rejectWithValue("User ID or Role is missing.");
    }

    try {
      const socket = io(API_URL, {
        query: { userId: _id, role: role },
      });
      return socket;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to disconnect the socket
export const disconnectSocket = createAsyncThunk(
  "socket/disconnectSocket",
  async (_, { getState }) => {
    return null;
  }
);

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    resetSocket: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectSocket.fulfilled, (state, action) => {
        state.socket = action.payload;
        state.loading = false;
      })
      .addCase(connectSocket.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.socket = null;
      });
  },
});

export const { resetSocket } = socketSlice.actions;

export default socketSlice.reducer;
