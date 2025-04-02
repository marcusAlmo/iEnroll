import SubNav from "../../components/SubNav_Management";
import { useState } from "react";
import Announcements from "@/app/admin/pages/enrollment-management/announcements/announcement";
import SchoolDetails from "@/app/admin/pages/enrollment-management/school-details/schooldetails";
import SchoolClassification from "@/app/admin/pages/enrollment-management/school-classification/schoolclasification";
import Fees from "@/app/admin/pages/enrollment-management/fees/fees";
import GradeLevels from "@/app/admin/pages/enrollment-management/grade-levels/gradelevels";
import EnrollmentSchedule from "@/app/admin/pages/enrollment-management/enrollment-schedule/enrollmentschedule";
import Requirements from "@/app/admin/pages/enrollment-management/requirements/requirements";


const EnrollmentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("announcements");

const renderTabContent = () => {
    switch (activeTab) {
      case "announcements":
        return <Announcements/>;
      case "school-details":
        return <SchoolDetails/>;
      case "school-classification":
        return <SchoolClassification />;
      case "fees":
        return <Fees/>;
      case "grade-levels":
        return <GradeLevels/>;
      case "enrollment-schedule":
        return <EnrollmentSchedule/>;
      case "requirements":
        return <Requirements/>;
      
      default:
        return <Announcements/>;
    }
  };
return (
  <div className="w-full min-h-screen bg-container-1">
    <div>{renderTabContent()}</div>  
      <SubNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default EnrollmentManagement;
