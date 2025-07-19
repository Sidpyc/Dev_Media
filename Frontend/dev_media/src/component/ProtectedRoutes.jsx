import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Assume isAuthenticated is a function that checks if the user is logged in
  const isAuthenticated = () => {
    // Your logic here to check if user is authenticated
    return localStorage.getItem('token') !== null; // Example with a token in localStorage
  };

  return (
    <Route 
      {...rest}
      render={props => 
        isAuthenticated() ? 
          <Component {...props} /> : 
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      }
    />
  );
};

export default ProtectedRoute;