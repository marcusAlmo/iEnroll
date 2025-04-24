import React from "react";
import { useScreenSize } from "@/contexts/useScreenSize";
import { Navigate, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import StatusBox from "./components/StatusBox";

const DashboardPage = () => {
  const { mobile } = useScreenSize();
  const navigate = useNavigate();
  
  if (!mobile) return <Navigate to="/iEnroll" />;

  // To do (backend):
  // Make the string username dynamic in Line 26

  // Sample code for simulation
  // eslint-disable-next-line prefer-const
  let enrollmentStatus = "none"; // ["enrolled", "none", "pending"];
  const enrollmentId = 12345;

  return (
    <section className="p-8 bg-container-1">
      <div className="flex justify-end">
        <FontAwesomeIcon 
          icon={faPowerOff}
          className="text-text-2"
          style={{ fontSize: "24px" }}
        />
      </div>

      <div className="mt-6">
        <h1 className="text-3xl text-primary font-semibold">Uy! <span className="text-secondary">Juan</span>, enroll ka na!</h1>
      </div>
      
      {/* Show this if enrollment status is enrolled */}
      {enrollmentStatus === "enrolled" && (
        <div>

        </div>
      )}

      <StatusBox status="Pending" />
      
    </section>
  );
};

export default DashboardPage;



