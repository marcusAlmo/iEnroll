import React from 'react'
import { Navigate } from 'react-router'
import { useScreenSize } from '../contexts/ScreenSizeContext';

const MeetOurPartners = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/iEnroll" />;

  // If mobile, display the following JSX
  return (
    <div>
      Meet Our Partners
    </div>
  )
}

export default MeetOurPartners
