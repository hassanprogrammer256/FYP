import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/project/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchProjectDetails',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/project/${projectId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch project details');
    }
  }
);

export const fetchProjectActivities = createAsyncThunk(
  'project/fetchProjectActivities',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/project/${projectId}/activities/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch activities');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    currentProject: null,
    activities: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.activities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project Details
      .addCase(fetchProjectDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project Activities
      .addCase(fetchProjectActivities.fulfilled, (state, action) => {
        state.activities = action.payload.activities || [];
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;