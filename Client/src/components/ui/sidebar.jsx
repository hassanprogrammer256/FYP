import { Stack, Box, Typography, Avatar, ListItemContent, IconButton, Chip } from '@mui/joy'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { API_BASE_URL } from '../../config'

const MotionStack = motion(Stack)

const SideBar = ({ navitems, bio, open, toggle, supervisor, role }) => {
  const location = useLocation()
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768

  // Get user initials
  const getInitials = () => {
    if (!bio) return 'U'
    const first = bio.first_name?.[0] || ''
    const last = bio.last_name?.[0] || ''
    return (first + last).toUpperCase() || bio.email?.[0]?.toUpperCase() || 'U'
  }

  // Get full name
  const getFullName = () => {
    if (!bio) return 'User'
    if (bio.first_name && bio.last_name) {
      return `${bio.first_name} ${bio.last_name}`
    }
    return bio.first_name || bio.email || 'User'
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
              src={`${API_BASE_URL}${bio?.image}`}
                size="lg"
                color={getAvatarColor()}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  fontSize: '2rem',
                  backgroundColor: supervisor ? '#1a8f3f' : '#185ea5'
                }}
               />

            </Box>

                <List>
              {navitems.map((e, index) => {
                const isActive = location.pathname === e.to
                return (
                  <ListItem key={index}>
                    <ListItemButton
                      component={Link}
                      to={e.to}
                      onClick={toggle}
                      sx={{
                        mb: 2,
                        borderRadius: 'md',
                        backgroundColor: 'inherit !important',
                        '&:hover': { backgroundColor: role === 'supervisor' ? '#00632b3f !important':'#185ea53f !important' },
                        ...(isActive && {
                          backgroundColor: role=== 'supervisor' ?'#1a8f3f !important': '#185ea5 !important',
                          '&:hover': { backgroundColor: role=== 'supervisor' ?'#1a8f3f !important' :'#185ea5 !important' },
                        }),
                      }}
                      selected={isActive}
                    >
                      <e.icon />
                      <Typography sx={{ color: 'white', fontSize: 14, ml: 1 }}>
                        {e.name}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            {/* Footer Info */}
              <Box sx={{ bgcolor: role === 'supervisor' ? '#00632b2e' : '#185ea53f', p: 3, borderRadius: 'md', mt: 'auto' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  alt={`${bio?.firstName?.[0] ?? ''}${bio?.last_name?.[0] ?? ''}`}
                  sx={{ width: 40, height: 40 }}
                >
                  {bio?.first_name?.[0]}{bio?.last_name?.[0]}
                </Avatar>
                <ListItemContent>
                  <Typography level="title-sm" sx={{ color: 'white' }}>
                    {bio?.first_name}
                  </Typography>
                  <Typography level="body-xs" noWrap sx={{ color: 'neutral.300' }}>
                    {bio?.email}
                  </Typography>
                </ListItemContent>
              </Stack>
            </Box>
          </MotionStack>
        )}
      </AnimatePresence>
    </>
  )
}

export default SideBar