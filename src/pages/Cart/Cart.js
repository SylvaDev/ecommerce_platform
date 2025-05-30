import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here!</p>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="cart-item">
            <img 
              src={item.image} 
              alt={item.title} 
              className="cart-item-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
              }}
            />
            
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p className="variant-title">{item.variantTitle}</p>
              <p className="item-price">${item.price.toFixed(2)}</p>
            </div>

            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="quantity-button"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                className="quantity-button"
              >
                +
              </button>
            </div>

            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              className="remove-item"
              onClick={() => removeItem(item.productId, item.variantId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="cart-actions">
          <button className="clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
          <button 
            className="checkout-button"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 