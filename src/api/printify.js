// Printify API utilities will go here

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Get all products
export const getProducts = async (page = 1, limit = 20) => {
  try {
    console.log('Fetching products...');
    const response = await api.get('/products', {
      params: {
        page,
        limit,
      },
    });
    console.log('Products response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
};

// Get single product details
export const getProductDetails = async (productId) => {
  try {
    console.log('Fetching product details for ID:', productId);
    const response = await api.get(`/products/${productId}`);
    console.log('Product details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error.response?.data || error.message);
    throw error;
  }
}; 