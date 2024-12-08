import { useState } from "react";
import storeContext from "../storeContext.js"; // Ensure this file correctly initializes React context.

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user as null.

  const values = {
    user,
    setUser,
  };

  return (
    <storeContext.Provider value={values}>
      {children}
    </storeContext.Provider>
  );
};

export default AuthContextProvider;
