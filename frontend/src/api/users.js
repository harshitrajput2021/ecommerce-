import client from './client';

export const usersApi = {
  getProfile() {
    return client.get('/users/me');
  },

  updateProfile(data) {
    return client.put('/users/me', { name: data.name, email: data.email });
  },

  changePassword(data) {
    return client.put('/users/me/password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
  },
};
