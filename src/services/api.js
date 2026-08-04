const API_BASE = import.meta.env.VITE_API_URL || "https://ods-network-backend.onrender.com";

const getAuthHeaders = (tokenKey = "token") => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
});

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const api = {
  get: async (endpoint, tokenKey = "token") => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getAuthHeaders(tokenKey),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body, tokenKey = "token") => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(tokenKey),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body, tokenKey = "token") => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(tokenKey),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, tokenKey = "token") => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(tokenKey),
    });
    return handleResponse(response);
  },

  upload: async (endpoint, formData, tokenKey = "token") => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export const authApi = {
  adminLogin: (credentials) => api.post("/api/admin/login", credentials),
  clientLogin: (credentials) => api.post("/api/client/login", credentials, null),
  clientRegister: (data) => api.post("/api/client/register", data, null),
};

export const contactApi = {
  submit: (data) => api.post("/api/contact", data, null),
  getAll: () => api.get("/api/contact"),
  updateStatus: (id, status) => api.put(`/api/contact/${id}`, { status }),
  delete: (id) => api.delete(`/api/contact/${id}`),
};

export const projectApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/projects${query ? `?${query}` : ""}`);
  },
  create: (data) => api.post("/api/projects", data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

export const blogApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/blogs${query ? `?${query}` : ""}`);
  },
  getBySlug: (slug) => api.get(`/api/blogs/${slug}`),
  create: (data) => api.post("/api/blogs", data),
  update: (id, data) => api.put(`/api/blogs/${id}`, data),
  delete: (id) => api.delete(`/api/blogs/${id}`),
};

export const testimonialApi = {
  getAll: () => api.get("/api/testimonials"),
  getAdmin: () => api.get("/api/admin/testimonials"),
  create: (data) => api.post("/api/testimonials", data, null),
  approve: (id) => api.put(`/api/admin/testimonials/${id}/approve`),
  reject: (id) => api.put(`/api/admin/testimonials/${id}/reject`),
  delete: (id) => api.delete(`/api/admin/testimonials/${id}`),
};

export const jobApi = {
  getAll: () => api.get("/api/jobs"),
  getApplications: () => api.get("/api/applications"),
  create: (data) => api.post("/api/jobs", data),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`),
  apply: (data) => api.post("/api/jobs/apply", data, null),
};

export const ticketApi = {
  getAll: () => api.get("/api/tickets/admin/all"),
  getClient: () => api.get("/api/tickets"),
  create: (data) => api.post("/api/tickets", data),
  updateStatus: (id, status) => api.put(`/api/tickets/${id}`, { status }),
};

export const appointmentApi = {
  getAll: () => api.get("/api/appointments"),
  create: (data) => api.post("/api/appointments", data),
  confirm: (id) => api.post(`/api/appointments/${id}/confirm`),
  update: (id, data) => api.put(`/api/appointments/${id}`, data),
};

export const subscriberApi = {
  subscribe: (email) => api.post("/api/newsletter/subscribe", { email }, null),
  getAll: () => api.get("/api/newsletter/subscribers"),
};

export const invoiceApi = {
  getAll: () => api.get("/api/invoices"),
  getClient: () => api.get("/api/client/invoices"),
  create: (data) => api.post("/api/invoices", data),
  update: (id, data) => api.put(`/api/invoices/${id}`, data),
  delete: (id) => api.delete(`/api/invoices/${id}`),
  getClients: () => api.get("/api/clients"),
};

export const teamApi = {
  getAll: () => api.get("/api/team"),
  create: (data) => api.post("/api/team", data),
  update: (id, data) => api.put(`/api/team/${id}`, data),
  delete: (id) => api.delete(`/api/team/${id}`),
};

export const milestoneApi = {
  getAll: () => api.get("/api/milestones"),
  getClient: () => api.get("/api/client/milestones"),
  create: (data) => api.post("/api/milestones", data),
  update: (id, data) => api.put(`/api/milestones/${id}`, data),
  delete: (id) => api.delete(`/api/milestones/${id}`),
};

export const assetApi = {
  getAll: () => api.get("/api/admin/assets"),
  getClient: () => api.get("/api/client/assets"),
  upload: (formData) => api.upload("/api/admin/assets", formData),
  uploadClient: (formData) => api.upload("/api/client/assets", formData),
  delete: (id) => api.delete(`/api/admin/assets/${id}`),
};

export const notificationApi = {
  getAll: () => api.get("/api/admin/notifications"),
  markRead: (id) => api.put(`/api/admin/notifications/${id}/read`),
};

export const analyticsApi = {
  getAll: () => api.get("/api/admin/analytics"),
};

export const auditLogApi = {
  getAll: () => api.get("/api/admin/audit-logs"),
};

export const chatApi = {
  getChats: () => api.get("/api/admin/chats"),
  getMessages: (clientId) => api.get(`/api/chat/${clientId}`),
};

export default api;