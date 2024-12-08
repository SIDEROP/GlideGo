import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./store/context/contextSlice/authUserContext.jsx";
import { Provider } from "react-redux";
import Store from "./store/app/store.js"

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>
);
