import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { TechProvider } from "./providers/TechContext.jsx";
import { AuthProvider } from "./providers/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TechProvider>
          <App />
        </TechProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
