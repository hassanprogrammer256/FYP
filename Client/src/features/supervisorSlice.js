import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Async thunks
export const fetchSupervisorStudents = createAsyncThunk(
  'supervisor/fetchStudents',
  async (supervisorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/supervisor/students/?supervisor_id=${supervisorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch students');
    }
  }
);

export const fetchPendingReviews = createAsyncThunk(
  'supervisor/fetchPendingReviews',
  async (supervisorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/supervisor/pending_reviews/?supervisor_id=${supervisorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending reviews');
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  'supervisor/reviewSubmission',
  async ({ submissionId, grade, comments }, { rejectWithValue }) => {
    try {
      const response = await api.post('/supervisor/review_submission/', {
        submission_id: submissionId,
        grade,
        comments,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to review submission');
    }
  }
);

export const updateSupervisorProfile = createAsyncThunk(
  'supervisor/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/supervisor/update_profile/', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const fetchSupervisorDetails = createAsyncThunk(
  'supervisor/fetchDetails',
  async (supervisorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/supervisor/details/?supervisor_id=${supervisorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch supervisor details');
    }
  }
);

const supervisorSlice = createSlice({
  name: 'supervisor',
  initialState: {
    bio: null,
    projectReport: null,
    students: [],
    pendingReviews: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSupervisorData: (state) => {
      state.bio = null;
      state.projectReport = null;
      state.students = [];
      state.pendingReviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data (from auth slice)
      .addCase('auth/fetchDashboardData/fulfilled', (state, action) => {
        if (action.payload.role === 'supervisor') {
          state.bio = action.payload.bio;
          state.projectReport = action.payload.projectReport;
        }
      })
      // Fetch Students
      .addCase(fetchSupervisorStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSupervisorStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students || [];
      })
      .addCase(fetchSupervisorStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Pending Reviews
      .addCase(fetchPendingReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingReviews = action.payload.reviews || [];
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Review Submission
      .addCase(reviewSubmission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove reviewed submission from pending list
        state.pendingReviews = state.pendingReviews.filter(
          review => review.id !== action.meta.arg.submissionId
        );
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Supervisor Profile
      .addCase(updateSupervisorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSupervisorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update bio with new data
        if (action.payload.data) {
          state.bio = { ...state.bio, ...action.payload.data };
        }
        state.error = null;
      })
      .addCase(updateSupervisorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Supervisor Details
      .addCase(fetchSupervisorDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSupervisorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.bio = action.payload.data;
        }
      })
      .addCase(fetchSupervisorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSupervisorData, clearError } = supervisorSlice.actions;
export default supervisorSlice.reducer;