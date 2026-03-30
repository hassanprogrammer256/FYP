import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import studentReducer from '../features/studentSlice';
import supervisorReducer from '../features/supervisorSlice';
import adminReducer from '../features/adminSlice';
import projectReducer from '../features/projectSlice';
import uiReducer from '../features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    supervisor: supervisorReducer,
    admin: adminReducer,
    project: projectReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;