import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    // Clear the tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to the login page
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white p-4 flex justify-center items-center z-50 shadow-xl">
      <div className="w-full max-w-6xl flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-bold text-gray-200 tracking-wider transform hover:scale-105 transition duration-300 ease-in-out">
            Dev
            <span className="text-teal-400">Gram</span>
          </h1>
        </div>
        <ul className="flex space-x-8">
          <li>
            <a
              href="/home"
              className="text-lg font-semibold text-gray-300 hover:text-teal-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/profile/"
              className="text-lg font-semibold text-gray-300 hover:text-teal-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Profile
            </a>
          </li>
        </ul>
        <button
          onClick={handleSignout}
          className="bg-gradient-to-r from-teal-400 to-teal-600 text-white py-2 px-6 rounded-full shadow-md hover:from-teal-500 hover:to-teal-700 transition-all duration-300 transform hover:scale-110"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;