import { useState } from "react";
import { useScreenSize } from "@/contexts/useScreenSize";
import { Navigate, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import StatusBox from "./components/StatusBox";
import CustomAlertDialog from "@/components/CustomAlertDialog";

import data from "@/test/data/reupload-docs.json";

const DashboardPage = () => {
  const { mobile } = useScreenSize();
  const navigate = useNavigate();

  // For triggering the confirm logout modal
  const [showModal, setShowModal] = useState<boolean>(false);
  
  if (!mobile) return <Navigate to="/iEnroll" />;

  // Sample code for simulation
  // eslint-disable-next-line prefer-const
  let enrollmentStatus = "Enrolled"; // ["Enrolled", "None", "Pending"];
  const enrollmentId = 12345;

  // Sample data for description for enrolled students
  const sampleEnrolledDescription = {
    programName: "Senior High School - STEM",
    year: 11,
    paymentStatus: "Payment Complete"
  };

  // To do (backend):
  // Make the string username dynamic in Line 26

  // To do  (backend):
  // Make logout functional
  const logout = () => {
    navigate("/log-in");
  };

  // For the re-upload documents when enrollment is pending
  const reuploadDocumentsWithActions = data.map((doc) => ({
    ...doc,
    action: () => navigate("/student/enroll/upload-documents"),
  }));

  return (
    <section className={`${enrollmentStatus === "None" || enrollmentStatus === "Enrolled" ? "h-screen" : ""} p-8 bg-container-1`}>
      <div className="flex justify-end">
        <FontAwesomeIcon 
          icon={faPowerOff}
          className="text-text-2"
          style={{ fontSize: "24px" }}
          onClick={() => setShowModal(true)}
        />

        <CustomAlertDialog 
          isOpen={showModal}
          title="Confirm logout?"
          description="Are you sure you want to log out?"
          cancelLabel="No"
          cancelOnClick={() => setShowModal(false)}
          actionLabel="Yes"
          actionOnClick={logout}
        />
      </div>

      <div className="mt-6">
        <h1 className="text-3xl text-primary font-semibold">Uy! <span className="text-secondary">Juan</span>, enroll ka na!</h1>
      </div>
      
      {/* Show this if enrollment status is pending */}
      {enrollmentStatus === "Pending" && (
        <div className="rounded-[10px] bg-background flex flex-col justify-center items-center mt-6 px-6 py-4">
          <div className="font-semibold text-primary text-lg">
            Ito ang iyong Enrollment ID:
          </div>
          <div className="bg-secondary rounded-[10px] py-1.5 px-3.5 text-sm font-semibold mt-1.5">
            {enrollmentId}
          </div>
          <p className="text-sm text-primary text-center mt-6">Show this to the registrar of your school</p>
        </div>
      )}

      <StatusBox status={enrollmentStatus} description={sampleEnrolledDescription} />

      {/* Show this if enrollment status is "Pending" */}
      {enrollmentStatus === "Pending" && (
        <>
          <div className="mt-6 text-primary font-semibold text-lg">Documents</div>
          <div className="rounded-[10px] bg-background flex flex-col justify-center mt-2.5 px-6 py-4">
            <div className="font-semibold text-primary text-lg">
              Re-upload documents
            </div>
            <div>
              <p className="text-sm text-primary mt-6">Please re-upload the following documents:</p>
              <ul className="text-sm underline text-accent list-disc ml-6 mt-2">
                {reuploadDocumentsWithActions.map((doc, index) => (
                  <li key={index} onClick={doc.action} className="mt-1">{doc.documentName}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-[10px] bg-background flex flex-col justify-center mt-6 px-6 py-4">
            <div className="font-semibold text-primary text-lg">
              Download documents
            </div>
            <div>
              <ul className="text-sm underline text-accent list-disc ml-6 mt-2">
                <li className="mt-1">Student Handbook</li>
              </ul>
            </div>
          </div>
          <div className="rounded-[10px] bg-border-1 flex flex-col justify-center items-center my-6 px-6 py-4">
            <div className="font-semibold text-text-2 text-lg">
              Request Document
            </div>
            <div className="text-sm font-semibold text-text-2 mt-1.5 text-center">This feature is coming soon in the next update.</div>
          </div>
        </>
      )}
      
    </section>
  );
};

export default DashboardPage;



