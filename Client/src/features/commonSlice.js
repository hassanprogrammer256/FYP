import { createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
  profile: null,
}

export const updateProfile = createAsyncThunk(
  'updateprofile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await UpdateProfile(profileData);
      if (response?.success) {
        return response;
      } else {
        return rejectWithValue('Failed to update profile');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
