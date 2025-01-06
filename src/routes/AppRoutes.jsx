import App from "../App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "../components/NotFound.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { Login } from "../components/Login.jsx";
import Register from "../components/Register.jsx";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
  },
  {
    path: "/login",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: "/tienda/:id_del_usuario",
  //   element: <Tienda />,
  //   errorElement: <ErrorPage />,
  // },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: "/perfil",
  //   element: <PrivateRoute />,
  //   errorElement: <ErrorPage />,
  // },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
]);
