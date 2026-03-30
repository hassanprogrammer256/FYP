import { AspectRatio, Card, Typography, Button, CardContent, Box, Grid, Stack } from '@mui/joy';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../ui/loading';
import { Input } from '../ui/input';
import { useToast } from '../ui/toast-context';
import { updateStudentProfile } from '../../features/studentSlice';
import { updateSupervisorProfile } from '../../features/supervisorSlice';


export default function Profile() {
  const { role, user } = useSelector((state) => state.auth);
  
  // Get role-specific data from Redux store
  const studentState = useSelector((state) => state.student);
  const supervisorState = useSelector((state) => state.supervisor);
  
  // Determine which data to use based on role
  let bio = null;
  let isLoading = false;
  
  if (role === 'student') {
    bio = studentState.bio;
    isLoading = studentState.isLoading;
  } else if (role === 'supervisor') {
    bio = supervisorState.bio;
    isLoading = supervisorState.isLoading;
  }
  
  const [profileData, setProfileData] = useState([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  // Refs for inputs
  const inputRefs = useRef([]);

  // Update profileData when bio changes
  useEffect(() => {
    if (role === "student" && bio) {
      setProfileData([
        { label: 'Registration Number', editable: false, value: bio?.reg_no || 'N/A' },
        { label: 'First Name', editable: false, value: bio?.first_name || 'N/A' },
        { label: 'Last Name', editable: false, value: bio?.last_name || 'N/A' },
        { label: 'Gender', editable: false, value: bio?.gender || 'N/A' },
        { label: 'Faculty', editable: false, value: bio?.faculty_name || bio?.faculty?.name || 'N/A' },
        { label: 'Course', editable: false, value: bio?.course_name || bio?.course?.name || 'N/A' },
        { label: 'Supervisor', editable: false, value: bio?.supervisor_name || 'Not Assigned' },
        { label: 'Academic Year', editable: false, value: bio?.academic_year || 'N/A' },
        { label: 'Phone Number', editable: true, type: 'tel', value: bio?.phone_number || '' },
        { label: 'Email', editable: true, type: 'email', value: bio?.email || '' },
      ]);
    } 
    else if (role === "supervisor" && bio) {
      setProfileData([
        { label: 'Registration Number', editable: false, value: bio?.reg_no || 'N/A' },
        { label: 'First Name', editable: false, value: bio?.first_name || 'N/A' },
        { label: 'Last Name', editable: false, value: bio?.last_name || 'N/A' },
        { label: 'Gender', editable: false, value: bio?.gender || 'N/A' },
        { label: 'Faculty', editable: false, value: bio?.faculty_name || bio?.faculty?.name || 'N/A' },
        { label: 'Course', editable: false, value: bio?.course_name || bio?.course?.name || 'N/A' },
        { label: 'Phone Number', editable: true, type: 'tel', value: bio?.phone_number || '' },
        { label: 'Email', editable: true, type: 'email', value: bio?.email || '' },
      ]);
    }
  }, [bio, role]);

  const handleToggleEdit = () => {
    setEditEnabled(prev => !prev);
  };

  const handleInputChange = (label, newValue) => {
    setProfileData(prevData =>
      prevData.map(item =>
        item.label === label ? { ...item, value: newValue } : item
      )
    );
  };

  const handleSubmit = async () => {
    // Prepare data to send - only include editable fields
    const dataToSend = {};
    profileData.forEach(item => {
      if (item.editable) {
        const key = item.label.toLowerCase().replace(/ /g, '_');
        dataToSend[key] = item.value;
      }
    });

    // Add registration number for identification
    if (role === 'student' && bio?.reg_no) {
      dataToSend.reg_no = bio.reg_no;
    } else if (role === 'supervisor' && bio?.reg_no) {
      dataToSend.reg_no = bio.reg_no;
    }

    setUpdating(true);
    
    try {
      let response;
      if (role === 'student') {
        response = await dispatch(updateStudentProfile(dataToSend)).unwrap();
      } else if (role === 'supervisor') {
        response = await dispatch(updateSupervisorProfile(dataToSend)).unwrap();
      }
      
      if (response?.success) {
        addToast({ 
          message: response.message || "Profile Updated Successfully", 
          variant: 'success' 
        });
        setEditEnabled(false);
      } else {
        addToast({ 
          message: response?.error || 'Updating Profile failed', 
          variant: 'destructive' 
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      addToast({ 
        message: err?.message || 'Error updating profile', 
        variant: 'destructive' 
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (role === "student" && bio) {
      setProfileData(prevData =>
        prevData.map(item => {
          if (item.editable) {
            const key = item.label.toLowerCase().replace(/ /g, '_');
            return { ...item, value: bio[key] || '' };
          }
          return item;
        })
      );
    } else if (role === "supervisor" && bio) {
      setProfileData(prevData =>
        prevData.map(item => {
          if (item.editable) {
            const key = item.label.toLowerCase().replace(/ /g, '_');
            return { ...item, value: bio[key] || '' };
          }
          return item;
        })
      );
    }
    setEditEnabled(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  // Get avatar image URL
  const getAvatarUrl = () => {
    if (role === 'student' && bio?.id) {
      return `https://i.pravatar.cc/150?img=${bio.id}`;
    } else if (role === 'supervisor' && bio?.id) {
      return `https://i.pravatar.cc/150?img=${bio.id + 50}`;
    } else if (user?.id) {
      return `https://i.pravatar.cc/150?img=${user.id}`;
    }
    return 'https://i.pravatar.cc/150?img=1';
  };

  // Get profile title based on role
  const getProfileTitle = () => {
    if (role === 'student') return 'Student Profile';
    if (role === 'supervisor') return 'Supervisor Profile';
    return 'User Profile';
  };

  // Get theme color based on role
  const getThemeColor = () => {
    if (role === 'student') return 'primary';
    if (role === 'supervisor') return 'success';
    return 'neutral';
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
      <Card 
        orientation="horizontal" 
        sx={{ 
          width: '100%', 
          minHeight: '80vh', 
          flexWrap: 'wrap', 
          display: 'flex',
          flexDirection: { md: 'row', xs: 'column' },
          gap: 2,
          p: 3
        }}
      >
        {/* Profile Image Section */}
        <AspectRatio
          ratio="1"
          maxHeight={200}
          sx={{
            minWidth: 180,
            maxWidth: 250,
            flexShrink: 0,
            borderRadius: '12px',
            overflow: 'hidden',
            alignSelf: 'center',
            boxShadow: 'lg'
          }}
        >
          <img
            src={getAvatarUrl()}
            alt={`${bio?.first_name || 'User'} Profile`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AspectRatio>

        {/* Profile Info Section */}
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          flex: 1, 
          minWidth: 280,
          gap: 2
        }}>
          <Box sx={{ 
            bgcolor: 'background.body', 
            borderRadius: 'sm', 
            overflow: 'hidden',
            boxShadow: 'sm'
          }}>
            <Typography 
              level="h2" 
              sx={{ 
                fontSize: 16, 
                p: 2, 
                m: 0, 
                borderBottom: '1px solid',
                bgcolor: `${getThemeColor()}.500`,
                color: 'common.white',
                fontWeight: 600
              }}
            >
              {getProfileTitle()}
            </Typography>
            
            <Grid container spacing={0} sx={{ overflow: 'hidden' }}>
              {profileData.map((item, index) => (
                <Grid
                  key={index}
                  xs={12}
                  sm={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    borderRight: { sm: index % 2 === 0 ? '1px solid' : 'none' },
                    borderBottom: index < profileData.length - 2 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    p: 2,
                    wordBreak: 'break-word',
                    backgroundColor: editEnabled && item.editable ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
                  }}
                >
                  <Stack 
                    direction="column" 
                    spacing={1} 
                    sx={{ 
                      width: '100%',
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    <Typography 
                      level="body-sm" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {item.label}
                    </Typography>
                    
                    {item.editable ? (
                      <Input
                        type={item.type}
                        disabled={!editEnabled}
                        value={item.value || ''}
                        onChange={(ev) => handleInputChange(item.label, ev.target.value)}
                        size="md"
                        sx={{
                          width: '100%',
                          '& input': {
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '0.9rem'
                          },
                          border: editEnabled && item.editable 
                            ? `2px solid ${getThemeColor() === 'primary' ? '#1976d2' : '#43a047'}` 
                            : '1px solid transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: editEnabled ? `${getThemeColor() === 'primary' ? '#1976d2' : '#43a047'}` : 'transparent'
                          }
                        }}
                        ref={(el) => (inputRefs.current[index] = el)}
                      />
                    ) : (
                      <Typography 
                        level="body-md" 
                        sx={{ 
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          width: '100%',
                          display: 'inline-block',
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      >
                        {item.value || 'Not Specified'}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              justifyContent: 'center',
              pt: 2,
              gap: 2
            }}
          >
            {!editEnabled ? (
              <Button 
                variant="solid" 
                color={getThemeColor()} 
                onClick={handleToggleEdit}
                sx={{ 
                  minWidth: 150,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  color="neutral" 
                  onClick={handleCancel}
                  disabled={updating}
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="solid" 
                  color={getThemeColor()} 
                  onClick={handleSubmit}
                  loading={updating}
                  sx={{ 
                    minWidth: 150,
                    fontWeight: 600
                  }}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}