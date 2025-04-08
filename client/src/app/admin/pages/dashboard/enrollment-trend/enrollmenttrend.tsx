import React from "react";
import EnrollmentTrendChart from "@/app/admin/components/EnrollmentTrendChart";

const EnrollmentTrend: React.FC = () => {
  return (
    <div className="flex-grow bg-white shadow-md rounded-lg p-4 border-2 border-text-2">
        <div className="flex w-full justify-center space-x-8">
            <p className="text-text-2 w-1/3 text-lg p-7">
              Track how enrollment has changed over time. This graph shows the growth or decline of student numbers, helping you identify trends.
            </p>
            <div className="w-2/3 flex justify-center">
                <EnrollmentTrendChart />
            </div>
        </div>
    </div>
    
  );
};

export default EnrollmentTrend;
