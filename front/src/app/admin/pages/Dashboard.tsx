import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import SubNav from "../components/SubNav.tsx";
import { getEnrollmentData } from "../../routes/dataRoutes.tsx"; 

const Dashboard: React.FC = () => {
    const [enrollmentData, setEnrollmentData] = useState({
        totalEnrollments: 0,
        successfulEnrollments: 0,
        failedEnrollments: 0
    });

    useEffect(() => {
        const data = getEnrollmentData();
        setEnrollmentData(data);
    }, []);

    return (
      <div className="fixed inset-0 bg-container_1 w-full h-full overflow-hidden">
        <Navbar />
        <div className="mt-24 flex justify-center items-center gap-10">
          <div className="border-2 border-text-2 py-8  w-1/4 text-center shadow-md bg-background rounded-lg">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.totalEnrollments}</h2>
            <p className="text-primary font-semibold mt-2">Enrollment Total</p>
          </div>
          <div className="border-2 border-text-2 py-8 w-1/4 text-center shadow-md bg-background rounded-lg">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.successfulEnrollments}</h2>
            <p className="text-primary font-semibold mt-2">Successful Enrollment</p>
          </div>
          <div className="border-2 border-text-2 py-9 w-1/4 text-center shadow-md bg-background rounded-lg">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.failedEnrollments}</h2>
            <p className="text-primary font-semibold">Failed Enrollment</p>
          </div>
        </div>

        <SubNav setActiveTab={(tab: string) => {}} />

        <div className="mt-2">
          <Outlet />
        </div>
      </div>
    );
};

export default Dashboard;