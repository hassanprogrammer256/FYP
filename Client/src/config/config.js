// config/index.js

import {
  FiBookOpen,
  FiUsers,
  FiUserCheck,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiMessageSquare,
  FiUpload,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSettings,
  FiBarChart2,
  FiMail,
  FiBell,
  FiSearch,
  FiFilter,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiBriefcase,
  FiFolder,
  FiHome,
  FiUserPlus,
  FiLogOut,
} from 'react-icons/fi';

// ==================== PROJECT SCHEDULES ====================
export const ProjectSchedules = [
  {
    id: 1,
    title: "Project Proposal Submission",
    description: "Submit your final year project proposal for approval",
    dueDate: "2024-04-15",
    startDate: "2024-03-01",
    status: "upcoming",
    priority: "high",
    type: "submission",
    department: "All",
  },
  {
    id: 2,
    title: "Literature Review Draft",
    description: "Submit first draft of literature review chapter",
    dueDate: "2024-04-20",
    startDate: "2024-03-15",
    status: "upcoming",
    priority: "high",
    type: "submission",
    department: "All",
  },
  {
    id: 3,
    title: "Methodology Chapter",
    description: "Complete methodology section with research design",
    dueDate: "2024-04-25",
    startDate: "2024-03-20",
    status: "open",
    priority: "medium",
    type: "submission",
    department: "All",
  },
  {
    id: 4,
    title: "Mid-term Progress Review",
    description: "Present project progress to supervisor and panel",
    dueDate: "2024-05-05",
    startDate: "2024-04-25",
    status: "open",
    priority: "high",
    type: "presentation",
    department: "All",
  },
  {
    id: 5,
    title: "Implementation & Testing",
    description: "Complete system implementation and testing phase",
    dueDate: "2024-05-20",
    startDate: "2024-04-01",
    status: "open",
    priority: "medium",
    type: "development",
    department: "CS/IT/SE",
  },
  {
    id: 6,
    title: "First Draft Submission",
    description: "Submit complete first draft of final report",
    dueDate: "2024-06-01",
    startDate: "2024-05-10",
    status: "upcoming",
    priority: "high",
    type: "submission",
    department: "All",
  },
  {
    id: 7,
    title: "Supervisor Feedback Review",
    description: "Review and incorporate supervisor feedback",
    dueDate: "2024-06-10",
    startDate: "2024-06-01",
    status: "upcoming",
    priority: "medium",
    type: "revision",
    department: "All",
  },
  {
    id: 8,
    title: "Final Report Submission",
    description: "Submit final version of project report",
    dueDate: "2024-06-20",
    startDate: "2024-06-01",
    status: "upcoming",
    priority: "critical",
    type: "submission",
    department: "All",
  },
  {
    id: 9,
    title: "Project Presentation Preparation",
    description: "Prepare final presentation slides and demo",
    dueDate: "2024-06-25",
    startDate: "2024-06-15",
    status: "upcoming",
    priority: "high",
    type: "presentation",
    department: "All",
  },
  {
    id: 10,
    title: "Final Defense & Viva",
    description: "Present project to examination panel",
    dueDate: "2024-06-30",
    startDate: "2024-06-25",
    status: "upcoming",
    priority: "critical",
    type: "defense",
    department: "All",
  },
  {
    id: 11,
    title: "Project Exhibition",
    description: "Showcase project at university exhibition",
    dueDate: "2024-07-05",
    startDate: "2024-07-01",
    status: "upcoming",
    priority: "medium",
    type: "exhibition",
    department: "All",
  },
  {
    id: 12,
    title: "Final Documentation Submission",
    description: "Submit all final documents and deliverables",
    dueDate: "2024-07-10",
    startDate: "2024-07-01",
    status: "upcoming",
    priority: "critical",
    type: "submission",
    department: "All",
  },
];

// ==================== STUDENT PROJECT ACTIONS ====================
export const StudentProjectActions = [
  {
    label: "Upload Activity",
    to: "/student/upload-draft",
    icon: FiUpload,
    description: "Upload project draft chapters",
    color: "primary",
    requiredStatus: "in_progress",
  },
  {
    label: "View Feedback",
    to: "/student/feedback",
    icon: FiMessageSquare,
    description: "Check supervisor feedback",
    color: "info",
    requiredStatus: "any",
  },
  {
    label: "Check Progress",
    to: "/student/progress",
    icon: FiBarChart2,
    description: "View project progress",
    color: "success",
    requiredStatus: "any",
  },
  {
    label: "Submit Final Report",
    to: "/student/submit-final",
    icon: FiCheckCircle,
    description: "Submit final project report",
    color: "success",
    requiredStatus: "final_ready",
  }
];

