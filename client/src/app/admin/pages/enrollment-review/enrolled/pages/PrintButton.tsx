import React, { useState, useEffect, useRef } from 'react';
import { useEnrolledStudents } from '../../../../context/enrolledStudentsContext';
import enrolledStudentsData from '../../test/enrolledStudentsData.json';

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

const PrintButton: React.FC<PrintButtonProps> = ({ className = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    gradeLevels,
    selectedGradeLevel,
    sections,
    selectedSection,
    students,
    searchTerm,
  } = useEnrolledStudents();

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get the grade level name for the selected grade level
  const getGradeLevelName = () => {
    if (!selectedGradeLevel) return 'All Grade Levels';
    const gradeLevel = gradeLevels.find(level => level.gradeId === selectedGradeLevel);
    return gradeLevel ? gradeLevel.gradeName : 'All Grade Levels';
  };

  // Get the section name for the selected section
  const getSectionName = () => {
    if (!selectedSection) return 'All Sections';
    const section = sections.find(section => section.sectionId === selectedSection);
    return section ? section.sectionName : 'All Sections';
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toString().includes(searchTerm)
  );

  // Handle printing all students
  const handlePrintAll = () => {
    // Get all students from all sections
    const allStudents = Object.values(enrolledStudentsData.students)
      .flat();
    
    printStudents(allStudents, 'All Enrolled Students');
  };

  // Handle printing students by grade level
  const handlePrintByGradeLevel = () => {
    if (!selectedGradeLevel) return;
    
    // Get all students from the selected grade level
    const gradeLevelStudents = Object.values(enrolledStudentsData.students)
      .flat()
      .filter(student => student.gradeLevel === selectedGradeLevel);
    
    printStudents(gradeLevelStudents, `Students in ${getGradeLevelName()}`);
  };

  // Handle printing students by section
  const handlePrintBySection = () => {
    if (!selectedSection) return;
    
    printStudents(filteredStudents, `Students in ${getGradeLevelName()} - ${getSectionName()}`);
  };

  // Generic print function
  const printStudents = (studentsToPrint: typeof students, title: string) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
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
              ${studentsToPrint.map(student => `
                <tr>
                  <td>${student.studentId}</td>
                  <td>${student.studentName}</td>
                  <td>${getGradeLevelNameById(student.gradeLevel)}</td>
                  <td>${getSectionNameById(student.section)}</td>
                  <td>${student.applicationStatus}</td>
                  <td>${student.enrollmentDate}</td>
                </tr>
              `).join('')}
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
  };

  // Helper function to get grade level name by ID
  const getGradeLevelNameById = (gradeId: number) => {
    const gradeLevel = gradeLevels.find(level => level.gradeId === gradeId);
    return gradeLevel ? gradeLevel.gradeName : '';
  };

  // Helper function to get section name by ID
  const getSectionNameById = (sectionId: number) => {
    // First try to find the section in the current sections list
    const section = sections.find(section => section.sectionId === sectionId);
    if (section) return section.sectionName;
    
    // If not found in current sections, search through all sections in the data
    for (const gradeKey in enrolledStudentsData.sections) {
      const gradeSections = enrolledStudentsData.sections[gradeKey as keyof typeof enrolledStudentsData.sections];
      const foundSection = gradeSections.find(s => s.sectionId === sectionId);
      if (foundSection) return foundSection.sectionName;
    }
    
    return 'Unknown Section';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-accent cursor-pointer button-transition ${className}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        Print
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer button-transition"
              onClick={() => {
                handlePrintAll();
                setIsDropdownOpen(false);
              }}
            >
              Print All Students
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${!selectedGradeLevel ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => {
                handlePrintByGradeLevel();
                setIsDropdownOpen(false);
              }}
              disabled={!selectedGradeLevel}
            >
              Print by Grade Level
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${!selectedSection ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
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