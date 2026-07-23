import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import ReactGA from "react-ga4";

ReactGA.initialize("G-34R9B9JPTH");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
<ErrorBoundary>
    <App />
  </ErrorBoundary>
          <ToastContainer />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);