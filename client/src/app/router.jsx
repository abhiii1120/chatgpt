import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import LoginForm from "../features/auth/ui/pages/LoginPage";
import RegisterForm from "../features/auth/ui/pages/RegisterPage";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Chat from "../features/chat/ui/Chat";
import { useDispatch } from "react-redux";
import { bootstrapSession } from "../features/auth/state/authThunk";
import { useEffect } from "react";

const AppRoutes = () => {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(bootstrapSession());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          path: "",
          element: <LoginForm />,
        },
        {
          path: "register",
          element: <RegisterForm />,
        },
      ],
    },
    {
      path: "/chat",
      element: <ProtectedLayout />,
      children: [
        {
          index: true,
          element: <Chat />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
