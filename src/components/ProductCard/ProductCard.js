import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { id, title, images, variants } = product;
  
  // Get the first image and default variant price
  const mainImage = images?.[0]?.src || '';
  const defaultVariant = variants?.find(variant => variant.is_default) || variants?.[0];
  const price = defaultVariant?.price || 0;

  console.log('ProductCard rendering:', { id, title, mainImage, price });

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={mainImage} 
          alt={title} 
          className="product-image"
          onError={(e) => {
            console.log('Image failed to load:', mainImage);
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${(price / 100).toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard; 