import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart before checking out.</p>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  const handleCheckout = () => {
    // TODO: Implement Stripe checkout
    console.log('Proceeding to payment...');
    // After successful payment:
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="checkout-item">
                <img 
                  src={item.image} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="variant">{item.variantTitle}</p>
                  <p className="quantity">Quantity: {item.quantity}</p>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Information</h2>
          <p className="coming-soon">Payment integration coming soon!</p>
          <button 
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 