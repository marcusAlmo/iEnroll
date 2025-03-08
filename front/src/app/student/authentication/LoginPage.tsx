import { isMobile } from '../../../utils/miscUtils'
import { Navigate } from 'react-router'

const LoginPage = () => {
  // If not mobile, navigate to the Warning Page
  if (!isMobile()) return <Navigate to="/iEnroll" />

  return (
    <div>
      Log in Page
    </div>
  )
}

export default LoginPage
