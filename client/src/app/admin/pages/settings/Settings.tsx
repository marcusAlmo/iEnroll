import { useState } from "react";
import Fees from "./tabs/fees";
import SystemBackup from "./tabs/systemBackup";
import SubNav from "../../components/SubNav_Settings";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("fees");

const renderTabContent = () => {
    switch (activeTab) {
      case "system-backup":
        return <SystemBackup />;
      
      default:
        return <Fees/>;
    }
  };
return (
  <div className="px-11 py-5 h-screen bg-container-1">
    <SubNav activeTab={activeTab} setActiveTab={setActiveTab} />
    <div>{renderTabContent()}</div>  
  </div>
  );
};

export default Settings;