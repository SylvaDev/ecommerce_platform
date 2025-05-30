import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductsStore from '../../store/productsStore';
import useCartStore from '../../store/cartStore';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, variants, loading, error, fetchProductDetails } = useProductsStore();
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      console.log('Product page mounted with ID:', id);
      fetchProductDetails(id);
    }
  }, [id, fetchProductDetails]);

  useEffect(() => {
    console.log('Current product updated:', currentProduct);
    console.log('Variants updated:', variants);
  }, [currentProduct, variants]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      console.log('Setting initial variant:', variants[0]);
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <h2>Error loading product</h2>
        <p>{error}</p>
        <p className="error-details">
          This could be because:
          <ul>
            <li>The product is still being published on Printify</li>
            <li>The product ID is incorrect</li>
            <li>There might be an issue with the API connection</li>
          </ul>
        </p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="product-error">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or isn't available yet.</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      console.log('Adding to cart:', {
        productId: id,
        variantId: selectedVariant.id,
        quantity,
        price: selectedVariant.price,
        title: currentProduct.title,
        image: currentProduct.images[0]?.src,
        variantTitle: selectedVariant.title
      });

      addItem({
        productId: id,
        variantId: selectedVariant.id,
        quantity,
        price: selectedVariant.price,
        title: currentProduct.title,
        image: currentProduct.images[0]?.src,
        variantTitle: selectedVariant.title
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-gallery">
        {currentProduct.images && currentProduct.images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`${currentProduct.title} - Image ${index + 1}`}
            className="product-image"
            onError={(e) => {
              console.log('Image failed to load:', image.src);
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        ))}
      </div>

      <div className="product-info">
        <h1 className="product-title">{currentProduct.title}</h1>
        <p className="product-description">{currentProduct.description}</p>

        {variants && variants.length > 0 && (
          <div className="product-variants">
            <h3>Select Options</h3>
            <div className="variant-options">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`variant-option ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="product-price">
          {selectedVariant && <p>${selectedVariant.price.toFixed(2)}</p>}
        </div>

        <div className="product-quantity">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <button
          className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedVariant}
        >
          {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Product; 