import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const ProtectedLayout = () => {
  let { user, initialized  } = useSelector((state) => state.auth);

  if (!initialized ) return <h1>loading...</h1>;

  if (!user) return <Navigate to={"/"} />;

  return <Outlet />;
};

export default ProtectedLayout;
