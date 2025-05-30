import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <div className="orders-content">
        <div className="orders-empty">
          <h2>No Orders Yet</h2>
          <p>Your order history will appear here once you make a purchase.</p>
          <button onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default Orders; 