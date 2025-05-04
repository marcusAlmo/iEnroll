import React, { useState, useEffect, useRef, useCallback } from "react";
import { useEnrolledStudents } from "@/app/admin/context/useEnrolledStudents";
import { useQuery } from "@tanstack/react-query";
import {
  getAllStudentsEnrolled,
  getAllStudentsEnrolledByGradeLevel,
} from "@/services/desktop-web-app/enrollment-review/enrolled";

interface EnrolledStudent {
  studentId: number; // Unique identifier for the student
  studentName: string; // Full name of the student (for display purposes)
  firstName: string; // Student's first name
  middleName: string | null; // Student's middle name
  lastName: string; // Student's last name
  suffix: string | null; // Student's suffix (e.g., "Jr.", "III")
  applicationStatus: string; // Current status of the student (e.g., "Enrolled")
  enrollmentDate: string; // Date when the student was enrolled
  gradeLevel: string; // Grade level of the student
  section: string; // Section of the student
}

/**
 * PrintButton Component
 *
 * This component provides a dropdown menu with different printing options for enrolled students.
 * It allows users to print:
 * - All enrolled students
 * - Students in a specific grade level
 * - Students in a specific section
 */
interface PrintButtonProps {
  className?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ className = "" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState<1 | 2 | 3 | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    gradeLevels,
    selectedGradeLevel,
    sections,
    selectedSection,
    students: sectionStudents,
    isSectionsPending,
    searchTerm,
    refetchStudents,
    isStudentsRefetching,
  } = useEnrolledStudents();

  const toEnrolledStudents = (students: EnrolledStudent[]) => students;

  const { data: gradeLevelStudents, isPending: isGradeLevelPending } = useQuery(
    {
      queryKey: ["enrolledStudentsGradeLevelPrint"],
      queryFn: () =>
        getAllStudentsEnrolledByGradeLevel(selectedGradeLevel!, searchTerm),
      select: (data) => {
        const raw = data.data;
        return toEnrolledStudents(
          raw.map((student) => ({
            studentId: student.studentId,
            studentName: [
              student.firstName,
              student.middleName,
              student.lastName,
              student.suffix,
            ]
              .filter(Boolean)
              .join(" "),
            firstName: student.firstName,
            middleName: student.middleName,
            lastName: student.lastName,
            suffix: student.suffix,
            applicationStatus: "Enrolled",
            enrollmentDate: student.enrollmentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            gradeLevel: student.gradeLevel,
            section: student.sectionName,
          })),
        );
      },
      enabled: !!selectedGradeLevel && mode === 2,
    },
  );
  const { data: allStudents, isPending: isAllStudentsPending } = useQuery({
    queryKey: ["enrolledStudentsPrint"],
    queryFn: () => getAllStudentsEnrolled(searchTerm),
    select: (data) => {
      const raw = data.data;
      return toEnrolledStudents(
        raw.map((student) => ({
          studentId: student.studentId,
          studentName: [
            student.firstName,
            student.middleName,
            student.lastName,
            student.suffix,
          ]
            .filter(Boolean)
            .join(" "),
          firstName: student.firstName,
          middleName: student.middleName,
          lastName: student.lastName,
          suffix: student.suffix,
          applicationStatus: "Enrolled",
          enrollmentDate: student.enrollmentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          gradeLevel: student.gradeLevel,
          section: student.sectionName,
        })),
      );
    },
    enabled: !!selectedSection && mode === 1,
  });

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get the grade level name for the selected grade level
  const getGradeLevelName = useCallback(() => {
    if (!selectedGradeLevel) return "All Grade Levels";
    const gradeLevel = gradeLevels?.find(
      (level) => level.gradeId === selectedGradeLevel,
    );
    return gradeLevel ? gradeLevel.gradeName : "All Grade Levels";
  }, [selectedGradeLevel, gradeLevels]);

  // Get the section name for the selected section
  const getSectionName = useCallback(() => {
    if (!selectedSection) return "All Sections";
    const section = sections?.find(
      (section) => section.sectionId === selectedSection,
    );
    return section ? section.sectionName : "All Sections";
  }, [sections, selectedSection]);

  // Filter students based on search term
  // const filteredStudents = students.filter(student =>
  //   student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   student.studentId.toString().includes(searchTerm)
  // );

  // Generic print function
  const printStudents = useCallback(
    (studentsToPrint: NonNullable<typeof sectionStudents>, title: string) => {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      // Create the HTML content for printing
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .date {
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="date">Printed on: ${new Date().toLocaleDateString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Grade Level</th>
                <th>Section</th>
                <th>Status</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              ${studentsToPrint
                .map(
                  (student) => `
                <tr>
                  <td>${student.studentId}</td>
                  <td>${student.studentName}</td>
                  <td>${student.gradeLevel}</td>
                  <td>${student.section}</td>
                  <td>${student.applicationStatus}</td>
                  <td>${student.enrollmentDate}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for the content to load before printing
      printWindow.onload = () => {
        printWindow.print();
        // Close the window after printing (optional)
        // printWindow.close();
      };
    },
    [],
  );

  // Handle printing all students
  const handlePrintAll = useCallback(() => {
    setMode(1);
  }, []);

  useEffect(() => {
    if (mode === 1 && !isAllStudentsPending && allStudents) {
      printStudents(allStudents, "All Enrolled Students");
      setMode(undefined);
    }
  }, [mode, allStudents, printStudents, isAllStudentsPending]);

  const handlePrintByGradeLevel = useCallback(() => {
    if (!selectedGradeLevel) return;

    setMode(2);
  }, [selectedGradeLevel]);

  useEffect(() => {
    if (mode === 2 && !isGradeLevelPending && gradeLevelStudents) {
      printStudents(gradeLevelStudents, `Students in ${getGradeLevelName()}`);
      setMode(undefined);
    }
  }, [
    mode,
    gradeLevelStudents,
    printStudents,
    getGradeLevelName,
    isGradeLevelPending,
  ]);

  useEffect(() => {
    const refetch = async () => {
      if (selectedSection) {
        await refetchStudents();
      }
    };
    if (mode === 3) {
      refetch();
    }
  }, [mode, refetchStudents, selectedSection]);

  const handlePrintBySection = useCallback(() => {
    if (!selectedSection) return;

    setMode(3);
  }, [selectedSection]);

  useEffect(() => {
    if (mode === 3 && !isStudentsRefetching && sectionStudents) {
      printStudents(
        sectionStudents,
        `Students in ${getGradeLevelName()} - ${getSectionName()}`,
      );
      setMode(undefined);
    }
  }, [
    mode,
    sectionStudents,
    printStudents,
    getGradeLevelName,
    getSectionName,
    isSectionsPending,
    isStudentsRefetching,
  ]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`bg-primary hover:bg-accent button-transition flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white ${className}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
            clipRule="evenodd"
          />
        </svg>
        Print
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
          <div className="py-1">
            <button
              className="button-transition block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handlePrintAll();
                setIsDropdownOpen(false);
              }}
            >
              Print All Students
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${!selectedGradeLevel ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => {
                handlePrintByGradeLevel();
                setIsDropdownOpen(false);
              }}
              disabled={!selectedGradeLevel}
            >
              Print by Grade Level
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${!selectedSection ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => {
                handlePrintBySection();
                setIsDropdownOpen(false);
              }}
              disabled={!selectedSection}
            >
              Print by Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintButton;
