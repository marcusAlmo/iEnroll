import React from "react";
import NavBar from "../components/Navbar";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/useAuth";
// import { useScreenSize } from "@/contexts/useScreenSize";

const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // // Get screen size
  // const { mobile } = useScreenSize();

  if (isAuthenticated)
  return (
    <div className="flex h-screen w-full flex-col">
      <NavBar />

      <Outlet />
    </div>
  );

  else return <Navigate to="/" />;
};

export default ProtectedAdminRoute;
