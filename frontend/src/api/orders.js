import client from './client';

export const ordersApi = {
  getOrders() {
    return client.get('/orders');
  },

  getOrderById(id) {
    return client.get(`/orders/${id}`);
  },
};
