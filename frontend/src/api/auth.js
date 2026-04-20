import client from './client';

export const authApi = {
  register(payload) {
    return client.post('/auth/register', payload);
  },
  login(payload) {
    return client.post('/auth/login', payload);
  },
};
