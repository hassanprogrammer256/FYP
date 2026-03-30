import { useState, useEffect } from 'react'
import { Box, Sheet } from '@mui/joy'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/ui/sidebar'
import Header from '../../components/ui/header'
import { useToast } from '../ui/toast-context'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../ui/loading'
import { motion, AnimatePresence } from 'framer-motion' 
import { fetchFeedbacks, fetchStudentProjects, fetchSubmissions } from '../../features/studentSlice'
import { fetchPendingReviews, fetchSupervisorStudents } from '../../features/supervisorSlice'

const Layout = ({ navitems, supervisor }) => {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  
  // Get auth state
  const {role,reg_no, dashboardData, isLoading: authLoading } = useSelector((state) => state.auth)
  console.log({role,dashboardData,reg_no})
  
  // Get role-specific data
  const studentState = useSelector((state) => state.student)
  const supervisorState = useSelector((state) => state.supervisor)
  const adminState = useSelector((state) => state.admin)

  // Determine bio based on role
  let bio = null
  if (role === 'student') {
    bio = studentState.bio || dashboardData?.bio
  } else if (role === 'supervisor') {
    bio = supervisorState.bio || dashboardData?.bio
  } else if (role === 'admin') {
    bio = {
      first_name: bio?.bioname || 'Admin',
      last_name: '',
      email: bio?.email || 'admin@example.com'
    }
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        console.log('Fetching dashboard data...')
        setIsLoading(true)
      
        if (reg_no) {
          console.log({reg_no})
          const res = await dispatch(fetchDashboardData()).unwrap()
          console.log({res})
          // Then fetch role-specific data
          if (role === "student" && reg_no) {
            await Promise.all([
              dispatch(fetchStudentProjects(bio.profile_id)).unwrap(),
              dispatch(fetchSubmissions(bio.profile_id)).unwrap(),
              dispatch(fetchFeedbacks(bio.profile_id)).unwrap()
            ]).catch(err => console.error('Error fetching student data:', err))
          } else if (role === "supervisor" && bio.profile_id) {
            await Promise.all([
              dispatch(fetchSupervisorStudents(bio.profile_id)).unwrap(),
              dispatch(fetchPendingReviews(bio.profile_id)).unwrap()
            ]).catch(err => console.error('Error fetching supervisor data:', err))
          }
        }else{
          console.warn('No reg_no found in localStorage, skipping data fetch')
        }
      } catch (error) {
        addToast({ 
          message: error.message || 'Error fetching data', 
          variant: 'destructive' 
        })
        console.error('Fetch error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (bio?.id) {
      fetchAllData()
    } else {
      setIsLoading(false)
    }
  }, [dispatch, addToast, role, reg_no])

  // Show loading while fetching data
  if (isLoading || authLoading) {
    return <Loading />
  }

  return (
    <Sheet sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          height: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          flexShrink: 0,
          bgcolor: 'background.surface',
        }}
      >
        <Header
          supervisor={supervisor}
          open={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(prev => !prev)}
          bio={bio}
          role={role}
        />
      </Box>

      {/* Content area with sidebar and main */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar always visible on md+ screens */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            borderRight: '1px solid',
            borderColor: 'divider',
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 10,
            bgcolor: role === 'supervisor' ? '#041d11' : '#04111d',
          }}
        >
          <SideBar
            supervisor={supervisor}
            navitems={navitems}
            bio_data={bio}
            role={role}
            open={true}
            toggle={() => {}}
          />
        </Box>

        {/* Overlay and animated sidebar for small screens */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'black',
                  zIndex: 50,
                }}
              />
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: 280,
                  zIndex: 60,
                }}
              >
                <SideBar
                  navitems={navitems}
                  bio_data={bio}
                  role={role}
                  open={true}
                  supervisor={supervisor}
                  toggle={() => setSidebarOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <motion.div
          animate={{
            opacity: sidebarOpen ? 0.7 : 1,
            filter: sidebarOpen ? 'blur(4px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            padding: 24,
            backgroundColor: 'background.level1',
          }}
          onClick={() => {
            if (sidebarOpen) setSidebarOpen(false)
          }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Sheet>
  )
}

export default Layout