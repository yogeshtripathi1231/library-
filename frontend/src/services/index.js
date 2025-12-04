import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};

export const bookService = {
  getAllBooks: async (search = '', category = '') => {
    const response = await api.get('/books', {
      params: { search, category },
    });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (data) => {
    const response = await api.post('/books', data);
    return response.data;
  },

  updateBook: async (id, data) => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export const requestService = {
  createRequest: async (bookId) => {
    const response = await api.post('/requests', { bookId });
    return response.data;
  },

  getUserRequests: async () => {
    const response = await api.get('/requests/user');
    return response.data;
  },

  getAllRequests: async (status = '') => {
    const response = await api.get('/requests', {
      params: { status },
    });
    return response.data;
  },

  updateRequest: async (id, status) => {
    const response = await api.put(`/requests/${id}`, { status });
    return response.data;
  },

  returnBook: async (id) => {
    const response = await api.put(`/requests/${id}/return`);
    return response.data;
  },
};

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const adminService = {
  createAdmin: async (data) => {
    const response = await api.post('/admin/create', data);
    return response.data;
  },
};
