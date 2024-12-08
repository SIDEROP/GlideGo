import React, { useState } from "react";
import { resetLocation } from "../../store/app/slices/mapSlice";
import { useDispatch } from "react-redux";

const RideInfoSection = ({hideBtn}) => {
  let dispatch = useDispatch()
  const [loading, setLoading] = useState(false);


  const handlePaymentClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Payment Confirmed!");
    }, 2000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center mb-4">Ride Info</h2>
      
      {/* Back Button */}
      <div className="mb-4 absolute left-2 top-2">
        <button
          onClick={()=>{
            hideBtn(4)
          }}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
      
      <div className="flex justify-between mb-4">
        <p className="text-gray-600">Driver: John Doe</p>
        <p className="text-gray-600">Vehicle: Car</p>
      </div>

      <div className="flex justify-between mb-4">
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cash</button>
        <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-400">Wallet</button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400">Card</button>
      </div>

      <div className="flex justify-center">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded w-full"
          onClick={handlePaymentClick}
          disabled={loading} 
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default RideInfoSection;
