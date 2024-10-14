import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapPage from './Components/Map';
import Landingpage from './Components/Landingpage';
import Slot from './Components/Slot';
import Pay from './Components/Pay';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/slot" element={<Slot />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/payment" element={<Pay />} />
          <Route path="/contact" element={<ContactUs />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
