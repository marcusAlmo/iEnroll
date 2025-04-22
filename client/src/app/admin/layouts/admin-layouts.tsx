import React from 'react'
import NavBar from '../components/Navbar';
import { Outlet } from "react-router";

const MainLayout: React.FC = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      <NavBar />
      <div className="p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;