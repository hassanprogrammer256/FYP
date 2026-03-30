import {
  Grid,
  Card,
  Typography,
  Button,
  Stack,
  Sheet,
  Box,
  CircularProgress,
  TabPanel,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/joy';

import CustomTabs from '../ui/tabs';
import { Link } from 'react-router-dom';
import CustomTabList from '../ui/tablist';
import CustomTab from '../ui/tab';

import {
  ProjectSchedules,
  StudentProjectActions,
  SupervisorActions,
  AdminProjectActions,
} from '../../config/config';

import EventCard from '../ui/eventCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../ui/loading';
import { fetchDashboardData, fetchFeedbacks, fetchStudentProjects, fetchSubmissions } from '../../features/studentSlice';
import { fetchPendingReviews, fetchSupervisorStudents } from '../../features/supervisorSlice';
import { fetchAllCourses, fetchAllFaculties, fetchAllStudents, fetchAllSupervisors } from '../../features/adminSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { role,isLoading: authLoading } = useSelector((state) => state.auth);

  const reg_no = localStorage.getItem('reg_no') || null;
  
  // Get role-specific data from store
  const studentState = useSelector((state) => state.student);
  const supervisorState = useSelector((state) => state.supervisor);
  const adminState = useSelector((state) => state.admin);

  console.log({role,studentState,supervisorState,adminState})
  
  // Determine which data to use based on role
  let bio = null;
  let projectReport = null;
  let projects = [];
  
  if (role === 'student') {
    bio = studentState.bio;
    projectReport = studentState?.projectReport || studentState.projectReport;
 projects = studentState.projects;
  } else if (role === 'supervisor') {
    bio = supervisorState.bio;
    projectReport = dashboardData?.projectReport || supervisorState.projectReport;
  } else if (role === 'admin') {
    projectReport = dashboardData?.projectReport || adminState.projectReport;
  }

  // ==================== STUDENT DASHBOARD DATA ====================
  const [studentOverviews, setStudentOverviews] = useState([
    { label: 'Project Title', value: 'Not Assigned', icon: '📋' },
    { label: 'Supervisor', value: 'Not Assigned', icon: '👨‍🏫' },
    { label: 'Progress', value: 0, unit: '%', icon: '📊' },
    { label: 'Current Status', value: 'Pending', icon: '⏳' },
  ]);

  const [studentProjectStats, setStudentProjectStats] = useState([
    { label: 'Chapters Completed', value: 0, total: 6, unit: 'chapters' },
    { label: 'Deadline Days Left', value: 0, unit: 'days', isWarning: false },
    { label: 'Supervisor Feedback', value: 0, unit: 'reviews' },
    { label: 'Draft Submissions', value: 0, total: 3, unit: 'submissions' },
  ]);

  const [studentMilestones, setStudentMilestones] = useState([
    { label: 'Proposal', status: 'pending', date: '' },
    { label: 'Literature Review', status: 'pending', date: '' },
    { label: 'Methodology', status: 'pending', date: '' },
    { label: 'Implementation', status: 'pending', date: '' },
    { label: 'Final Report', status: 'pending', date: '' },
  ]);

  // ==================== SUPERVISOR DASHBOARD DATA ====================
  const [supervisorOverviews, setSupervisorOverviews] = useState([
    { label: 'Supervised Students', value: 0, icon: '👥' },
    { label: 'Pending Reviews', value: 0, icon: '📝' },
    { label: 'Supervised Projects', value: 0, icon: '🎤' },
    { label: 'Avg. Project Progress', value: 0, unit: '%', icon: '📈' },
  ]);

  const [supervisorProjectStats, setSupervisorProjectStats] = useState([
    { label: 'Completed Projects', value: 0, total: 0 },
    { label: 'On-Track Projects', value: 0, total: 0 },
    { label: 'At-Risk Projects', value: 0, total: 0 },
    { label: 'Submitted Drafts', value: 0, total: 0 },
  ]);

  const [supervisorAnalysis, setSupervisorAnalysis] = useState([
    { label: 'Highest Score', value: 0, unit: '%' },
    { label: 'Lowest Score', value: 0, unit: '%' },
    { label: 'Avg. Submission Time', value: '0', unit: 'days early' },
    { label: 'Revision Requests', value: 0, unit: 'total' },
  ]);

  // ==================== ADMIN DASHBOARD DATA ====================
  const [adminOverviews, setAdminOverviews] = useState([
    { label: 'Total Projects', value: 0, icon: '📊', trend: '+0' },
    { label: 'Active Students', value: 0, icon: '👨‍🎓', trend: '+0' },
    { label: 'Supervisors', value: 0, icon: '👨‍🏫', trend: '0' },
    { label: 'Completed Projects', value: 0, icon: '✅', trend: '+0' },
  ]);

  const [adminProjectStats, setAdminProjectStats] = useState([
    { label: 'Projects by Department', departments: [] },
    { label: 'Submission Status', stats: { onTime: 0, late: 0, pending: 0 } },
    { label: 'Supervisor Load', avgStudents: 0, maxLoad: 10 },
    { label: 'Overall Success Rate', value: 0, unit: '%' },
  ]);

  const [recentProjects, setRecentProjects] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    if (reg_no) {
      dispatch(fetchDashboardData());
      
      // Fetch role-specific data
      if (role === 'student' && reg_no) {
        dispatch(fetchStudentProjects(reg_no));
        dispatch(fetchSubmissions(reg_no));
        dispatch(fetchFeedbacks(reg_no));
      } else if (role === 'supervisor' && reg_no) {
        dispatch(fetchSupervisorStudents(reg_no));
        dispatch(fetchPendingReviews(reg_no));
      } else if (role === 'admin') {
        dispatch(fetchAllStudents());
        dispatch(fetchAllSupervisors());
        dispatch(fetchAllCourses());
        dispatch(fetchAllFaculties());
      }
    }
  }, [dispatch, reg_no, role]);

  // Effect to map API data into display states
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (role === 'student' && projectReport) {
      // Update student overview
      setStudentOverviews((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Project Title':
              return { ...item, value: projectReport?.title || 'Not Assigned' };
            case 'Supervisor':
              return { ...item, value: projectReport?.supervisor_name || 'Not Assigned' };
            case 'Progress':
              return { ...item, value: projectReport?.completion_percentage || 0 };
            case 'Current Status':
              return { ...item, value: projectReport?.status || 'Pending' };
            default:
              return item;
          }
        })
      );
      
      const daysLeft = projectReport?.deadline_days_left || 0;
      // Update project stats
      setStudentProjectStats((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Chapters Completed':
              return { ...item, value: projectReport?.chapters_completed || 0, total: 6 };
            case 'Deadline Days Left':
              return { ...item, value: daysLeft, isWarning: daysLeft < 14 };
            case 'Supervisor Feedback':
              return { ...item, value: projectReport?.feedback_count || 0 };
            case 'Draft Submissions':
              return { ...item, value: projectReport?.draft_submissions || 0, total: 3 };
            default:
              return item;
          }
        })
      );

      // Update milestones
      if (projectReport?.milestones) {
        setStudentMilestones(projectReport.milestones);
      }
    } 
    else if (role === 'supervisor' && projectReport) {
      // Update supervisor overview
      setSupervisorOverviews((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Supervised Students':
              return { ...item, value: projectReport?.total_students || 0 };
            case 'Pending Reviews':
              return { ...item, value: projectReport?.pending_reviews || 0 };
            case 'Supervised Projects':
              return { ...item, value: projectReport?.completed || 0 };
            case 'Avg. Project Progress':
              return { ...item, value: projectReport?.avg_progress || 0 };
            default:
              return item;
          }
        })
      );

      // Update project stats
      setSupervisorProjectStats((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Completed Projects':
              return { ...item, value: projectReport?.completed || 0, total: projectReport?.total_students || 0 };
            case 'On-Track Projects':
              return { ...item, value: projectReport?.on_track || 0, total: projectReport?.total_students || 0 };
            case 'At-Risk Projects':
              return { ...item, value: projectReport?.at_risk || 0, total: projectReport?.total_students || 0 };
            case 'Submitted Drafts':
              return { ...item, value: projectReport?.submitted_drafts || 0, total: projectReport?.total_students || 0 };
            default:
              return item;
          }
        })
      );

      // Update analysis
      setSupervisorAnalysis((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Highest Score':
              return { ...item, value: projectReport?.highest_score || 0 };
            case 'Lowest Score':
              return { ...item, value: projectReport?.lowest_score || 0 };
            case 'Avg. Submission Time':
              return { ...item, value: projectReport?.avg_submission_time || '0' };
            case 'Revision Requests':
              return { ...item, value: projectReport?.revision_requests || 0 };
            default:
              return item;
          }
        })
      );

      setTopPerformers(projectReport?.top_performers || []);
    } 
    else if (role === 'admin' && projectReport) {
      // Update admin overview
      setAdminOverviews((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Total Projects':
              return { ...item, value: projectReport?.total_projects || 0 };
            case 'Active Students':
              return { ...item, value: projectReport?.active_students || 0 };
            case 'Supervisors':
              return { ...item, value: projectReport?.total_supervisors || 0 };
            case 'Completed Projects':
              return { ...item, value: projectReport?.completed_projects || 0 };
            default:
              return item;
          }
        })
      );

      setAdminProjectStats((prev) =>
        prev.map((item) => {
          switch (item.label) {
            case 'Projects by Department':
              return { ...item, departments: projectReport?.department_stats || [] };
            case 'Submission Status':
              return { ...item, stats: projectReport?.submission_stats || { onTime: 0, late: 0, pending: 0 } };
            case 'Supervisor Load':
              return { ...item, avgStudents: projectReport?.avg_students_per_supervisor || 0 };
            case 'Overall Success Rate':
              return { ...item, value: projectReport?.success_rate || 0 };
            default:
              return item;
          }
        })
      );

      setRecentProjects(projectReport?.recent_projects || []);
    }

    setIsLoading(false);
  }, [projectReport, role, authLoading]);

  if (isLoading || authLoading) {
    return <Loading />;
  }

  return (
    <Sheet sx={{ p: 2, bgcolor: 'background.level1', minHeight: '100vh' }}>
      {/* Overview Section */}
      {role === 'student' && <StudentOverview overviews={studentOverviews} />}
      {role === 'supervisor' && <SupervisorOverview overviews={supervisorOverviews} />}
      {role === 'admin' && <AdminOverview overviews={adminOverviews} />}

      {/* Main Layout */}
      <Grid container spacing={2}>
        <Grid xs={12} md={7}>
          <ProjectSchedule />
        </Grid>
        <Grid xs={12} md={5}>
          <QuickActions 
            actions={
              role === 'student' ? StudentProjectActions : 
              role === 'supervisor' ? SupervisorActions : 
              AdminProjectActions
            } 
          />
        </Grid>
      </Grid>

      {/* Stats and Analytics Section */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid xs={12} md={7}>
          {role === 'student' && <ProjectMilestones milestones={studentMilestones} />}
          {role === 'supervisor' && <StudentProjectList projects={topPerformers} />}
          {role === 'admin' && <RecentProjectsList projects={recentProjects} />}
        </Grid>
        <Grid xs={12} md={5}>
          {role === 'student' && <ProjectStats stats={studentProjectStats} />}
          {role === 'supervisor' && <ProjectAnalysis analysis={supervisorAnalysis} stats={supervisorProjectStats} />}
          {role === 'admin' && <AdminStats stats={adminProjectStats} />}
        </Grid>
      </Grid>
    </Sheet>
  );
};

