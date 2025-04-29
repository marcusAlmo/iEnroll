import React from 'react'
import { EnrolledStudentsProvider } from '../../../../context/enrolledStudentsContext'
import { EnrolledGradeLevelsPanel } from "./EnrolledGradeLevelsPanel"
import { EnrolledSectionsPanel } from "./EnrolledSectionsPanel"
import EnrolledStudentsPanel from "./EnrolledStudentsPanel";

/**
 * EnrolledList Component
 * 
 * This component displays the enrolled students list with filters for grade levels and sections.
 * It consists of three panels:
 * 1. EnrolledGradeLevelsPanel - For selecting a grade level
 * 2. EnrolledSectionsPanel - For selecting a section within the selected grade level
 * 3. EnrolledStudentsPanel - For displaying the list of enrolled students
 */
const EnrolledList:React.FC = () => {
  return (
    <EnrolledStudentsProvider>
      <div className='w-full flex flex-row'>
        <EnrolledGradeLevelsPanel />
        <EnrolledSectionsPanel />
        <EnrolledStudentsPanel />
      </div>
    </EnrolledStudentsProvider>
  )
}

export default EnrolledList
