import React from 'react'
import NavBar from '../components/Navbar';
import { Outlet } from "react-router-dom";

const ProtectedAdminRoute: React.FC = () => {
  return (
    <div className='w-screen h-screen flex flex-col'>
      <NavBar />
        
      <Outlet /> 
    </div>
  );
};

export default ProtectedAdminRoute;