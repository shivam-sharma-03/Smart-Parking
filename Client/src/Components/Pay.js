import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Pay = () => {
  const [details, setDetails] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    alert('Payment successful!');
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <form onSubmit={handlePayment}>
        <label>Name:</label>
        <input type="text" name="name" value={details.name} onChange={handleChange} required />
        <label>Email:</label>
        <input type="email" name="email" value={details.email} onChange={handleChange} required />
        <QRCodeCanvas value={`Payment for parking slot by ${details.name}`} />
        <button type="submit">Pay</button>
      </form>
    </div>
  );
}

export default Pay