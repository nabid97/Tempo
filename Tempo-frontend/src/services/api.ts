import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';// Update with your backend URL

// Register a new user
export const registerUser = async (data: { username: string; password: string; role: string }) => {
  return axios.post(`${API_URL}/register`, data);
};

// Login user
export const loginUser = async (data: { username: string; password: string }) => {
  return axios.post(`${API_URL}/login`, data);
};

// Fetch jobs
export const fetchJobs = async () => {
  return axios.get(`${API_URL}/jobs`);
};

// Post a job
export const postJob = async (token: string, data: { title: string; description: string }) => {
  return axios.post(`${API_URL}/jobs`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Apply for a job
export const applyJob = async (token: string, jobId: string) => {
  return axios.post(`${API_URL}/jobs/${jobId}/apply`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
