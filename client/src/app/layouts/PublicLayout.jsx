import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicLayout = () => {
  let { user, loading } = useSelector((state) => state.auth);
  if (loading) return <h1>loading...</h1>;

  if (user) return <Navigate to={"/chat"} />;

  return <Outlet />;
};

export default PublicLayout;
