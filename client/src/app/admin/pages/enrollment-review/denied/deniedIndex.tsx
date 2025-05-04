import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SubNavCopy from "../../../components/SubNavCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getDeniedEnrollmentsBySchool } from "@/services/desktop-web-app/enrollment-review/denied/src";
// import { sampleDeniedStudents as denied } from './sampleData';

/**
 * Interface representing a denied student with their application details
 * @interface DeniedStudent
 */
interface DeniedStudent {
  studentId: number;
  studentName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  applicationStatus: string;
  denialDate: string;
  reviewedBy: string;
  requirements: {
    requirementName: string;
    requirementStatus: boolean;
    userInput?: string | null;
    imageUrl?: string | null;
    requirementType: string;
    denialReason?: string | null;
  }[];
}

/**
 * DeniedIndex Component
 *
 * Displays a list of students whose enrollment applications have been denied.
 * Provides functionality to view detailed information about each denied application.
 *
 * @component
 * @returns {JSX.Element} The rendered DeniedIndex component
 */
const DeniedIndex: React.FC = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // State to track the currently active navigation item
  const [activeItem, setActiveItem] = useState("Denied");

  // State to track which student's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const toDeniedStudentType = (student: DeniedStudent[]) => student;

  const { data: deniedStudents, isPending } = useQuery({
    queryKey: ["deniedStudents"],
    queryFn: getDeniedEnrollmentsBySchool,
    select: (data) => {
      const raw = data.data;

      return toDeniedStudentType(
        raw.map((student) => ({
          studentId: student.applicationId,
          studentName: [
            student.student.firstName,
            student.student.middleName,
            student.student.lastName,
            student.student.suffix,
          ]
            .filter(Boolean)
            .join(" "),
          firstName: student.student.firstName,
          middleName: student.student.middleName,
          lastName: student.student.lastName,
          suffix: student.student.suffix,
          applicationStatus: "Denied",
          denialDate: student.dateDenied?.toString() || "",
          reviewedBy:
            [
              student.reviewer?.firstName,
              student.reviewer?.middleName,
              student.reviewer?.lastName,
              student.reviewer?.suffix,
            ]
              .filter(Boolean)
              .join(" ") || "N/A",
          requirements: student.reasons.map((req) => ({
            requirementName: req.requirementName,
            // TODO: Make this possible on next iteration
            requirementStatus: req.reason === null ? true : false,
            userInput: req.reason || null,
            imageUrl: null,
            requirementType: "document",
            denialReason: req.reason || null,
          })),
        })),
      );
    },
  });

  // // State to store denied students
  // const [deniedStudents, setDeniedStudents] = useState<DeniedStudent[]>(denied);

  // // Get context values
  // const {
  //   sections,
  //   students,
  // } = useEnrollmentReview();

  /**
   * Fetches denied students when component mounts
   * Filters students with "Denied" status from all sections
   */
  // useEffect(() => {
  //   // Please insert the API call here. Thanks
  //   const fetchDeniedStudents = () => {
  //     // Get all students from all sections
  //     const allStudents: DeniedStudent[] = [];

  //     if (sections.length > 0) {
  //       sections.forEach(() => {
  //         const deniedStudentsList = students.filter((student: Student) =>
  //           student.applicationStatus === "Denied"
  //         );

  //         if (deniedStudentsList.length > 0) {
  //           allStudents.push(...deniedStudentsList as DeniedStudent[]);
  //         }
  //       });
  //     }

  //     // If no denied students found in context, use sample data
  //     // Please remove after API call is implemented
  //     setDeniedStudents(allStudents.length > 0 ? allStudents : denied);
  //   };

  //   fetchDeniedStudents();
  // }, [sections, students]);

  /**
   * Navigation items for the sub-navigation bar
   * Memoized to prevent unnecessary re-renders
   */
  const SubNavItem = useMemo(
    () => [
      {
        label: "Assigned", // Label for the "Assigned" navigation item
        onClick: () => {
          setActiveItem("Assigned"); // Update active state to "Assigned"
          navigate("/admin/enrollment-review"); // Navigate to the "Assigned" route
        },
      },
      {
        label: "Denied", // Label for the "Denied" navigation item
        onClick: () => {
          setActiveItem("Denied"); // Update active state to "Denied"
          navigate("/admin/enrollment-review/denied"); // Navigate to the "Denied" route
        },
      },
      {
        label: "Enrolled", // Label for the "Enrolled" navigation item
        onClick: () => {
          setActiveItem("Enrolled"); // Update active state to "Enrolled"
          navigate("/admin/enrollment-review/enrolled"); // Navigate to the "Enrolled" route
        },
      },
    ],
    [navigate], // Dependency array ensures SubNavItem updates if `navigate` changes
  );

  /**
   * Toggles the dropdown visibility for a specific student
   *
   * @param {number} studentId - The ID of the student whose dropdown should be toggled
   */
  const toggleDropdown = (studentId: number) => {
    setOpenDropdownId(openDropdownId === studentId ? null : studentId);
  };

  /**
   * Formats a date string to a more readable format
   *
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col px-7 py-7">
      <div className="mb-5 flex justify-between">
        <div className="border-text-2 bg-background max-h-18 rounded-[10px] border p-2">
          <SubNavCopy items={SubNavItem} activeItem={activeItem} />
        </div>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex h-full items-center justify-center">
          <div className="loader"></div>
        </div>
      )}

      {/* No Denied Students State */}
      {!deniedStudents && !isPending && (
        <div className="text-text-2 py-8 text-center">
          No denied applications found.
        </div>
      )}

      {/* Denied Students List */}
      <div className="bg-background border-text-2 rounded-[10px] border p-4 shadow-md">
        {deniedStudents && deniedStudents.length === 0 ? (
          <div className="text-text-2 py-8 text-center">
            No denied applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/20 text-left">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Date Denied</th>
                  <th className="p-3">Reviewed By</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deniedStudents &&
                  deniedStudents.map((student) => (
                    <React.Fragment key={student.studentId}>
                      <tr className="hover:bg-accent/10 border-b text-sm">
                        <td className="p-3">
                          <span className="font-semibold">
                            {student.lastName.toUpperCase()}
                          </span>
                          , {student.firstName} {student.middleName}
                        </td>
                        <td className="p-3">
                          {formatDate(student.denialDate)}
                        </td>
                        <td className="p-3">{student.reviewedBy}</td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleDropdown(student.studentId)}
                            className="text-accent hover:text-primary button-transition flex cursor-pointer items-center"
                          >
                            {openDropdownId === student.studentId ? (
                              <>
                                <span className="mr-1">Hide Details</span>
                                <FontAwesomeIcon icon={faChevronUp} />
                              </>
                            ) : (
                              <>
                                <span className="mr-1">View Details</span>
                                <FontAwesomeIcon icon={faChevronDown} />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Dropdown content */}
                      {openDropdownId === student.studentId && (
                        <tr>
                          <td colSpan={4} className="bg-accent/5 p-4">
                            <h3 className="mb-2 font-semibold">
                              Denied Requirements:
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              {student.requirements
                                .filter(
                                  (req) => req.requirementStatus === false,
                                )
                                .map((req, index) => (
                                  <div
                                    key={index}
                                    className="border-text-2 rounded-md border p-3"
                                  >
                                    <h4 className="font-medium">
                                      {req.requirementName}
                                    </h4>
                                    {req.denialReason && (
                                      <p className="text-danger mt-1 text-sm">
                                        <span className="font-medium">
                                          Reason:{" "}
                                        </span>
                                        {req.denialReason}
                                      </p>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeniedIndex;
