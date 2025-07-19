import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import SignupPage from './component/SignupPage';
import Home from './component/home';
import Profile from './component/Profile';
import EditProfile from './component/EditProfile';
import Posts from './component/Posts';
import AddPost from './component/AddPost';
import MyPosts from './component/MyPost';
import Navbar from './component/Navbar'; // Import the Navbar component
import UserProfile from './component/UserProfile';

const App = () => {
  // State to manage the token and authentication status
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  
  // Function to check if the user is authenticated
  const isAuthenticated = () => token !== null;

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null); // Clear the token from state
    window.location.href = '/login'; // Redirect to login page
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  // Update token state dynamically when it's removed from localStorage
  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, []); // Empty dependency array ensures this runs once when the component mounts

  useEffect(() => {
    if (!isAuthenticated()) {
      setToken(null); // Ensure the token state is updated if the user logs out
    }
  }, [token]); // This effect listens to changes in the token state

  return (
    <Router>
      {/* Dark background wrapper */}
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Conditionally render the Navbar based on authentication */}
        {isAuthenticated() && <Navbar onLogout={handleLogout} /> }
        
        <Routes>
          {/* Authentication Routes */}
          <Route 
            path="/" 
            element={
              !isAuthenticated() ? (
                <LoginPage setToken={setToken} />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route 
            path="/signup" 
            element={<SignupPage setToken={setToken} />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/userprofile/:username" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/myposts" 
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mypost" 
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addpost" 
            element={
              <ProtectedRoute>
                <AddPost />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route for undefined paths */}
          <Route 
            path="*" 
            element={
              isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;