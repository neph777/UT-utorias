const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// MANEJO DE TOKEN
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// HELPER PARA PETICIONES AUTENTICADAS
const authFetch = async (url, options = {}) => {
  const token = getToken();
  console.log(`authFetch: ${url}, Token: ${token ? 'Sí' : 'No'}`);
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    console.log(`Respuesta ${url}:`, response.status);
    
    if (response.status === 401) {
      console.log('401 detectado, eliminando token');
      removeToken();
      window.location.href = '/login';
      throw new Error('No autorizado');
    }
    
    if (!response.ok) {
      console.log(`Error ${response.status} en ${url}`);
      const errorData = await response.json().catch(() => ({}));
      console.log('Error details:', errorData);
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Error en authFetch para ${url}:`, error);
    throw error;
  }
};

// API ENDPOINTS
export const api = {
  // AUTENTICACIÓN 
login: async (email, password) => {
  console.log('API login llamada con:', email);
  console.log('URL:', `${API_URL}/login`);
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Respuesta status:', response.status);
    console.log('Respuesta ok?', response.ok);
    
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
  
  // Modifica la función getPerfil en api.js
  getPerfil: async () => {
  console.log('=== getPerfil iniciado ===');
  const token = getToken();
  console.log('Token existe:', !!token);
  
  if (!token) {
    console.log('No hay token');
    throw new Error('No hay token');
  }
  
  try {
    const response = await authFetch('/perfil');
    console.log('Status response:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    // Normalizar los datos del usuario
    return {
      id: data.id,
      email: data.email,
      nombre_completo: data.nombre_completo || data.name,
      rol: data.rol,
      name: data.nombre_completo || data.name
    };
  } catch (error) {
    console.error('Error en getPerfil:', error);
    throw error;
  }
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
  const data = await response.json();
  
  // Asegurar que cada grupo tenga la propiedad 'alumnos'
  if (Array.isArray(data)) {
    return data.map(grupo => ({
      ...grupo,
      alumnos: grupo.alumnos || []
    }));
  }
  return data;
},

getAlumnosDisponibles: async () => {
  const response = await authFetch('/admin/alumnos-disponibles');
  const data = await response.json();
  
  // Asegurar que los alumnos tengan las propiedades necesarias
  if (Array.isArray(data)) {
    return data.map(alumno => ({
      id: alumno.id,
      nombre_completo: alumno.nombre_completo,
      nombre: alumno.nombre_completo, // Para compatibilidad
      email: alumno.email,
      matricula: alumno.matricula || alumno.email,
      semaforo: alumno.semaforo || 'verde',
      carrera: alumno.carrera || 'No especificada'
    }));
  }
  return [];
},

asignarAlumnos: async (grupoId, alumnosIds) => {
  const response = await authFetch(`/admin/grupos/${grupoId}/asignar-alumnos`, {
    method: 'POST',
    body: JSON.stringify({ alumnos: alumnosIds })
  });
  return response.json();
},
  
  // ADMIN - EXPEDIENTE 
  getExpedienteAlumno: async (alumnoId) => {
    const response = await authFetch(`/admin/alumnos/${alumnoId}/expediente`);
    return response.json();
  }
};