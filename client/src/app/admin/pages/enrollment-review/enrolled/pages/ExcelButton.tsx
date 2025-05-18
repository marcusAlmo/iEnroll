import React, { useState, useRef, useCallback, useEffect } from "react";
import { useEnrolledStudents } from "@/app/admin/context/useEnrolledStudents";
import { useQuery } from "@tanstack/react-query";
import {
  getAllStudentsEnrolled,
  getAllStudentsEnrolledByGradeLevel,
} from "@/services/desktop-web-app/enrollment-review/enrolled";
import * as XLSX from "xlsx";
import { requestData } from "@/lib/dataRequester";

interface SchoolDetails {
  schoolName: string;
  schoolId: number;
  province: string | null;
  region?: string;
}

interface EnrolledStudent {
  studentId: number;
  studentName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  applicationStatus: string;
  enrollmentDate: string;
  gradeLevel: string;
  section: string;
}

/**
 * ExcelButton Component
 *
 * This component provides a dropdown menu with different export options for enrolled students.
 * It allows users to export to Excel:
 * - All enrolled students
 * - Students in a specific grade level
 * - Students in a specific section
 */
interface ExcelButtonProps {
  className?: string;
}

const ExcelButton: React.FC<ExcelButtonProps> = ({ className = "" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState<1 | 2 | 3 | undefined>();
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(
    null,
  );
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

  // Fetch school details when component mounts
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await requestData<{
          schoolName: string;
          schoolId: number;
          province: string | null;
          region?: string;
        }>({
          url: "http://localhost:3000/api/school-details/retrieve",
          method: "GET",
        });

        if (response) {
          setSchoolDetails(response);
        }
      } catch (error) {
        console.error("Failed to fetch school details:", error);
      }
    };

    fetchSchoolDetails();
  }, []);

  const toEnrolledStudents = (students: EnrolledStudent[]) => students;

  const { data: gradeLevelStudents, isPending: isGradeLevelPending } = useQuery(
    {
      queryKey: ["enrolledStudentsGradeLevelExcel"],
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
            enrollmentDate: new Date(student.enrollmentDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            ),
            gradeLevel: student.gradeLevel,
            section: student.sectionName,
          })),
        );
      },
      enabled: !!selectedGradeLevel && mode === 2,
    },
  );

  const { data: allStudents, isPending: isAllStudentsPending } = useQuery({
    queryKey: ["enrolledStudentsExcel"],
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
          enrollmentDate: new Date(student.enrollmentDate).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          ),
          gradeLevel: student.gradeLevel,
          section: student.sectionName,
        })),
      );
    },
    enabled: mode === 1,
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

  // Generic export to Excel function
  const exportStudentsToExcel = useCallback(
    (studentsToExport: NonNullable<typeof sectionStudents>, title: string) => {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Create a new worksheet for the header
      const worksheet = XLSX.utils.aoa_to_sheet([
        ["Republic of the Philippines", "", "", "", "", ""],
        ["DEPARTMENT OF EDUCATION", "", "", "", "", ""],
        [
          `Region ${schoolDetails?.region || ""} ${schoolDetails?.province || ""}`,
          "",
          "",
          "",
          "",
          "",
        ],
        [`Division of ${schoolDetails?.province || ""}`, "", "", "", "", ""],
        [
          `${schoolDetails?.schoolId || ""} ${schoolDetails?.schoolName || ""}`,
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", ""], // Empty row as separator
        ["ID", "Name", "Grade Level", "Section", "Status", "Enrollment Date"], // Column headers
      ]);

      // Create data rows and add to worksheet starting from row 8
      const dataRows = studentsToExport.map((student) => [
        student.studentId,
        student.studentName,
        student.gradeLevel,
        student.section,
        student.applicationStatus,
        student.enrollmentDate,
      ]);

      // Add the data rows below the headers
      XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: "A8" });

      // Set column widths
      const wscols = [
        { wch: 8 }, // ID column width
        { wch: 30 }, // Name column width
        { wch: 15 }, // Grade Level column width
        { wch: 15 }, // Section column width
        { wch: 12 }, // Status column width
        { wch: 20 }, // Enrollment Date column width
      ];
      worksheet["!cols"] = wscols;

      // Merge cells for header rows to span across all columns
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Republic of the Philippines
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // DEPARTMENT OF EDUCATION
        { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Region
        { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // Division
        { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }, // School ID and name
      ];

      // Center align header rows
      for (let i = 0; i <= 4; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
        if (!worksheet[cellRef]) continue;
        if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
        worksheet[cellRef].s = {
          ...worksheet[cellRef].s,
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          font: {
            bold: true,
          },
        };
      }

      // Also center the column headers row
      for (let c = 0; c <= 5; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: 6, c });
        if (!worksheet[cellRef]) continue;
        if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
        worksheet[cellRef].s = {
          ...worksheet[cellRef].s,
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          font: {
            bold: true,
          },
        };
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      // Generate Excel file and trigger download
      const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    },
    [schoolDetails],
  );

  // Handle exporting all students
  const handleExportAll = useCallback(() => {
    setMode(1);
  }, []);

  useEffect(() => {
    if (mode === 1 && !isAllStudentsPending && allStudents) {
      exportStudentsToExcel(allStudents, "All Enrolled Students");
      setMode(undefined);
    }
  }, [mode, allStudents, exportStudentsToExcel, isAllStudentsPending]);

  // Handle exporting by grade level
  const handleExportByGradeLevel = useCallback(() => {
    if (!selectedGradeLevel) return;
    setMode(2);
  }, [selectedGradeLevel]);

  useEffect(() => {
    if (mode === 2 && !isGradeLevelPending && gradeLevelStudents) {
      exportStudentsToExcel(
        gradeLevelStudents,
        `Students in ${getGradeLevelName()}`,
      );
      setMode(undefined);
    }
  }, [
    mode,
    gradeLevelStudents,
    exportStudentsToExcel,
    getGradeLevelName,
    isGradeLevelPending,
  ]);

  // Handle exporting by section
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

  const handleExportBySection = useCallback(() => {
    if (!selectedSection) return;
    setMode(3);
  }, [selectedSection]);

  useEffect(() => {
    if (mode === 3 && !isStudentsRefetching && sectionStudents) {
      exportStudentsToExcel(
        sectionStudents,
        `Students in ${getGradeLevelName()} - ${getSectionName()}`,
      );
      setMode(undefined);
    }
  }, [
    mode,
    sectionStudents,
    exportStudentsToExcel,
    getGradeLevelName,
    getSectionName,
    isSectionsPending,
    isStudentsRefetching,
  ]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`button-transition button-transition flex cursor-pointer items-center gap-2 rounded-md border border-green-600 bg-green-300 px-4 py-2 text-green-800 hover:bg-green-700 hover:text-white ${className}`}
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
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
            clipRule="evenodd"
          />
        </svg>
        Export Excel
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
          <div className="py-1">
            <button
              className="button-transition block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleExportAll();
                setIsDropdownOpen(false);
              }}
            >
              Export All Students
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${!selectedGradeLevel ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => {
                handleExportByGradeLevel();
                setIsDropdownOpen(false);
              }}
              disabled={!selectedGradeLevel}
            >
              Export by Grade Level
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${!selectedSection ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => {
                handleExportBySection();
                setIsDropdownOpen(false);
              }}
              disabled={!selectedSection}
            >
              Export by Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelButton;
