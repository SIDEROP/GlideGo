import React, { useState, useEffect, useRef } from "react";
import "./css/Driver.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import DriverProfile from "../components/Driver/DriverProfile";
import RiderRequest from "../components/Driver/RiderRequest";
import { useSelector } from "react-redux";
import DrivingInfo from "../components/Driver/DrivingInfo";

const Driver = () => {
  const [rootChacking, setRootChacking] = useState(0);
  const [pop, setPop] = useState(false);
  const locationInputRef = useRef();
  const { newRideRequest } = useSelector((state) => state.driver);

  useEffect(() => {
    if (newRideRequest) {
      setRootChacking(2);
    }
  }, [newRideRequest]);

  return (
    <>
      <div
        onClick={() => {
          setPop((prev) => !prev);
          setRootChacking((pre) => {
            if (pre == 0) {
              return 1;
            } else {
              return 0;
            }
          });
        }}
        className={`${rootChacking == 0?"profileD":null}  profileA absolute top-1 right-2 p-3 rounded-full h-9 w-8 flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer z-[1010]`}
      >
        <i
          style={{ transition: "all 0.5s ease" }}
          className={`ri-user-settings-line text-lg text-primary-accent ${
            !rootChacking == 0 ? "rotate-45" : null
          }`}
        ></i>
      </div>
      {rootChacking === 0 && null}
      {rootChacking === 1 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <DriverProfile />
        </div>
      )}
      {rootChacking === 2 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <RiderRequest
            onHide={setPop}
            setRootChacking={setRootChacking}
            newRideRequest={newRideRequest}
          />
        </div>
      )}
      {rootChacking === 3 && (
        <div
          style={{ zIndex: "1001" }}
          className={`${
            pop ? null : "activeCss"
          } w-full absolute bottom-0 left-0 p-4 bg-white sm:h-full`}
          ref={locationInputRef}
        >
          <div
            id="iconsData"
            className=" flex justify-center items-center sm:absolute sm:right-0 sm:top-[50%] sm:rotate-90"
          >
            <i
              className="ri-arrow-up-wide-line cursor-pointer"
              style={{
                transform: pop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setPop((prev) => !prev)}
            ></i>
          </div>
          <DrivingInfo
            onHide={setPop}
            setRootChacking={setRootChacking}
            newRideRequest={newRideRequest}
          />
        </div>
      )}
    </>
  );
};

export default Driver;
