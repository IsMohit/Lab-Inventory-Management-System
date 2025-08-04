import React from "react";
import ReactDOM from "react-dom/client";
import LIMS from "./App";
import "./index.css"; 
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
     <AuthProvider>
      <LIMS />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
