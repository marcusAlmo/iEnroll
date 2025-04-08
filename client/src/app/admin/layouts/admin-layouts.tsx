import React from 'react'
import NavBar from '../components/Navbar';
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
<<<<<<< HEAD:front/src/app/admin/layouts/admin-layouts.tsx
    <div>
=======
    <div className='w-full h-screen flex flex-col'>
>>>>>>> dev-front-merge:client/src/app/admin/layouts/admin-layouts.tsx
      <NavBar />
      <div className="p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;