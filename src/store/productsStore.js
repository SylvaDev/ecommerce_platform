import { create } from 'zustand';
import { getProducts, getProductDetails } from '../api/printify';

const useProductsStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  variants: [],
  loading: false,
  error: null,
  hasFetched: false,
  page: 1,
  hasMore: true,

  // Fetch products with pagination
  fetchProducts: async (page = 1, limit = 20) => {
    const { hasFetched } = get();
    if (hasFetched && page === 1 && limit === 20) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await getProducts(page, limit);
      const { data, current_page, last_page } = response;
      
      set({ 
        products: data,
        page: current_page,
        hasMore: current_page < last_page,
        loading: false,
        hasFetched: true
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch products',
        loading: false 
      });
    }
  },

  // Fetch single product details
  fetchProductDetails: async (productId) => {
    if (!productId) {
      set({ error: 'No product ID provided' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const productResponse = await getProductDetails(productId);
      
      console.log('Product Response:', productResponse);
      
      set({ 
        currentProduct: productResponse,
        variants: productResponse.variants || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      set({ 
        error: error.message || 'Failed to fetch product details',
        loading: false 
      });
    }
  },

  // Clear current product
  clearCurrentProduct: () => {
    set({ currentProduct: null, variants: [] });
  },

  // Reset store
  reset: () => {
    set({
      products: [],
      currentProduct: null,
      variants: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      hasFetched: false
    });
  }
}));

export default useProductsStore; 