import React from 'react'
import NavBar from '../components/Navbar';
import { Outlet } from "react-router";

const ProtectedAdminRoute: React.FC = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      <NavBar />
        
      <Outlet /> 
    </div>
  );
};

export default ProtectedAdminRoute;