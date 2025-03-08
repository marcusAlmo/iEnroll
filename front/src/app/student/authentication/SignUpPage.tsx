import { isMobile } from '../../../utils/miscUtils'
import { Navigate } from 'react-router'

const SignUpPage = () => {
  // If not mobile, navigate to the Warning Page
  if (!isMobile()) return <Navigate to="/iEnroll" />

  return (
    <div>
      Sign Up
    </div>
  )
}

export default SignUpPage
