import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import SignInPage from "./Components/login/SignInPage";
import SignUpPage from "./Components/login/SignUpPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <SignUpPage></SignUpPage> */}
  </React.StrictMode>
);
