const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (BASE_URL && url.startsWith('/')) {
    return `${BASE_URL}${url}`;
  }
  return url;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('harish_portfolio_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('harish_portfolio_token');
      localStorage.removeItem('harish_portfolio_user');
      window.location.href = '/admin/login';
    }
    const message = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    changePassword: async (old_password, new_password) => {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ old_password, new_password })
      });
      return handleResponse(res);
    },
    logout: async () => {
      try {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
      } catch (e) {
        // Ignore logout network error
      }
      localStorage.removeItem('harish_portfolio_token');
      localStorage.removeItem('harish_portfolio_user');
    }
  },

  // Public Endpoints
  public: {
    getPortfolio: async () => {
      const res = await fetch(`${BASE_URL}/api/public/portfolio`);
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/api/public/profile`);
      return handleResponse(res);
    },
    getProjects: async (category = '', search = '') => {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const url = `${BASE_URL}/api/public/projects?${params.toString()}`;
      const res = await fetch(url);
      return handleResponse(res);
    },
    getSkills: async () => {
      const res = await fetch(`${BASE_URL}/api/public/skills`);
      return handleResponse(res);
    },
    getEducation: async () => {
      const res = await fetch(`${BASE_URL}/api/public/education`);
      return handleResponse(res);
    },
    getCertificates: async () => {
      const res = await fetch(`${BASE_URL}/api/public/certificates`);
      return handleResponse(res);
    },
    submitContact: async (formData) => {
      const res = await fetch(`${BASE_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return handleResponse(res);
    }
  },

  // Admin Endpoints
  admin: {
    getStats: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/profile`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      return handleResponse(res);
    },
    // Projects
    getProjects: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/projects`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    createProject: async (projectData) => {
      const res = await fetch(`${BASE_URL}/api/admin/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      return handleResponse(res);
    },
    updateProject: async (id, projectData) => {
      const res = await fetch(`${BASE_URL}/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      return handleResponse(res);
    },
    deleteProject: async (id) => {
      const res = await fetch(`${BASE_URL}/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    // Skills
    getSkills: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/skills`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    createSkill: async (skillData) => {
      const res = await fetch(`${BASE_URL}/api/admin/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      return handleResponse(res);
    },
    updateSkill: async (id, skillData) => {
      const res = await fetch(`${BASE_URL}/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      return handleResponse(res);
    },
    deleteSkill: async (id) => {
      const res = await fetch(`${BASE_URL}/api/admin/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    // Education
    getEducation: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/education`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    createEducation: async (eduData) => {
      const res = await fetch(`${BASE_URL}/api/admin/education`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eduData)
      });
      return handleResponse(res);
    },
    updateEducation: async (id, eduData) => {
      const res = await fetch(`${BASE_URL}/api/admin/education/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(eduData)
      });
      return handleResponse(res);
    },
    deleteEducation: async (id) => {
      const res = await fetch(`${BASE_URL}/api/admin/education/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    // Certificates
    getCertificates: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/certificates`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    createCertificate: async (certData) => {
      const res = await fetch(`${BASE_URL}/api/admin/certificates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(certData)
      });
      return handleResponse(res);
    },
    updateCertificate: async (id, certData) => {
      const res = await fetch(`${BASE_URL}/api/admin/certificates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(certData)
      });
      return handleResponse(res);
    },
    deleteCertificate: async (id) => {
      const res = await fetch(`${BASE_URL}/api/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    // Messages
    getMessages: async () => {
      const res = await fetch(`${BASE_URL}/api/admin/messages`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    toggleMessageRead: async (id, isRead) => {
      const res = await fetch(`${BASE_URL}/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_read: isRead })
      });
      return handleResponse(res);
    },
    deleteMessage: async (id) => {
      const res = await fetch(`${BASE_URL}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    // Uploads
    uploadImage: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('harish_portfolio_token');
      const res = await fetch(`${BASE_URL}/api/admin/upload/image`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      return handleResponse(res);
    },
    uploadResume: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('harish_portfolio_token');
      const res = await fetch(`${BASE_URL}/api/admin/upload/resume`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      return handleResponse(res);
    }
  }
};
