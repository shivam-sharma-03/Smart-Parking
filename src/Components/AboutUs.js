import React from 'react';
import Navbar from './Navbar';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <Navbar /> {/* Add Navbar */}
      <h1>About Us</h1>
      <p>
        Welcome to Smart Parking! We are dedicated to providing a seamless and efficient parking experience for everyone. Our innovative platform connects drivers with available parking spaces in real-time, ensuring that you can find and book a parking spot with ease.
      </p>
      <p>
        Our mission is to alleviate parking challenges in urban areas and reduce traffic congestion. We strive to make parking accessible and convenient for all, utilizing cutting-edge technology to enhance the user experience.
      </p>
      <p>
        Join us on our journey to revolutionize the way people find and use parking spaces. Thank you for choosing Smart Parking!
      </p>
    </div>
  );
};

export default AboutUs;
