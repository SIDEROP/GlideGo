
export const startLocationUpdates = (dispatch, updateLocationAction) => {
  if (navigator.geolocation) {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(updateLocationAction({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    };

    updateLocation();

    setInterval(updateLocation, 15000);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};
