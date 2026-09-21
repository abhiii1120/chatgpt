import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import LoginForm from "../features/auth/ui/pages/LoginPage";
import RegisterForm from "../features/auth/ui/pages/RegisterPage";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "login",
      element: <LoginForm />,
    },
    {
      path: "register",
      element: <RegisterForm />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
