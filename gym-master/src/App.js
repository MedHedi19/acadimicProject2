import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Services from './components/Services';
import Login from './pages/Login';
import Forum from './pages/Forum';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './hooks/ProtectedRoute';
import { loginSuccess } from './auth/authActions';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loginSuccess(null, token));
    }
  }, [dispatch]);

  return <MainApp />;
};

const MainApp = () => {
  const showHeader = !['/adminDashboard', '/forum'].includes(location.pathname);

  return (
    <Box>
      {showHeader && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/forum"
          element={
            <ProtectedRoute allowedRoles={['Client']}>
              <Forum />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={['Administration', 'Owner', 'IT-Support', 'Worker', 'Coach']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      {showHeader && <Footer />}
      <ToastContainer />
    </Box>
  );
};


export default App;
