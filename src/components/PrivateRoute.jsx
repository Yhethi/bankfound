import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserData } from "../redux/actions/fetchUserData.js";
import useAuth from "../../middleware/useAuth.js";
import { Login } from "./Login.jsx";
import { loginUser } from "../redux/slices/authSlice.js";
import App from "../App.jsx";

const PrivateRoute = () => {
  const userRedux = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch(loginUser({ token, user }));
    }
  }, []);

  return userRedux ? <App /> : <Login />;
};

export default PrivateRoute;
