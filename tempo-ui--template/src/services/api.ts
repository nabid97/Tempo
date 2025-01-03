import axios from 'axios';

// Use REACT_APP_BACKEND_URL from the environment variable
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic error handler
const handleError = (error: any) => {
  console.error('API Error:', error.response || error.message || error);
  throw error.response?.data || error.message || 'An unknown error occurred';
};

// Register a new user
export const registerUser = async (data: { username: string; password: string; role: string }) => {
  try {
    const response = await apiClient.post('/register', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Login user
export const loginUser = async (data: { username: string; password: string }) => {
  try {
    const response = await apiClient.post('/login', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Fetch jobs
export const fetchJobs = async () => {
  try {
    const response = await apiClient.get('/jobs');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Post a job
export const postJob = async (token: string, data: { title: string; description: string }) => {
  try {
    const response = await apiClient.post('/jobs', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Apply for a job
export const applyJob = async (token: string, jobId: string) => {
  try {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
