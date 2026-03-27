import API from './api';

export const productService = {
  // Fetch all categories
  getAllCategories: () => {
    return API.get('/categories');
  },

  // Fetch products (with optional category filtering)
  getProducts: (categoryId = null) => {
    const url = categoryId && categoryId !== 'all' 
      ? `/products?category_id=${categoryId}` 
      : '/products';
    return API.get(url);
  },

  // Fetch a single product by ID
  getProductById: (id) => {
    return API.get(`/products/${id}`);
  },

  // ✅ ADD THIS FUNCTION (DO NOT REMOVE OTHERS)
  getHomeProducts: () => {
    return API.get('/getHomeProducts');
  },

  // Search products
  searchProducts: (query) => {
    return API.get(`/products/search?q=${query}`);
  }
};