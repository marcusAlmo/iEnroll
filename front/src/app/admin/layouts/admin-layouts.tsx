import React from 'react'
import NavBar from '../components/Navbar';
import { Outlet } from "react-router-dom";

const ProtectedAdminRoute: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

export default ProtectedAdminRoute;