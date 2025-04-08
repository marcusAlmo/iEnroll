import React from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext';

const DashboardPage = () => {
  const { mobile } = useScreenSize();
  
  return (
    <div>
      Dashboard
      {mobile}
    </div>
  )
}

export default DashboardPage
