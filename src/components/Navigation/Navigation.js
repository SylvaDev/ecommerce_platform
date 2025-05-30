import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './Navigation.css';

const Navigation = () => {
  const itemCount = useCartStore(state => state.itemCount);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Store Name
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </Link>
          <Link to="/orders" className="nav-link">Orders</Link>
        </div>

        <div className="nav-actions">
          <button className="nav-button">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 