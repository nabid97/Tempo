import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Jobs from '../pages/Jobs';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  console.log('App component rendered');
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome to Tempo</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;