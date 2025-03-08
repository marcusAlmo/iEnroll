import React from 'react'
import { isMobile } from '../utils/miscUtils'
import { Navigate } from 'react-router'

const MeetOurPartners = () => {

  // If not mobile, navigate to the Warning Page
  if (!isMobile()) return <Navigate to="/iEnroll" />

  // If mobile, display the following JSX
  return (
    <div>
      Meet Our Partners
    </div>
  )
}

export default MeetOurPartners