// ==================== SUPERVISOR ACTIONS ====================
export const SupervisorActions = [
  {
    label: "Review Activities",
    to: "/supervisor/review-proposals",
    icon: FiFileText,
    description: "Review student project activities",
    color: "primary",
    count: 3,
  },
  {
    label: "Grade Submissions",
    to: "/supervisor/grade",
    icon: FiStar,
    description: "Grade submitted work",
    color: "warning",
    count: 5,
  },
  {
    label: "Provide Feedback",
    to: "/supervisor/feedback",
    icon: FiMessageSquare,
    description: "Give feedback to students",
    color: "info",
    count: 8,
  },

  {
    label: "Generate Reports",
    to: "/supervisor/reports",
    icon: FiDownload,
    description: "Generate progress reports",
    color: "success",
  }
];

// ==================== ADMIN PROJECT ACTIONS ====================
export const AdminProjectActions = [
  {
    label: "Add Project",
    to: "/admin/add-project",
    icon: FiPlus,
    description: "Create new project",
    color: "primary",
  },
  {
    label: "Assign Supervisors",
    to: "/admin/assign-supervisors",
    icon: FiUserPlus,
    description: "Assign supervisors to students",
    color: "success",
    count: 12,
  },
  {
    label: "Manage Deadlines",
    to: "/admin/manage-deadlines",
    icon: FiCalendar,
    description: "Set project deadlines",
    color: "warning",
  },
  {
    label: "View Analytics",
    to: "/admin/analytics",
    icon: FiBarChart2,
    description: "System-wide analytics",
    color: "info",
  },
  {
    label: "Generate Reports",
    to: "/admin/reports",
    icon: FiFileText,
    description: "Generate system reports",
    color: "primary",
  },
  {
    label: "Manage Users",
    to: "/admin/manage-users",
    icon: FiUsers,
    description: "Manage all users",
    color: "danger",
  },
  {
    label: "Export Data",
    to: "/admin/export",
    icon: FiDownload,
    description: "Export project data",
    color: "success",
  },
  {
    label: "System Settings",
    to: "/admin/settings",
    icon: FiSettings,
    description: "Configure system",
    color: "neutral",
  },
];

// ==================== ADDITIONAL CONFIGURATIONS ====================

// Project Status Types
export const ProjectStatusTypes = {
  PROPOSAL_PENDING: "proposal_pending",
  PROPOSAL_APPROVED: "proposal_approved",
  IN_PROGRESS: "in_progress",
  UNDER_REVIEW: "under_review",
  REVISION_REQUIRED: "revision_required",
  COMPLETED: "completed",
  APPROVED: "approved",
  REJECTED: "rejected",
  ON_HOLD: "on_hold",
  DEFENSE_SCHEDULED: "defense_scheduled",
  DEFENSE_COMPLETED: "defense_completed",
};

// Project Categories
export const ProjectCategories = [
  { id: "web_app", label: "Web Application", icon: FiFolder },
  { id: "mobile_app", label: "Mobile Application", icon: FiFolder },
  { id: "ai_ml", label: "AI/Machine Learning", icon: FiTrendingUp },
  { id: "data_science", label: "Data Science", icon: FiBarChart2 },
  { id: "iot", label: "IoT", icon: FiTarget },
  { id: "cybersecurity", label: "Cybersecurity", icon: FiAlertCircle },
  { id: "game_dev", label: "Game Development", icon: FiStar },
  { id: "research", label: "Research", icon: FiBookOpen },
];

// Departments
export const Departments = [
  { id: "cs", name: "Computer Science", code: "CS" },
  { id: "it", name: "Information Technology", code: "IT" },
  { id: "se", name: "Software Engineering", code: "SE" },
  { id: "ds", name: "Data Science", code: "DS" },
  { id: "ai", name: "Artificial Intelligence", code: "AI" },
];

// Evaluation Criteria
export const EvaluationCriteria = [
  { id: "proposal", label: "Proposal Quality", weight: 10 },
  { id: "literature", label: "Literature Review", weight: 15 },
  { id: "methodology", label: "Methodology", weight: 15 },
  { id: "implementation", label: "Implementation", weight: 25 },
  { id: "testing", label: "Testing & Validation", weight: 10 },
  { id: "documentation", label: "Documentation", weight: 15 },
  { id: "presentation", label: "Presentation", weight: 10 },
];

