import client from './client';

export const cartApi = {
  getCart() {
    return client.get('/cart');
  },

  addItem(productId, quantity) {
    return client.post('/cart/items', { productId, quantity });
  },

  updateItem(productId, quantity) {
    return client.put(`/cart/items/${productId}`, { quantity });
  },

  removeItem(productId) {
    return client.delete(`/cart/items/${productId}`);
  },

  checkout(shippingAddress) {
    return client.post('/orders/checkout', { shippingAddress });
  },
};
