import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import './Landingpage.css'; // Importing CSS for better structure

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToMap = () => {
    navigate('/map'); 
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <h1 className="hero-title">Smart Parking System</h1>
        <p className="hero-subtitle">Find and book parking spaces with ease.</p>
        <button className="cta-button" onClick={navigateToMap}>
          Find Parking
        </button>
      </div>
    </div>
  );
};

export default HomePage;
