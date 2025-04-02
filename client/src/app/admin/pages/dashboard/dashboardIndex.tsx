import React, { useState, useEffect } from "react";
import Navbar from "./../../components/Navbar";
import SubNavIndex from "./../../components/SubNav";
import EnrollmentBreakdown from "@/app/admin/pages/dashboard/enrollment-breakdown/enrollmentbreakdown";
import EnrollmentTrend from "@/app/admin/pages/dashboard/enrollment-trend/enrollmenttrend";
import PlanCapacity from "@/app/admin/pages/dashboard/plan-capacity/plancapacity";
import EnrollmentCount from "@/app/admin/pages/dashboard/enrollment-count/enrollmentcount";
import { getEnrollmentData } from "./../../../routes/dataRoutes";
import Refresh from "@/assets/images/refresh btn.svg"; 

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("enrollment-breakdown");
  const [enrollmentData, setEnrollmentData] = useState({
    totalEnrollments: 0,
    successfulEnrollments: 0,
    failedEnrollments: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch enrollment data
  const fetchEnrollmentData = async () => {
    const data = await getEnrollmentData();
    setEnrollmentData(data);
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  // Handle the refresh button click with animation
  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await fetchEnrollmentData(); // Fetch fresh data for both cards and tab content
    setIsRefreshing(false); 
  };

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
    <div className="w-full min-h-screen bg-container-1 flex flex-col">
      <div
        className={`absolute left-20 mt-5 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
        onClick={handleRefreshClick}
      >
        <img
          src={Refresh} 
          alt="refresh"
          className="w-5"
        />
      </div>

      <div className="p-4 mx-36 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4 relative">
          {/* Enrollment Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
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
        </div>

        {/* SubNav for tab navigation */}
        <SubNavIndex activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
