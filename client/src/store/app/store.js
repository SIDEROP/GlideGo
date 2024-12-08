import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./slices/authUserSlice";
import mapReducer from "./slices/mapSlice";
import riderReducer from './slices/riderSlice';
import driverReducer from './slices/driverSlice';
import socketReducer from './slices/socketSlice';

const Store = configureStore({
  reducer: {
    socket:socketReducer,
    authUser: authUserReducer,
    map: mapReducer,
    rider:riderReducer,
    driver:driverReducer
  },
});

export default Store;
