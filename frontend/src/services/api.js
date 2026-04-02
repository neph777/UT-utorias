const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// MANEJO DE TOKEN
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// HELPER PARA PETICIONES AUTENTICADAS
const authFetch = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('No autorizado');
  }
  
  return response;
};

// API ENDPOINTS
export const api = {
  // AUTENTICACIÓN 
login: async (email, password) => {
  console.log('API login llamada con:', email);
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Respuesta status:', response.status);
    
    const data = await response.json();
    console.log('Respuesta data:', data);
    
    if (response.ok && data.access_token) {
      setToken(data.access_token);
      return { success: true, user: data.user };
    }
    
    return { 
      success: false, 
      error: data.message || 'Error al iniciar sesión' 
    };
    
  } catch (error) {
    console.error('Error de red:', error);
    return { 
      success: false, 
      error: 'No se pudo conectar con el servidor' 
    };
  }
},

  
  logout: async () => {
    try {
      await authFetch('/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },
  
  getPerfil: async () => {
    const response = await authFetch('/perfil');
    return response.json();
  },
  
  cambiarPassword: async (data) => {
    const response = await authFetch('/cambiar-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    
    return response.json();
  },
  
  // ADMIN - DASHBOARD 
  getDashboardAdmin: async () => {
    const response = await authFetch('/admin/dashboard');
    return response.json();
  },
  
  // ADMIN - USUARIOS 
  getUsuarios: async (search = '') => {
    const response = await authFetch(`/admin/usuarios?search=${search}`);
    return response.json();
  },
  
  crearUsuario: async (data) => {
    const response = await authFetch('/admin/usuarios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  actualizarUsuario: async (id, data) => {
    const response = await authFetch(`/admin/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  eliminarUsuario: async (id) => {
    const response = await authFetch(`/admin/usuarios/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // ADMIN - GRUPOS 
  getGrupos: async () => {
    const response = await authFetch('/admin/grupos');
    return response.json();
  },
  
  crearGrupo: async (data) => {
    const response = await authFetch('/admin/grupos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  actualizarGrupo: async (id, data) => {
    const response = await authFetch(`/admin/grupos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  eliminarGrupo: async (id) => {
    const response = await authFetch(`/admin/grupos/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  asignarAlumnos: async (grupoId, alumnos) => {
    const response = await authFetch(`/admin/grupos/${grupoId}/asignar-alumnos`, {
      method: 'POST',
      body: JSON.stringify({ alumnos })
    });
    return response.json();
  },
  
  getAlumnosDisponibles: async () => {
    const response = await authFetch('/admin/alumnos-disponibles');
    return response.json();
  },
  
  // ADMIN - EXPEDIENTE 
  getExpedienteAlumno: async (alumnoId) => {
    const response = await authFetch(`/admin/alumnos/${alumnoId}/expediente`);
    return response.json();
  }
};