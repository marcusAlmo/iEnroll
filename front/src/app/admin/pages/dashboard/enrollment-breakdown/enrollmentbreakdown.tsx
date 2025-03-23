import React from "react";

const EnrollmentBreakdown: React.FC = () => {
  return (
    <div className="flex-grow bg-white shadow-md rounded-lg p-4 border-2 border-text-2">
        <div className="flex w-full justify-center space-x-8">
            <p className="text-text-2 w-1/3 text-lg p-7">
                See the percentage of students enrolled in each grade level. 
                This helps you understand the overall makeup of our student body.
            </p>
            <div className="w-2/3 flex justify-center">
            </div>
        </div>
    </div>
    
  );
};

export default EnrollmentBreakdown;
