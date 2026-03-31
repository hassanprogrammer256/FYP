import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { API_BASE_URL } from '../config';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}accounts/login/`, { username, password });
      if (response.data.success) {
        localStorage.setItem('reg_no', response.data.user.reg_no);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('is_authenticated', 'true');
        localStorage.setItem('token', response.data.token || '');
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login imeshindwa');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.clear();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: localStorage.getItem('role') || null,
    isAuthenticated: localStorage.getItem('is_authenticated') === 'true',
    reg_no: localStorage.getItem('reg_no') || null,
    isLoading: false,
    error: null, //
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.role = action.payload.user.role; // Hifadhi role kwenye Redux state
        state.reg_no = action.payload.user.reg_no;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.role = null;
        state.reg_no = null;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.role = null;
        state.isAuthenticated = false;
        state.reg_no = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;