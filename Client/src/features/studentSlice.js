import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config';

// Async thunks
export const fetchStudentProjects = createAsyncThunk(
  'student/fetchProjects',
  async (studentId, { rejectWithValue }) => {
    try {
      const reg_no = localstorage.getItem('reg_no','')
      const response = await axios.get(`${API_BASE_URL}accounts/students/${reg_no}/project/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

export const submitActivity = createAsyncThunk(
  'student/submitActivity',
  async ({ studentId, activityId, fileData }, { rejectWithValue }) => {
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
  async (studentId, { rejectWithValue }) => {
    const reg_no = localStorage.getItem('reg_no','')
    try {
      const response = await axios.get(`${API_BASE_URL}accounts/students/${reg_no}/activity`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch submissions');
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'student/fetchFeedbacks',
  async (studentId, { rejectWithValue }) => {
    try {
      const reg_no = localStorage.getItem('reg_no','')
      const response = await api.get(`${API_BASE_URL}accounts/students/${reg_no}/feedbacks/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch feedbacks');
    }
  }
);

export const updateStudentProfile = createAsyncThunk(
  'student/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(,`${API_BASE_URL}accounts/students/${reg_no}/` profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const fetchStudentDetails = createAsyncThunk(
  'student/fetchDetails',
  async (reg_no, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/details/${reg_no}`);
      console.log('Fetched student details:', response.data);
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
      console.log({reg_no})
      if (user.role === 'student') {
        endpoint = `${API_BASE_URL}accounts/student/${reg_no}/`;
      } else if (user.role === 'supervisor') {
        endpoint = `${API_BASE_URL}accounts/supervisor/${reg_no}/`;
      } else if (user.role === 'admin') {
        endpoint = '/admin/dashboard/';
      }
      
      const response = await axios.get(endpoint);
      console.log({response})
      return response.data;
    } catch (error) {
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
      // Fetch Dashboard Data (from auth slice)
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