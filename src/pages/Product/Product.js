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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (id) {
      console.log('Product page mounted with ID:', id);
      fetchProductDetails(id);
    }
  }, [id, fetchProductDetails]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstVariant = variants[0];
      if (firstVariant && firstVariant.title) {
        const [color, size] = firstVariant.title.split(' / ');
        setSelectedColor(color);
        setSelectedSize(size);
        setSelectedVariant(firstVariant);
      }
    }
  }, [variants]);

  useEffect(() => {
    if (selectedColor && selectedSize && variants) {
      const matchingVariant = variants.find(variant => 
        variant && variant.title === `${selectedColor} / ${selectedSize}`
      );
      setSelectedVariant(matchingVariant || null);
    }
  }, [selectedColor, selectedSize, variants]);

  // Add new effect to handle image switching when variant changes
  useEffect(() => {
    if (selectedVariant && currentProduct?.images) {
      console.log('Selected variant:', selectedVariant);
      console.log('Product images:', currentProduct.images);
      
      // Find the first image that includes this variant's ID
      const matchingImageIndex = currentProduct.images.findIndex(image => 
        image.variant_ids?.includes(selectedVariant.id)
      );
      
      console.log('Found matching image at index:', matchingImageIndex);
      // If we found a matching image, switch to it, otherwise stay on current image
      if (matchingImageIndex !== -1) {
        setCurrentImageIndex(matchingImageIndex);
      }
    }
  }, [selectedVariant, currentProduct?.images]);

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
        price: selectedVariant.price / 100,
        title: currentProduct.title,
        image: currentProduct.images[0]?.src,
        variantTitle: selectedVariant.title
      });

      addItem({
        productId: id,
        variantId: selectedVariant.id,
        quantity,
        price: selectedVariant.price / 100,
        title: currentProduct.title,
        image: currentProduct.images[0]?.src,
        variantTitle: selectedVariant.title
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? currentProduct.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === currentProduct.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getUniqueOptions = (optionName) => {
    if (!variants || !optionName) return [];
    const options = new Set();
    
    variants.forEach(variant => {
      if (variant && variant.title) {
        const [color, size] = variant.title.split(' / ');
        if (optionName.toLowerCase() === 'size') {
          options.add(size);
        } else if (optionName.toLowerCase() === 'color') {
          options.add(color);
        }
      }
    });
    
    return Array.from(options);
  };

  const getAvailableVariants = (selectedColor, selectedSize) => {
    if (!variants) return [];
    return variants.filter(variant => {
      const [color, size] = variant.title.split(' / ');
      return (!selectedColor || color === selectedColor) && 
             (!selectedSize || size === selectedSize);
    });
  };

  return (
    <div className="product-detail">
      <div className="product-gallery">
        {currentProduct.images && currentProduct.images.length > 0 && (
          <>
            <button 
              className="gallery-nav prev" 
              onClick={handlePreviousImage}
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <img
              src={currentProduct.images[currentImageIndex].src}
              alt={`${currentProduct.title} - ${currentImageIndex + 1}`}
              className="product-image"
              onError={(e) => {
                console.log('Image failed to load:', currentProduct.images[currentImageIndex].src);
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
            <button 
              className="gallery-nav next" 
              onClick={handleNextImage}
              aria-label="Next image"
            >
              &#10095;
            </button>
            <div className="image-counter">
              {currentImageIndex + 1} / {currentProduct.images.length}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{currentProduct.title}</h1>
        <p className="product-description">{currentProduct.description}</p>

        {variants && variants.length > 0 && (
          <div className="product-variants">
            <div className="variant-section">
              <h3>Color</h3>
              <div className="variant-options">
                {getUniqueOptions('color').map((color) => (
                  <button
                    key={color}
                    className={`variant-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="variant-section">
              <h3>Size</h3>
              <div className="variant-options">
                {getUniqueOptions('size').map((size) => (
                  <button
                    key={size}
                    className={`variant-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="product-price">
          {selectedVariant && <p>${(selectedVariant.price / 100).toFixed(2)}</p>}
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