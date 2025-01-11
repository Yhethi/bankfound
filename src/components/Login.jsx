import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { setIsLoading } from "../redux/slices/loaderSlice";
import ParticlesBackground from "./tools/ParticlesBackground";

import Header from "./Header";
import Loader from "./tools/Loader";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toRegister, setToRegister] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function mockLoginAPI(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      return {
        data: {
          success: true,
          token: "fakeAuthToken123",
          user: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            saldo: user.saldo,
            ahorrado: user.ahorrado,
            transactions: user.transactions,
          },
        },
      };
    } else {
      throw { response: { data: { error: "Credenciales incorrectas" } } };
    }
  }

  const handleLogin = async () => {
    dispatch(setIsLoading(true));
    try {
      // const response = await axios.post("/api/auth/login", { email, password });
      const response = await mockLoginAPI(email, password);
      console.log("response", response);

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.data.success) {
        dispatch(
          loginUser({
            token: response.data.token,
            user: response.data.user,
          })
        );
        navigate("/");
      } else {
        dispatch(logoutUser());
        localStorage.removeItem("authToken");
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      console.error(err.response?.data?.error || "Error desconocido");
      alert(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 500);
    }
  };

  return (
    <>
      <Loader />
      <Header />
      <div className="center_form_login">
        <ParticlesBackground />
        <form
          className={`form_login ${toRegister && "toRegister"}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <p className="title">Iniciar sesión</p>
          <p className="message">
            Ingresa tus credenciales para acceder a la app.
          </p>

          <label>
            <input
              className="input"
              type="email"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Correo Electronico</span>
          </label>

          <label>
            <input
              className="input"
              type="password"
              placeholder=""
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Contraseña</span>
          </label>

          {error && <p className="error-message">{error}</p>}

          <button className="submit" type="submit">
            Iniciar Sesión
          </button>
          <p
            className="signin"
            onClick={() => {
              setToRegister(true);
              setTimeout(() => {
                navigate("/register");
              }, 500);
            }}
          >
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </form>
      </div>
    </>
  );
};
