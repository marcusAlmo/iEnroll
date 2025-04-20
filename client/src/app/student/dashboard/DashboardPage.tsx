import React from "react";
import { useScreenSize } from "@/contexts/useScreenSize";

const DashboardPage = () => {
  const { mobile } = useScreenSize();

  return (
    <div>
      Dashboard
      {mobile}
    </div>
  );
};

export default DashboardPage;
