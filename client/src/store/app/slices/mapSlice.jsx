import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startRide:{
    start:false,
    status:null,
  },
  driverAll: [],
  origin: null,
  destination: [0, 0],
  originName: "",
  destinationName: "",
  route: [],
  distance: 0,
  fare: {
    car: 0, // INR
    auto: 0, // INR
    bike: 0, // INR
  },
  durationDetails: {
    car: 0, // minutes
    auto: 0, // minutes
    bike: 0, // minutes
  },
  error: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setStartRide:(state,action)=>{
      state.startRide = action.payload
    },
    setdriverAll: (state, action) => {
      const actionComingData = action.payload;
    
      const uniqueDrivers = actionComingData.filter(
        (newDriver) =>
          !state.driverAll.some((existingDriver) => existingDriver.driverId === newDriver.driverId)
      );
      state.driverAll = [...state.driverAll, ...uniqueDrivers];
    },
    resetLocation:(state,action)=>{
      state.destination = null
      state.originName = ''
      state.destinationName = ''
      state.route = []
    },
    setOrigin: (state, action) => {
      state.origin = action.payload.coordinates;
      state.originName = action.payload?.name || "Unknown Origin";
    },
    setDestination: (state, action) => {
      state.destination = action.payload?.coordinates;
      state.destinationName = action?.payload?.name || "Unknown Destination";
    },
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    setRouteDetails: (state, action) => {
      const { distance, duration } = action.payload;

      const distanceInKm = (distance / 1000).toFixed(1);
      state.distance = distanceInKm;

      const baseFareCar = 50;
      const baseFareAuto = 30;
      const baseFareBike = 20;
      const ratePerKmCar = 10;
      const ratePerKmAuto = 8;
      const ratePerKmBike = 6;

      state.fare.car = (baseFareCar + distanceInKm * ratePerKmCar).toFixed(0);
      state.fare.auto = (baseFareAuto + distanceInKm * ratePerKmAuto).toFixed(
        0
      );
      state.fare.bike = (baseFareBike + distanceInKm * ratePerKmBike).toFixed(
        0
      );

      state.fare.car = `${Math.max(state.fare.car, 0)} ₹`;
      state.fare.auto = `${Math.max(state.fare.auto, 0)} ₹`;
      state.fare.bike = `${Math.max(state.fare.bike, 0)} ₹`;

      const speedCar = 50;
      const speedAuto = 40;
      const speedBike = 30;

      const durationCar = ((distanceInKm / speedCar) * 60).toFixed(0);
      const durationAuto = ((distanceInKm / speedAuto) * 60).toFixed(0);
      const durationBike = ((distanceInKm / speedBike) * 60).toFixed(0); // in minutes

      state.durationDetails.car = `${durationCar} min`;
      state.durationDetails.auto = `${durationAuto} min`;
      state.durationDetails.bike = `${durationBike} min`;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOriginUpdate: (state, action) => {
      state.origin = action.payload
    }
  },
});

export const {
  setOrigin,
  setDestination,
  setRoute,
  setRouteDetails,
  setError,
  clearError,
  setdriverAll,
  setStartRide,
  setOriginUpdate,
  resetLocation
} = mapSlice.actions;

export default mapSlice.reducer;
