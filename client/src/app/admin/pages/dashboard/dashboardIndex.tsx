import React, { useState, useEffect } from "react";
//import Navbar from "./../../components/Navbar";
import SubNavIndex from "./../../components/SubNav";
import EnrollmentBreakdown from "@/app/admin/pages/dashboard/enrollment-breakdown/enrollmentbreakdown";
import EnrollmentTrend from "@/app/admin/pages/dashboard/enrollment-trend/enrollmenttrend";
import PlanCapacity from "@/app/admin/pages/dashboard/plan-capacity/plancapacity";
import EnrollmentCount from "@/app/admin/pages/dashboard/enrollment-count/enrollmentcount";
//import { getEnrollmentData } from "./../../../routes/dataRoutes";
import Refresh from "@/assets/images/refresh btn.svg"; 
import { requestData } from "@/lib/dataRequester";

interface enrollmentCardsData {
  enrollmentTotal: number,
  successfullEnrollmentTotal: number,
  invalidOrDeniedEnrollmentTotal: number
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("enrollment-breakdown");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<enrollmentCardsData>({
    enrollmentTotal: 0,
    successfullEnrollmentTotal: 0,
    invalidOrDeniedEnrollmentTotal: 0
  });

  // Fetch enrollment data
  const fetchEnrollmentData = async () => {
    try{
      const response = await requestData<enrollmentCardsData>({
        url: 'http://localhost:3000/api/metrics/cards/data',
        method: 'GET'
      });

      if(response) {
        console.log('response: ', response);
        setEnrollmentData(response);
      }

    }catch(err) {
      if(err instanceof Error) console.log(err.message);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  // Handle the refresh button click with animation
  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await fetchEnrollmentData();
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
    <div className="w-full h-screen bg-container-1 flex flex-col overflow-hidden">
      {/* Refresh Button - Now Fixed */}
      <div className="fixed top-25 left-10 z-50">
        <button
          onClick={handleRefreshClick}
          className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <img src={Refresh} alt="refresh" className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 mx-36 flex flex-col flex-grow overflow-hidden mt-5">
        {/* Enrollment Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-6">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.enrollmentTotal}</h2>
            <p className="text-primary font-semibold mt-2">Enrollment Total</p>
          </div>
          <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-6">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.successfullEnrollmentTotal}</h2>
            <p className="text-primary font-semibold mt-2">Successful Enrollment</p>
          </div>
          <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-6">
            <h2 className="text-5xl font-bold text-primary">{enrollmentData.invalidOrDeniedEnrollmentTotal}</h2>
            <p className="text-primary font-semibold">Failed Enrollment</p>
          </div>
        </div>

        {/* SubNav for tab navigation */}
        <SubNavIndex activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="flex-grow overflow-hidden">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
