import {FaChalkboardTeacher,FaClipboardList,FaUser, FaSignInAlt, FaBookOpen, FaCommentAlt, FaChartBar } from 'react-icons/fa';
import { Upload } from '@mui/icons-material';
import { LayoutDashboard } from 'lucide-react';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const generateDescendingNumbers = async (length,start = Math.floor(Math.random() * 101),min = Math.floor(Math.random() * 50)) => {

  const numbers = [start];
  const usedNumbers = new Set([start]);

  for (let i = 1; i < length; i++) {
    const prev = numbers[i - 1];

    const candidates = [];
    for (let num = prev - 1; num >= min; num--) {
      if (!usedNumbers.has(num)) {
        candidates.push(num);
      }
    }

    if (candidates.length === 0) {

      break;
    }

    // Pick a random candidate
    const newNumber = candidates[Math.floor(Math.random() * candidates.length)];
    numbers.push(newNumber);
    usedNumbers.add(newNumber);
  }

  return numbers;
};

export const StudentNav = [
  {
    name: "Dashboard",
    to: "/student/dashboard", 
    icon: LayoutDashboard,
  },
  {
    name: "My Profile",
    to: "/student/profile",
    icon: FaUser,
  },
   {
    name: "Actvities",
    to: "/student/upload", 
    icon: Upload,
  },
  {
    name: "Feedbacks",
    to: "/student/registration", 
    icon: FaCommentAlt,
  },
  {
    name: "Project Progress",
    to: "/student/results", 
    icon: FaChartBar,
  },

];
export const StaffNav = [
  {
    name: "Dashboard",
    to: "/supervisor/dashboard", 
    icon: LayoutDashboard,
  },
    {
    name: "My Profile",
    to: "/supervisor/profile", 
    icon: FaUser,
  },
   {
    name: "Upload Marks",
    to: "/supervisor/upload-marks", 
    icon: Upload,
  },
  {
    name: "Check Plagiarism",
    to: "/supervisor/check-work", 
    icon: FaChalkboardTeacher,
  },

];
export const StaffOverview = [
  {label: "Open Events", value:'3'},
  {label: "Students", value:'152'},
  {label: "UnSeen Work", value:'10'},
  {label: "Avg.Performance", value:'86%'},
]

export const LoginFormFields = [
{ name: 'username', type: 'select', placeholder: 'Registration Number',componentType: "input" },
{ name: 'password', type: 'password', placeholder: 'Password',componentType: "input"},    
]

const currentYear = new Date().getFullYear();

export const years = Array.from({ length: 6 }, (_, index) => {
  const year = currentYear - index;
  return {
    value: year.toString(),
    label: year.toString(),
  };
});
export const semisters = Array.from({ length: 5 }, (_, index) => {
  const number = index + 1;
  return {
    value: number.toString(),
    label: number.toString(),
  };
});

export const buttonvariants = {
  default: 'bg-gray-300 hover:bg-gray-400 text-black',
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
};

export const Schedules = [
  {
    id: '1',
    title: 'Requirements Gathering',
    dueDate: new Date('2026-03-31'),
    status: 'open',
  },
  {
    id: '2',
    title: 'SDLC',
    dueDate: new Date('20266-09-20'),
    startDate:new Date('2026-07-05'),
    status: 'upcoming'
  },
  {
    id: '10',
    title: 'Project Proposal',
    on: new Date('2026-02-20'),
    status: 'closed'
  },
  {
    id: '3',
    title: 'Design',
    startDate:new Date('2026-04-21'),
    dueDate: new Date('2026-05-20'),
    status: 'upcoming',

  },

  {
    id: '4',
    title: 'Information Cleaning',
    on: new Date('2025-02-10'),
    status: 'closed',
 
  },

 
];

export const StudentActions = [
  {label: "View Feedbacks", icon: FaCommentAlt,to:'/student/feedbacks'},
  {label: "Progress", icon: FaChartBar,to:'/student/project-progress'},
  {label: "My Profile", icon: FaUser,to:'/student/profile'},
  {label: "Upload Activity", icon: Upload ,to:'/student/upload-activity'}
]

export const StaffActions = [
  {label: "Marks", icon: FaBookOpen,to:'/staff/results'},
  {label: "Upload Marks", icon: Upload ,to:'/staff/upload-marks'},
  {label: "Profile", icon: FaUser ,to:'/staff/profile'},
]


export const StudentStats = [
  {
    value: '90',
    label: "Database Programming"
  },
  {
   value: '83',
    label: "Introductory Arabic"
  },
    {
    value: '65',
    label: "Software Engineering"
  },
  {
    value: '57',
    label: "Multimedia and Graphics"
  }
]

export const StudentAnalytics = [
  {
    value:'95%',
    label: "Highest score"
  },
  {
    value: '40%',
    label: "Lowest score"
  },
  {
    value: "14 /40",
    label: "Lectures Attended"
  },
  {
    value: "0",
    label: "Retakes"
  }
]

export const StaffAnalytics = [
  {
    value:'100%',
    label: "Highest scores"
  },
  {
    value: '50%',
    label: "Lowest scores"
  },
  {
    value: "33 /40",
    label: "Lectures Taught"
  },
  {
    value: "5",
    label: "Retakes Rewarded"
  }
]