// Notification Types
export const NotificationTypes = {
  SUBMISSION: "submission",
  FEEDBACK: "feedback",
  DEADLINE: "deadline",
  MEETING: "meeting",
  GRADE: "grade",
  APPROVAL: "approval",
  REMINDER: "reminder",
  ALERT: "alert",
};

// Sample Dashboard Stats
export const DashboardStats = {
  student: {
    totalProjects: 1,
    completedChapters: 3,
    pendingReviews: 2,
    upcomingDeadlines: 4,
    averageScore: 78.5,
  },
  supervisor: {
    totalStudents: 12,
    pendingReviews: 8,
    completedProjects: 4,
    upcomingDefenses: 3,
    averageProgress: 65,
  },
  admin: {
    totalProjects: 156,
    activeStudents: 342,
    totalSupervisors: 28,
    completionRate: 67,
    departments: 5,
  },
};

// Helper Functions
export const getStatusColor = (status) => {
  const colors = {
    proposal_pending: "warning",
    proposal_approved: "success",
    in_progress: "primary",
    under_review: "info",
    revision_required: "danger",
    completed: "success",
    approved: "success",
    rejected: "danger",
    on_hold: "neutral",
    defense_scheduled: "warning",
    defense_completed: "success",
  };
  return colors[status] || "neutral";
};

export const getStatusLabel = (status) => {
  const labels = {
    proposal_pending: "Proposal Pending",
    proposal_approved: "Proposal Approved",
    in_progress: "In Progress",
    under_review: "Under Review",
    revision_required: "Revision Required",
    completed: "Completed",
    approved: "Approved",
    rejected: "Rejected",
    on_hold: "On Hold",
    defense_scheduled: "Defense Scheduled",
    defense_completed: "Defense Completed",
  };
  return labels[status] || status;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isDeadlineNear = (dueDate, daysThreshold = 7) => {
  const daysRemaining = getDaysRemaining(dueDate);
  return daysRemaining <= daysThreshold && daysRemaining > 0;
};

export const isDeadlinePassed = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

// Route Paths
export const Routes = {
  // Student Routes
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_SUBMIT_PROPOSAL: "/student/submit-proposal",
  STUDENT_UPLOAD_DRAFT: "/student/upload-draft",
  STUDENT_FEEDBACK: "/student/feedback",
  STUDENT_PROGRESS: "/student/progress",
  STUDENT_SCHEDULE_MEETING: "/student/schedule-meeting",
  STUDENT_SUBMIT_FINAL: "/student/submit-final",
  STUDENT_RESULTS: "/student/results",
  
  // Supervisor Routes
  SUPERVISOR_DASHBOARD: "/supervisor/dashboard",
  SUPERVISOR_REVIEW_PROPOSALS: "/supervisor/review-proposals",
  SUPERVISOR_GRADE: "/supervisor/grade",
  SUPERVISOR_FEEDBACK: "/supervisor/feedback",
  SUPERVISOR_SCHEDULE_DEFENSE: "/supervisor/schedule-defense",
  SUPERVISOR_ANALYTICS: "/supervisor/analytics",
  SUPERVISOR_MANAGE_STUDENTS: "/supervisor/manage-students",
  
  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ADD_PROJECT: "/admin/add-project",
  ADMIN_ASSIGN_SUPERVISORS: "/admin/assign-supervisors",
  ADMIN_MANAGE_DEADLINES: "/admin/manage-deadlines",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_MANAGE_USERS: "/admin/manage-users",
  ADMIN_SETTINGS: "/admin/settings",
  
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

// API Endpoints (if using API)
export const APIEndpoints = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  
  // Student
  GET_STUDENT_PROJECT: "/api/student/project",
  SUBMIT_PROPOSAL: "/api/student/submit-proposal",
  UPLOAD_DRAFT: "/api/student/upload-draft",
  GET_FEEDBACK: "/api/student/feedback",
  GET_PROGRESS: "/api/student/progress",
  
  // Supervisor
  GET_SUPERVISOR_STUDENTS: "/api/supervisor/students",
  REVIEW_PROPOSAL: "/api/supervisor/review-proposal",
  SUBMIT_GRADE: "/api/supervisor/submit-grade",
  SEND_FEEDBACK: "/api/supervisor/send-feedback",
  
  // Admin
  GET_ALL_PROJECTS: "/api/admin/projects",
  ASSIGN_SUPERVISOR: "/api/admin/assign-supervisor",
  UPDATE_DEADLINES: "/api/admin/update-deadlines",
  GET_SYSTEM_STATS: "/api/admin/stats",
};