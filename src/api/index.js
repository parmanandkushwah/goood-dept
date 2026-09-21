import api from './axios';

export const getAssetUrl = (assetPath) => {
  if (!assetPath || /^https?:\/\//.test(assetPath)) return assetPath;
  const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${apiOrigin}${assetPath}`;
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.patch('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const leadsApi = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  updateStatus: (id, data) => api.patch(`/leads/${id}/status`, data),
  assign: (id, data) => api.patch(`/leads/${id}/assign`, data),
  addNote: (id, data) => api.post(`/leads/${id}/notes`, data),
  addFollowUp: (id, data) => api.post(`/leads/${id}/followups`, data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getLeadTrends: (params) => api.get('/dashboard/lead-trends', { params }),
  getLoanDistribution: () => api.get('/dashboard/loan-distribution'),
  getStatusDistribution: () => api.get('/dashboard/status-distribution'),
  getSourcePerformance: () => api.get('/dashboard/source-performance'),
  getConversion: () => api.get('/dashboard/conversion'),
  getEmployeePerformance: () => api.get('/dashboard/employee-performance'),
};

export const loanProductsApi = {
  getAll: (params) => api.get('/loan-products', { params }),
  getBySlug: (slug) => api.get(`/loan-products/slug/${slug}`),
  getById: (id) => api.get(`/loan-products/${id}`),
  create: (data) => api.post('/loan-products', data),
  update: (id, data) => api.patch(`/loan-products/${id}`, data),
  delete: (id) => api.delete(`/loan-products/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const followUpsApi = {
  getAll: (params) => api.get('/followups', { params }),
  update: (id, data) => api.patch(`/followups/${id}`, data),
  delete: (id) => api.delete(`/followups/${id}`),
};

export const faqsApi = {
  getAll: (params) => api.get('/faqs', { params }),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.patch(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

export const testimonialsApi = {
  getAll: (params) => api.get('/testimonials', { params }),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.patch(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const settingsApi = {
  getAll: () => api.get('/settings'),
  update: (data) => api.patch('/settings', data),
};

export const heroOffersApi = {
  getAll: (params) => api.get('/hero-offers', { params }),
  create: (data) => api.post('/hero-offers', data),
  update: (id, data) => api.patch(`/hero-offers/${id}`, data),
  delete: (id) => api.delete(`/hero-offers/${id}`),
};

export const formFieldApi = {
  getAll: (params) => api.get('/form-fields', { params }),
  create: (data) => api.post('/form-fields', data),
  update: (id, data) => api.patch(`/form-fields/${id}`, data),
  delete: (id) => api.delete(`/form-fields/${id}`),
};
