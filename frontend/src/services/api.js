import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080', // FastAPI backend
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User-related API calls
export const createUser = (userData) => {
  return api.post('/create_user/', userData);
};

export const deleteUser = (userId) => {
  return api.delete(`/delete_user/${userId}`);
};

export const updateUserPermissions = (userId, permissions) => {
  return api.patch(`/update_permissions/${userId}`, permissions);
};

export const getUserPermissions = (userId) => {
  return api.get(`/user_permissions/${userId}`);
};

export const getUsers = (email) => {
  const params = email ? { email } : {};
  return api.get(`/users/`, { params });
};

export const resetPassword = (userId, newPassword) => {
  return api.patch(`/reset_password/${userId}`, { new_password: newPassword });
};

// Vessel-related API calls
export const getVesselTypes = () => {
  return api.get('/vessel/vessel_types/');
};

export const getVesselSubtypes = (vesselType) => {
  return api.get('/vessel/vessel_subtypes/', { params: { vessel_type: vesselType } });
};

export const filterReportData = (filterParams) => {
  return api.post('/vessel/filter_report_data', filterParams);
};

export const filterInpuyts = (inputsParams) => {
  return api.post('/vessel/inputs', inputsParams);
};

export default api;
 