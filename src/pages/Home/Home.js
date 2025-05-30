import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductsStore from '../../store/productsStore';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProductsStore();

  useEffect(() => {
    fetchProducts(1, 4); // Fetch first 4 products for featured section
  }, [fetchProducts]);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover our collection of high-quality products</p>
          <button onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.images[0]?.src}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <h3>{product.title}</h3>
                <p className="price">${product.variants[0]?.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home; 