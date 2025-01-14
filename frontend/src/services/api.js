import axios from 'axios';

// Hard-code the API URL
const API_URL = 'http://localhost:5000/api';
console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic error handler
const handleError = (error) => {
  console.error('API Error:', error.response || error.message || error);
  throw error.response?.data || error.message || 'An unknown error occurred';
};

// Register a new user
export const registerUser = async (data) => {
  try {
    const response = await apiClient.post('/register', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Login user
export const loginUser = async (data) => {
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
export const postJob = async (token, data) => {
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
export const applyJob = async (token, jobId) => {
  try {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};