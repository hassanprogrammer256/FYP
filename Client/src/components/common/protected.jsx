import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, isAuthenticated, requiredRole, userRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default ProtectedRoute