import React, { useState, useEffect } from "react";
import Navbar from "./../../components/Navbar";
import SubNavIndex from "./../../components/SubNav";
import EnrollmentBreakdown from "@/app/admin/pages/dashboard/enrollment-breakdown/enrollmentbreakdown";
import EnrollmentTrend from "@/app/admin/pages/dashboard/enrollment-trend/enrollmenttrend";
import PlanCapacity from "@/app/admin/pages/dashboard/plan-capacity/plancapacity";
import EnrollmentCount from "@/app/admin/pages/dashboard/enrollment-count/enrollmentcount";
import { getEnrollmentData } from "./../../../routes/dataRoutes";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("enrollment-breakdown");
  const [enrollmentData, setEnrollmentData] = useState({
    totalEnrollments: 0,
    successfulEnrollments: 0,
    failedEnrollments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEnrollmentData();
      setEnrollmentData(data);
    };
    fetchData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "enrollment-breakdown":
        return <EnrollmentBreakdown />;
      case "enrollment-trend":
        return <EnrollmentTrend />;
      case "plan-capacity":
        return <PlanCapacity />;
      case "enrollment-count":
        return <EnrollmentCount />;
      default:
        return <EnrollmentBreakdown />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-container_1 flex flex-col">
        <div className="p-4 mx-36 flex flex-col flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
                    <h2 className="text-5xl font-bold text-primary">{enrollmentData.totalEnrollments}</h2>
                    <p className="text-primary font-semibold mt-2">Enrollment Total</p>
                </div>
                <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
                    <h2 className="text-5xl font-bold text-primary">{enrollmentData.successfulEnrollments}</h2>
                    <p className="text-primary font-semibold mt-2">Successful Enrollment</p>
                </div>
                <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
                    <h2 className="text-5xl font-bold text-primary">{enrollmentData.failedEnrollments}</h2>
                    <p className="text-primary font-semibold">Failed Enrollment</p>
                </div>

            </div>

        <SubNavIndex activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="">
            {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
