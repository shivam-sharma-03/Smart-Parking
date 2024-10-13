import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './Slot.css';

const Slot = () => {
  const location = useLocation();
  const { locationName } = location.state;

  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const proceedToPayment = () => {
    if (selectedSlot) {
      navigate('/payment');
    } else {
      alert('Please select a parking slot.');
    }
  };

  return (
    <div>
      <h2>Select a Parking Slot: {locationName}</h2>
      <div className="parking-grid">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className={`slot ${selectedSlot === index ? 'selected' : ''}`}
            onClick={() => handleSlotClick(index)}
          >
            Slot {index + 1}
          </div>
        ))}
      </div>
      <button onClick={proceedToPayment}>Proceed to Payment</button>
    </div>
  );
}

export default Slot;
