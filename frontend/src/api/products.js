import client from './client';

export const productsApi = {
  getProducts({ keyword, category, page, size } = {}) {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return client.get('/products', { params });
  },

  getProductById(id) {
    return client.get(`/products/${id}`);
  },
};
