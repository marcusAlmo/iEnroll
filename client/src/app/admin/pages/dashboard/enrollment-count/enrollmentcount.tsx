import React from "react";
import EnrollmentCountChart from "@/app/admin/components/EnrollmentCountChart";

const EnrollmentCount: React.FC = () => {
  return (
    <div className="flex-grow bg-white shadow-md rounded-lg p-4 border-2 border-text-2">
        <div className="flex w-full justify-center space-x-8">
            <p className="text-text-2 w-1/3 text-lg p-7">
              View the exact number of students enrolled in each grade. This comparison lets you quickly see which grades have the highest and lowest enrollment.
            </p>
            <div className="w-2/3 flex justify-center">
                <EnrollmentCountChart />
            </div>
        </div>
    </div>
    
  );
};

export default EnrollmentCount;
