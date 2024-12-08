import React, { useState, useRef } from "react";
import "./css/Driver.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import RideOptionsSection from "../components/Rider/RideOptionsSection";
import VehicleInfoSection from "../components/Rider/VehicleInfoSection";
import RideInfoSection from "../components/Rider/RideInfoSection";
import LocationInput from "../components/Rider/LocationInput";
import RiderProfile from "../components/Rider/RiderProfile";
import DashboardUser from "../components/DashboardUser";
import { Link } from "react-router-dom";

const Rider = () => {
  const [rootChacking, setRootChacking] = useState(2);
  const [pop, setPop] = useState(false);
  const locationInputRef = useRef();
  const [rideData, setRideData] = useState(null);

  return (
    <>
      <div
        onClick={() => {
          setPop((prev) => !prev);
          setRootChacking((pre) => {
            if (pre == 2) {
              return 1;
            } else {
              return 2;
            }
          });
        }}
        className={`${
          rootChacking == 0 ? "profileD" : null
        }  profileA absolute top-1 right-2 p-3 rounded-full h-9 w-8 flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer z-[1010]`}
      >
        <i
          style={{ transition: "all 0.5s ease" }}
          className={`ri-user-settings-line text-lg text-primary-accent ${
            rootChacking == 2 ? null : "rotate-45"
          }`}
        ></i>
      </div>

      {rootChacking === 0 && null}
      {rootChacking === 1 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 max-h-screen bg-white sm:h-full overflow-hidden`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90 "
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: !pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <DashboardUser />
        </div>
      )}
      {rootChacking === 2 && (
        <div
          style={{ zIndex: "1001", position: "absolute" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 bg-white sm:h-full overflow-hidden`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: !pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <LocationInput closeButton={setPop} hideBtn={setRootChacking} />
        </div>
      )}
      {rootChacking === 3 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full overflow-hidden`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: !pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <RideOptionsSection
            closeButton={setPop}
            hideBtn={setRootChacking}
            setRideData={setRideData}
          />
        </div>
      )}
      {rootChacking === 4 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full overflow-hidden`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: !pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <VehicleInfoSection
            closeButton={setPop}
            hideBtn={setRootChacking}
            rideData={rideData}
          />
        </div>
      )}
      {rootChacking === 5 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full overflow-hidden`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: !pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <RideInfoSection hideBtn={setRootChacking} />
        </div>
      )}
    </>
  );
};

export default Rider;
