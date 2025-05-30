const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Printify API configuration
const printifyApi = axios.create({
  baseURL: 'https://api.printify.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_PRINTIFY_TOKEN}`,
    'Accept': 'application/json'
  }
});

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const response = await printifyApi.get(`/v1/shops/${process.env.REACT_APP_PRINTIFY_SHOP_ID}/products.json`, {
      params: { page, limit }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await printifyApi.get(`/v1/shops/${process.env.REACT_APP_PRINTIFY_SHOP_ID}/products/${id}.json`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching product details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

app.get('/api/products/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await printifyApi.get(`/v1/shops/${process.env.REACT_APP_PRINTIFY_SHOP_ID}/products/${id}/variants.json`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching variants:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch variants' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 