import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/layout'
import NotFound from './components/common/NotFound'
import { StaffNav, StudentNav } from './config'
import Profile from './components/common/profile'
import Register from './pages/student/register'
import Results from './pages/student/results'
import FileUploadPage from './pages/student/upload'
import Dashboard from './components/common/dashboard'
import LogIn from './components/common/login'
import Marks from './pages/Staff/marks'
import ProtectedRoute from './components/common/protected'

const App = () => {
  const isAuthenticated = localStorage.getItem('is_authenticated') === 'true'
  const role = localStorage.getItem('role') || ''

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<LogIn />} />
      
      {/* Root Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            role === 'student' ? (
              <Navigate to="/student" replace />
            ) : role === 'supervisor' ? (
              <Navigate to="/supervisor" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
            <Layout navitems={StudentNav} supervisor={false} />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="registration" element={<Register />} />
        <Route path="results" element={<Results />} />
        <Route path="upload" element={<FileUploadPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Supervisor Routes */}
      <Route
        path="/supervisor"
        element={
            <Layout navitems={StaffNav} supervisor={true} />
        }>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload-marks" element={<Marks />} />
        <Route path="check-work" element={<FileUploadPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App