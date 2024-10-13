import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToMap = () => {
    navigate('/map'); 
  };

  return (
    <div>
      <Navbar />
      <h1>Welcome to the Smart Parking System</h1>
      <p>Find and book parking spaces with ease.</p>
      <button onClick={navigateToMap}>Find Parking</button>
    </div>
  );
};

export default HomePage;