export default Dashboard;

// ==================== STUDENT COMPONENTS ====================
const StudentOverview = ({ overviews }) => {
  const getStatusColor = (status) => {
    switch(String(status).toLowerCase()) {
      case 'completed': return 'success';
      case 'approved': return 'success';
      case 'in progress': return 'warning';
      case 'pending': return 'neutral';
      default: return 'primary';
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {overviews?.map(({ label, value, unit, icon }, index) => (
        <Grid xs={6} sm={6} md={3} key={index}>
          <Card variant="soft" sx={{ bgcolor: 'background.body', height: '140px' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontSize="2rem">{icon}</Typography>
              <div style={{ width: '100%' }}>
                {label === 'Progress' ? (
                  <Box sx={{ width: '100%' }}>
                    <Typography level="h4" sx={{ mb: 1 }}>
                      {value}{unit}
                    </Typography>
                    <LinearProgress 
                      determinate 
                      value={value} 
                      sx={{ borderRadius: 'md' }}
                      color={value >= 70 ? 'success' : value >= 40 ? 'warning' : 'danger'}
                    />
                  </Box>
                ) : label === 'Current Status' ? (
                  <Chip color={getStatusColor(value)} size="sm">
                    {value}
                  </Chip>
                ) : (
                  <Typography level="h4" noWrap>{value}</Typography>
                )}
                <Typography level="body-sm">{label}</Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const ProjectStats = ({ stats }) => {
  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          bgcolor: 'primary.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Project Progress
      </Typography>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} key={index}>
            <Card variant="soft" size="sm">
              <Typography level="h3">
                {stat.value} {stat.total ? `/ ${stat.total}` : ''}
              </Typography>
              <Typography level="body-sm">
                {stat.label}
                {stat.isWarning && (
                  <Chip size="sm" color="danger" sx={{ ml: 1 }}>Urgent</Chip>
                )}
              </Typography>
              {stat.total && (
                <LinearProgress 
                  determinate 
                  value={(stat.value / stat.total) * 100} 
                  sx={{ mt: 1 }}
                />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ProjectMilestones = ({ milestones }) => {
  const getStatusIcon = (status) => {
    switch(String(status).toLowerCase()) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'in progress': return '🔄';
      case 'pending': return '⏳';
      default: return '❌';
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          bgcolor: 'primary.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Project Milestones
      </Typography>
      <Stack spacing={1} sx={{ p: 2 }}>
        {milestones?.map((milestone, idx) => (
          <Card key={idx} variant="soft" size="sm">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography fontSize="1.5rem">{getStatusIcon(milestone.status)}</Typography>
                <Typography level="body-md">{milestone.label}</Typography>
              </Stack>
              {milestone.date && (
                <Chip size="sm" variant="soft">{milestone.date}</Chip>
              )}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

// ==================== SUPERVISOR COMPONENTS ====================
const SupervisorOverview = ({ overviews }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {overviews?.map(({ label, value, unit, icon }, index) => (
        <Grid xs={6} sm={6} md={3} key={index}>
          <Card variant="soft" sx={{ bgcolor: 'background.body', height: '120px' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontSize="2rem">{icon}</Typography>
              <div>
                <Typography level="h4">
                  {label === 'Avg. Project Progress' ? `${value}${unit}` : value}
                </Typography>
                <Typography level="body-sm">{label}</Typography>
              </div>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const ProjectAnalysis = ({ analysis, stats }) => {
  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          bgcolor: 'success.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Project Analytics
      </Typography>
      
      {/* Stats Overview */}
      <Grid container spacing={1} sx={{ p: 2 }}>
        {stats?.map((stat, index) => (
          <Grid xs={6} key={index}>
            <Card variant="soft" size="sm">
              <Typography level="h4">{stat.value}/{stat.total}</Typography>
              <Typography level="body-sm">{stat.label}</Typography>
              <LinearProgress 
                determinate 
                value={stat.total ? (stat.value / stat.total) * 100 : 0} 
                sx={{ mt: 1 }}
                color={
                  stat.label === 'At-Risk Projects' ? 'danger' :
                  stat.label === 'Completed Projects' ? 'success' : 'primary'
                }
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider />
      
      {/* Analysis Section */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        {analysis?.map((item, index) => (
          <Grid xs={6} key={index}>
            <Card variant="outlined" size="sm">
              <Typography level="h4">{item.value}{item.unit}</Typography>
              <Typography level="body-sm">{item.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const StudentProjectList = ({ projects }) => {
  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          bgcolor: 'success.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Top Performing Students
      </Typography>
      <Stack spacing={1} sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
        {projects?.length > 0 ? projects.map((student, idx) => (
          <Card key={idx} variant="soft" size="sm">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar size="sm">{student.name?.charAt(0) || 'S'}</Avatar>
                <Box>
                  <Typography level="body-md">{student.name}</Typography>
                  <Typography level="body-xs">{student.project_title}</Typography>
                </Box>
              </Stack>
              <Chip color="success">{student.progress}%</Chip>
            </Stack>
          </Card>
        )) : (
          <Typography level="body-sm" textAlign="center" sx={{ py: 3 }}>
            No students assigned yet
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

// ==================== ADMIN COMPONENTS ====================
const AdminOverview = ({ overviews }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {overviews?.map(({ label, value, icon, trend }, index) => (
        <Grid xs={6} sm={6} md={3} key={index}>
          <Card variant="soft" sx={{ bgcolor: 'background.body' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography fontSize="2rem">{icon}</Typography>
                <div>
                  <Typography level="h4">{value}</Typography>
                  <Typography level="body-sm">{label}</Typography>
                </div>
              </Stack>
              <Chip size="sm" color="success">{trend}</Chip>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const AdminStats = ({ stats }) => {
  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          bgcolor: 'neutral.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        System Overview
      </Typography>
      
      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Department Stats */}
        {stats[0]?.departments?.length > 0 && (
          <Card variant="soft">
            <Typography level="title-md">Projects by Department</Typography>
            {stats[0].departments.map((dept, idx) => (
              <Stack key={idx} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography level="body-sm">{dept.name}</Typography>
                <Typography level="body-sm">{dept.count} projects</Typography>
              </Stack>
            ))}
          </Card>
        )}

        {/* Submission Stats */}
        <Card variant="soft">
          <Typography level="title-md">Submission Status</Typography>
          <Stack direction="row" justifyContent="space-around" sx={{ mt: 1 }}>
            <Box textAlign="center">
              <Typography level="h4">{stats[1]?.stats?.onTime || 0}</Typography>
              <Typography level="body-xs">On Time</Typography>
            </Box>
            <Box textAlign="center">
              <Typography level="h4" color="warning">{stats[1]?.stats?.late || 0}</Typography>
              <Typography level="body-xs">Late</Typography>
            </Box>
            <Box textAlign="center">
              <Typography level="h4" color="neutral">{stats[1]?.stats?.pending || 0}</Typography>
              <Typography level="body-xs">Pending</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Supervisor Load */}
        <Card variant="soft">
          <Typography level="title-md">Supervisor Load</Typography>
          <Typography level="h4">{stats[2]?.avgStudents || 0} / {stats[2]?.maxLoad || 10}</Typography>
          <Typography level="body-xs">Average students per supervisor</Typography>
          <LinearProgress 
            determinate 
            value={((stats[2]?.avgStudents || 0) / (stats[2]?.maxLoad || 10)) * 100}
            sx={{ mt: 1 }}
          />
        </Card>

        {/* Success Rate */}
        <Card variant="soft" sx={{ textAlign: 'center' }}>
          <Typography level="title-md">Overall Success Rate</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress 
              size="lg" 
              determinate 
              value={stats[3]?.value || 0}
              sx={{ '--CircularProgress-size': '100px' }}
            >
              <Typography level="h3">{stats[3]?.value || 0}%</Typography>
            </CircularProgress>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};

const RecentProjectsList = ({ projects }) => {
  const getStatusColor = (status) => {
    switch(String(status).toLowerCase()) {
      case 'submitted': return 'warning';
      case 'completed': return 'success';
      case 'approved': return 'success';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          borderBottom: '1px solid',
          bgcolor: 'neutral.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Recent Project Submissions
      </Typography>
      <Stack spacing={1} sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
        {projects?.length > 0 ? projects.map((project, idx) => (
          <Card key={idx} variant="soft" size="sm">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-md">{project.title}</Typography>
                <Typography level="body-xs">{project.student_name} • {project.department}</Typography>
              </Box>
              <Chip color={getStatusColor(project.status)} size="sm">
                {project.status}
              </Chip>
            </Stack>
          </Card>
        )) : (
          <Typography level="body-sm" textAlign="center" sx={{ py: 3 }}>
            No recent submissions
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

// ==================== SHARED COMPONENTS ====================
const QuickActions = ({ actions }) => {
  const { role } = useSelector((state) => state.auth);
  const getColor = () => {
    if (role === 'student') return 'primary';
    if (role === 'supervisor') return 'success';
    return 'neutral';
  };

  return (
    <Box sx={{ bgcolor: 'background.body', borderRadius: 'sm' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          m: 0,
          borderBottom: '1px solid',
          bgcolor: role === 'student' ? 'primary.500' : role === 'supervisor' ? 'success.500' : 'neutral.500',
          color: 'common.white',
          borderTopLeftRadius: 'sm',
          borderTopRightRadius: 'sm',
        }}
      >
        Quick Actions
      </Typography>
      <Grid container>
        {actions?.map((e, index) => (
          <Grid
            key={e.label}
            xs={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: index % 2 === 0 ? '1px solid' : 'none',
              borderBottom: index < 2 ? '1px solid' : 'none',
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Stack alignItems="center" spacing={1}>
              <e.icon fontSize="large" />
              <Link to={e.to} style={{ textDecoration: 'none' }}>
                <Button
                  variant="soft"
                  size="md"
                  color={getColor()}
                  sx={{ fontSize: 13, borderRadius: 'lg' }}
                >
                  {e.label}
                </Button>
              </Link>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ProjectSchedule = () => {
  return (
    <Card variant="plain">
      <CustomTabs defaultValue={0}>
        <CustomTabList
          sx={{
            overflow: 'auto',
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <CustomTab sx={{ flexGrow: 1, flexShrink: 0, fontSize: 14, scrollSnapAlign: 'start' }}>
            Upcoming Deadlines
          </CustomTab>
          <CustomTab sx={{ flexGrow: 1, flexShrink: 0, fontSize: 14, scrollSnapAlign: 'start' }}>
            Open Tasks
          </CustomTab>
          <CustomTab sx={{ flexGrow: 1, flexShrink: 0, fontSize: 14, scrollSnapAlign: 'start' }}>
            Completed
          </CustomTab>
        </CustomTabList>

        <HorizontalScrollTabPanel value={0}>
          {ProjectSchedules
            .filter((program) => program.status === 'upcoming')
            .map((program, index) => (
              <EventCard
                key={program.id}
                title={program.title}
                dueDate={program.dueDate}
                startDate={program.startDate}
                status={program.status}
                sx={{
                  display: 'inline-block',
                  marginRight: index === ProjectSchedules.length - 1 ? 0 : 1,
                }}
              />
            ))}
        </HorizontalScrollTabPanel>

        <HorizontalScrollTabPanel value={1}>
          {ProjectSchedules
            .filter((program) => program.status === 'open')
            .map((program, index) => (
              <EventCard
                key={program.id}
                title={program.title}
                dueDate={program.dueDate}
                status={program.status}
                sx={{
                  display: 'inline-block',
                  marginRight: index === ProjectSchedules.length - 1 ? 0 : 1,
                }}
              />
            ))}
        </HorizontalScrollTabPanel>

        <HorizontalScrollTabPanel value={2}>
          {ProjectSchedules
            .filter((program) => program.status === 'closed')
            .map((program, index) => (
              <EventCard
                key={program.id}
                title={program.title}
                on={program.on}
                status={program.status}
                sx={{
                  display: 'inline-block',
                  marginRight: index === ProjectSchedules.length - 1 ? 0 : 1,
                }}
              />
            ))}
        </HorizontalScrollTabPanel>
      </CustomTabs>
    </Card>
  );
};

const HorizontalScrollTabPanel = (props) => {
  const { sx = [], children } = props;
  return (
    <TabPanel
      {...props}
      sx={[
        {
          width: 1,
          overflowY: 'hidden',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </TabPanel>
  );
};