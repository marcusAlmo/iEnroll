/**
 * DashboardPage component represents the main dashboard for students.
 * It displays enrollment status, allows re-uploading of documents, and provides
 * options for logging out and navigating to other pages.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered DashboardPage component.
 *
 * @remarks
 * - Redirects to `/iEnroll` if the user is not on a mobile device.
 * - Displays different UI elements based on the enrollment status (`Enrolled`, `None`, or `Pending`).
 * - Includes a logout confirmation modal.
 * - Provides functionality for re-uploading documents when enrollment status is `Pending`.
 *
 * @todo
 * - Make the username dynamic in the greeting message.
 * - Implement backend functionality for logging out.
 *
 * @example
 * ```tsx
 * import DashboardPage from './DashboardPage';
 *
 * const App = () => {
 *   return <DashboardPage />;
 * };
 *
 * export default App;
 * ```
 */

import { useState } from "react";
import { useScreenSize } from "@/contexts/useScreenSize";
import { Navigate, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import StatusBox from "./components/StatusBox";
import CustomAlertDialog from "@/components/CustomAlertDialog";

// import data from "@/test/data/reupload-docs.json";
import { useQuery } from "@tanstack/react-query";
import {
  getDocumentsForReupload,
  getEnrolleeDetails,
  getEnrollmentStatus,
  getStudentFirstName,
} from "@/services/mobile-web-app/dashboard";
import { useAuth } from "@/contexts/useAuth";

enum AcceptedEnrollmentStatus {
  enrolled = "Enrolled",
  none = "None",
  pending = "Pending",
}

const DashboardPage = () => {
  const { mobile } = useScreenSize();
  const { logout: logoutMobile } = useAuth();
  const navigate = useNavigate();

  const { data: firstname, isPending: isFirstnamePending } = useQuery({
    queryKey: ["student-firstname"],
    queryFn: getStudentFirstName,
    select: (data) => data.data,
  });

  const { data: details, isPending: isDetailsPending } = useQuery({
    queryKey: ["student-enrollment-details"],
    queryFn: getEnrolleeDetails,
    select: (data) => data.data,
  });

  const { data: status, isPending: isEnrollmentStatusPending } = useQuery({
    queryKey: ["student-enrollment-status"],
    queryFn: getEnrollmentStatus,
    select: ({ data }) => {
      const enrollmentStatus = data.enrollmentStatus;
      let interpretedStatus: AcceptedEnrollmentStatus;

      switch (enrollmentStatus) {
        case "accepted":
          interpretedStatus = AcceptedEnrollmentStatus.enrolled;
          break;
        case "pending":
          interpretedStatus = AcceptedEnrollmentStatus.pending;
          break;
        // TODO: Make logic for denied and invalid enrollment
        default:
          interpretedStatus = AcceptedEnrollmentStatus.none;
      }

      return {
        ...data,
        enrollmentStatus: interpretedStatus,
      };
    },
  });

  const { data: reuploads, isPending: isReuploadsPending } = useQuery({
    queryKey: ["student-documents-for-reupload"],
    queryFn: getDocumentsForReupload,
    select: ({ data }) =>
      data.map((d) => ({
        // TODO: Requirement and application ID can be used for reference
        documentName: d.requirementName,
        action: () => navigate("/student/enroll/upload-documents"),
      })),
  });

  // For the re-upload documents when enrollment is pending
  // const reuploadDocumentsWithActions = data.map((doc) => ({
  //   ...doc,
  //   action: () => navigate("/student/enroll/upload-documents"),
  // }));

  // For triggering the confirm logout modal
  const [showModal, setShowModal] = useState<boolean>(false);

  if (!mobile) return <Navigate to="/iEnroll" />;

  // Sample code for simulation
  // let enrollmentStatus = "Enrolled"; // ["Enrolled", "None", "Pending"];
  // const enrollmentId = 12345;

  // Sample data for description for enrolled students
  // const sampleEnrolledDescription = {
  //   programName: "Senior High School - STEM",
  //   year: 11,
  //   paymentStatus: "Payment Complete",
  // };

  // To do (backend):
  // Make the string username dynamic in Line 26

  // To do  (backend):
  // Make logout functional
  const logout = () => {
    logoutMobile();
    navigate("/log-in");
  };

  return (
    !isEnrollmentStatusPending &&
    status &&
    !isDetailsPending &&
    details && (
      <section
        className={`${status.enrollmentStatus === "None" || status.enrollmentStatus === "Enrolled" ? "h-screen" : ""} bg-container-1 p-8`}
      >
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
          {!isFirstnamePending && (
            <h1 className="text-primary text-3xl font-semibold">
              Uy! <span className="text-secondary">{firstname ?? "User"}</span>,
              enroll ka na!
            </h1>
          )}
        </div>

        {/* Show this if enrollment status is pending */}
        {status.enrollmentStatus === "Pending" && (
          <div className="bg-background mt-6 flex flex-col items-center justify-center rounded-[10px] px-6 py-4">
            <div className="text-primary text-lg font-semibold">
              Ito ang iyong Enrollment ID:
            </div>
            <div className="bg-secondary mt-1.5 rounded-[10px] px-3.5 py-1.5 text-sm font-semibold">
              {details?.enrollmentId}
            </div>
            <p className="text-primary mt-6 text-center text-sm">
              Show this to the registrar of your school
            </p>
          </div>
        )}

        <StatusBox
          status={status.enrollmentStatus}
          description={{
            programName: status.program ?? "None",
            year: parseInt(status.gradeLevel),
            paymentStatus: status.isPaid
              ? "Payment Complete"
              : (status.dueDate ??
                //? An error occured if this is called
                new Date()),
          }}
        />

        {/* Show this if enrollment status is "Pending" */}
        {status.enrollmentStatus === "Pending" && (
          <>
            <div className="text-primary mt-6 text-lg font-semibold">
              Documents
            </div>
            {!isReuploadsPending && reuploads && reuploads.length && (
              <div className="bg-background mt-2.5 flex flex-col justify-center rounded-[10px] px-6 py-4">
                <div className="text-primary text-lg font-semibold">
                  Re-upload documents
                </div>
                <div>
                  <p className="text-primary mt-6 text-sm">
                    Please re-upload the following documents:
                  </p>
                  <ul className="text-accent mt-2 ml-6 list-disc text-sm underline">
                    {reuploads.map((doc, index) => (
                      <li key={index} onClick={doc.action} className="mt-1">
                        {doc.documentName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="bg-background mt-6 flex flex-col justify-center rounded-[10px] px-6 py-4">
              <div className="text-primary text-lg font-semibold">
                Download documents
              </div>
              <div>
                <ul className="text-accent mt-2 ml-6 list-disc text-sm underline">
                  <li className="mt-1">Student Handbook</li>
                </ul>
              </div>
            </div>
            <div className="bg-border-1 my-6 flex flex-col items-center justify-center rounded-[10px] px-6 py-4">
              <div className="text-text-2 text-lg font-semibold">
                Request Document
              </div>
              <div className="text-text-2 mt-1.5 text-center text-sm font-semibold">
                This feature is coming soon in the next update.
              </div>
            </div>
          </>
        )}
      </section>
    )
  );
};

export default DashboardPage;
