import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config';
import axios from 'axios'

// Async thunks
export const fetchAllStudents = createAsyncThunk(
  'admin/fetchAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}accounts/students/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch students');
    }
  }
);

export const assignSupervisor = createAsyncThunk(
  'admin/assignSupervisor',
  async ({ studentId, supervisorId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}admin/assign-supervisor/`, {
        student_id: studentId,
        supervisor_id: supervisorId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to assign supervisor');
    }
  }
);

export const createProject = createAsyncThunk(
  'admin/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}admin/create-project/`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create project');
    }
  }
);

export const fetchAllSupervisors = createAsyncThunk(
  'admin/fetchAllSupervisors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}accounts/supervisor/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch supervisors');
    }
  }
);

export const fetchAllCourses = createAsyncThunk(
  'admin/fetchAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}accounts/course/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch courses');
    }
  }
);

export const fetchAllFaculties = createAsyncThunk(
  'admin/fetchAllFaculties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}accounts/faculty/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch faculties');
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  'admin/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('`${API_BASE_URL}accounts/update-profile/`', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const fetchAdminDetails = createAsyncThunk(
  'admin/fetchDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}admin/details/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch admin details');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    bio: null,
    projectReport: null,
    students: [],
    supervisors: [],
    courses: [],
    faculties: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAdminData: (state) => {
      state.projectReport = null;
      state.students = [];
      state.supervisors = [];
      state.courses = [];
      state.faculties = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data (from auth slice)
      .addCase('auth/fetchDashboardData/fulfilled', (state, action) => {
        if (action.payload.role === 'admin') {
          state.projectReport = action.payload.projectReport;
        }
      })
      // Fetch All Students
      .addCase(fetchAllStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students || [];
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Supervisors
      .addCase(fetchAllSupervisors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllSupervisors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supervisors = action.payload || [];
      })
      .addCase(fetchAllSupervisors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload || [];
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Faculties
      .addCase(fetchAllFaculties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFaculties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faculties = action.payload || [];
      })
      .addCase(fetchAllFaculties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Assign Supervisor
      .addCase(assignSupervisor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignSupervisor.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally update student list
      })
      .addCase(assignSupervisor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add to projects list
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Admin Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update bio with new data
        if (action.payload.data) {
          state.bio = { ...state.bio, ...action.payload.data };
        }
        state.error = null;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Admin Details
      .addCase(fetchAdminDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.bio = action.payload.data;
        }
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminData, clearError } = adminSlice.actions;
export default adminSlice.reducer;