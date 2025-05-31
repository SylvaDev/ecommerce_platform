import React, { useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import useProductsStore from '../../store/productsStore';
import './Products.css';

const Products = () => {
  const { products, loading, error, fetchProducts } = useProductsStore();

  useEffect(() => {
    // Fetch all products with a higher limit
    fetchProducts(1, 50);
  }, [fetchProducts]);

  if (loading && products.length === 0) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <h2>Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <p>No products available at the moment.</p>
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="products-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Products; 