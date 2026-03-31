import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config';
import axios from 'axios';

export const fetchStudentProjects = createAsyncThunk(
  'student/fetchProjects',
  async (_, { rejectWithValue }) => {         // ✅ added second arg
    try {
      const reg_no = localStorage.getItem('reg_no') // ✅ fixed casing
      const response = await axios.get(`${API_BASE_URL}accounts/student/projects/?student_id=${reg_no}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

export const submitActivity = createAsyncThunk(
  'student/submitActivity',
  async ({ studentId, activityId, fileData }, { rejectWithValue }) => {  // ✅ added
    try {
      const response = await axios.post(`${API_BASE_URL}accounts/activity/`, {
        student_id: studentId,
        activity_id: activityId,
        file_data: fileData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit activity');
    }
  }
);

export const fetchSubmissions = createAsyncThunk(
  'student/fetchSubmissions',
  async (_, { rejectWithValue }) => {         // ✅ added second arg
    try {
      const reg_no = localStorage.getItem('reg_no')
      const response = await axios.get(`${API_BASE_URL}accounts/student/submissions/?student_id=${reg_no}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch submissions');
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'student/fetchFeedbacks',
  async (_, { rejectWithValue }) => {         // ✅ added second arg
    try {
      const reg_no = localStorage.getItem('reg_no')
      const response = await axios.get(`${API_BASE_URL}accounts/student/feedbacks/?student_id=${reg_no}`); // ✅ axios not api
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch feedbacks');
    }
  }
);

export const updateStudentProfile = createAsyncThunk(
  'student/updateProfile',
  async ({ reg_no, profileData }, { rejectWithValue }) => {  // ✅ accept as args
    try {
      const response = await axios.put(`${API_BASE_URL}accounts/student/${reg_no}/`, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const fetchStudentDetails = createAsyncThunk(
  'student/fetchDetails',
  async (reg_no, { rejectWithValue }) => {    // ✅ accept reg_no as arg
    try {
      const response = await axios.get(`${API_BASE_URL}student/details/${reg_no}`); // ✅ axios not api
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch student details');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'auth/fetchDashboard',
  async (_, {rejectWithValue }) => {
    try {
      let endpoint = '';
      const reg_no  = localStorage.getItem('reg_no') || null;
      const role = localStorage.getItem('role') || null;
      if (role === 'student') {
        endpoint = `${API_BASE_URL}accounts/student/dashboard/?student_id=${reg_no}`;
      } else if (role === 'supervisor') {
        endpoint = `${API_BASE_URL}accounts/student/dashboard/?supervisor_id=${reg_no}`;
      } else if (role === 'admin') {
        endpoint = '/admin/dashboard/';
      };
  
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);


const studentSlice = createSlice({
  name: 'student',
  initialState: {
    bio: null,
    projectReport: null,
    projects: [],
    submissions: [],
    feedbacks: [],
    isLoading: false,
    error: null,
    dashboardData:null
  },
  reducers: {
    clearStudentData: (state) => {
      state.bio = null;
      state.projectReport = null;
      state.projects = [];
      state.submissions = [];
      state.feedbacks = [];
      state.dashboardData = null;

    },
    clearError: (state) => {
      state.error = null;
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        if (action.payload.role === 'student') {
          state.bio = action.payload.bio;
          state.projectReport = action.payload.projectReport;
          state.dashboardData = action.payload;
        }
      })
      // Fetch Projects
      .addCase(fetchStudentProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects || [];
      })
      .addCase(fetchStudentProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit Activity
      .addCase(submitActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add to submissions
      })
      .addCase(submitActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissions = action.payload.submissions || [];
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload.feedbacks || [];
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Student Profile
      .addCase(updateStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update bio with new data
        if (action.payload.data) {
          state.bio = { ...state.bio, ...action.payload.data };
        }
        state.error = null;
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Student Details
      .addCase(fetchStudentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.bio = action.payload.data;
        }
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudentData, clearError } = studentSlice.actions;
export default studentSlice.reducer;