import React from 'react';
import { useNavigate } from 'react-router-dom';
import Posts from './Posts';

const Home = () => {
  const navigate = useNavigate();



  const handleSignout = () => {
    // Clear the tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to the login page
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
   
  };

  return (
    <div >
      <h1  >Welcome Home!</h1>
      <Posts/>
      
      
    </div>
  );
};

export default Home;