import { Stack, Box, Typography, Avatar, ListItemContent, IconButton, Chip } from '@mui/joy'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa'

const MotionStack = motion(Stack)

const SideBar = ({ navitems, user_data, open, toggle, supervisor, role }) => {
  const location = useLocation()
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768

  // Get user initials
  const getInitials = () => {
    if (!user_data) return 'U'
    const first = user_data.first_name?.[0] || ''
    const last = user_data.last_name?.[0] || ''
    return (first + last).toUpperCase() || user_data.email?.[0]?.toUpperCase() || 'U'
  }

  // Get full name
  const getFullName = () => {
    if (!user_data) return 'User'
    if (user_data.first_name && user_data.last_name) {
      return `${user_data.first_name} ${user_data.last_name}`
    }
    return user_data.first_name || user_data.email || 'User'
  }

  // Get user role display
  const getRoleDisplay = () => {
    if (role === 'student') return 'Student'
    if (role === 'supervisor') return 'Supervisor'
    if (role === 'admin') return 'Administrator'
    return 'User'
  }

  // Get avatar color based on role
  const getAvatarColor = () => {
    if (role === 'student') return 'primary'
    if (role === 'supervisor') return 'success'
    if (role === 'admin') return 'neutral'
    return 'primary'
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <MotionStack
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { x: 0, opacity: 1 },
              closed: { x: -280, opacity: 0 }
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            sx={{
              height: '100%',
              width: 280,
              backgroundColor: supervisor ? '#041d11' : '#04111d',
              color: 'white',
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Close button on small devices */}
            {isSmallScreen && (
              <IconButton
                onClick={toggle}
                aria-label="Close sidebar"
                sx={{ 
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <FaTimes />
              </IconButton>
            )}

            {/* User Profile Section */}
            <Box sx={{ 
              p: 3, 
              pt: isSmallScreen ? 8 : 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'rgba(255,255,255,0.1)',
              mb: 2
            }}>
              <Avatar
                size="lg"
                color={getAvatarColor()}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  fontSize: '2rem',
                  backgroundColor: supervisor ? '#1a8f3f' : '#185ea5'
                }}
              >
                {getInitials()}
              </Avatar>
              
              <Typography level="h4" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                {getFullName()}
              </Typography>
              
              <Chip 
                size="sm" 
                color={getAvatarColor()}
                sx={{ 
                  mt: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                {getRoleDisplay()}
              </Chip>
              
              {user_data?.email && (
                <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, textAlign: 'center' }}>
                  {user_data.email}
                </Typography>
              )}
              
              {user_data?.reg_no && (
                <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                  ID: {user_data.reg_no}
                </Typography>
              )}
            </Box>

            {/* Navigation Items */}
            <List sx={{ flex: 1, px: 2 }}>
              {navitems.map((item, index) => {
                const isActive = location.pathname === item.to
                return (
                  <ListItem key={index} sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      onClick={toggle}
                      sx={{
                        borderRadius: 'md',
                        py: 1.5,
                        backgroundColor: 'transparent',
                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          backgroundColor: supervisor ? 'rgba(26,143,63,0.2)' : 'rgba(24,94,165,0.2)',
                          color: 'white'
                        },
                        ...(isActive && {
                          backgroundColor: supervisor ? '#1a8f3f' : '#185ea5',
                          '&:hover': {
                            backgroundColor: supervisor ? '#1a8f3f' : '#185ea5',
                          }
                        }),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                        <item.icon size={20} />
                        <Typography level="body-md" sx={{ flex: 1 }}>
                          {item.name}
                        </Typography>
                        {isActive && <FaChevronRight size={12} />}
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            {/* Footer Info */}
            <Box sx={{ 
              p: 2, 
              mt: 'auto',
              borderTop: '1px solid',
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: supervisor ? 'rgba(0,99,43,0.2)' : 'rgba(24,94,165,0.2)'
            }}>
              <Stack spacing={1}>
                {user_data?.course && (
                  <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Course: {user_data.course}
                  </Typography>
                )}
                {user_data?.faculty && (
                  <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Faculty: {user_data.faculty}
                  </Typography>
                )}
                {role === 'student' && user_data?.supervisor_name && (
                  <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Supervisor: {user_data.supervisor_name}
                  </Typography>
                )}
                <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mt: 1 }}>
                  © 2024 Project Management
                </Typography>
              </Stack>
            </Box>
          </MotionStack>
        )}
      </AnimatePresence>
    </>
  )
}

export default SideBar