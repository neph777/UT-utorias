const translations = {
  es: {
    // ── Login ──
    login: {
      title: 'Iniciar sesión',
      subtitle: 'Ingresa con tu cuenta institucional',
      userType: 'Tipo de usuario',
      email: 'Correo institucional',
      emailPlaceholder: 'ejemplo@utn.edu.mx',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      submit: 'Ingresar al sistema',
      loading: 'Verificando...',
      helpText: '¿Problemas para acceder?',
      heroTitle: 'Sistema de\nTutorías UTN',
      heroSubtitle: 'Seguimiento académico integral para alumnos, tutores y directivos de la Universidad Tecnológica de Nayarit.',
      mobileTitle: 'Sistema de Tutorías',
      mobileSubtitle: 'Universidad Tecnológica de Nayarit',
      stats: {
        students: 'Alumnos',
        tutors: 'Tutores',
        groups: 'Grupos',
      },
      roles: {
        alumno: { label: 'Alumno', description: 'Consulta tus tutorías y compromisos' },
        tutor: { label: 'Maestro / Tutor', description: 'Gestiona el seguimiento de tus grupos' },
        admin: { label: 'Asesor / Director', description: 'Supervisión general del programa' },
      },
      errors: {
        invalidEmail: 'Ingresa un correo electrónico válido.',
        shortPassword: 'La contraseña debe tener al menos 4 caracteres.',
        generic: 'Error al iniciar sesión. Verifica tus credenciales.',
      },
    },

    // ── Header / Layout ──
    header: {
      changePassword: 'Cambiar contraseña',
      logout: 'Cerrar Sesión',
      home: 'Inicio',
    },

    // ── Footer ──
    footer: {
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      contact: 'Contacto',
    },

    // ── Roles ──
    roles: {
      alumno: 'Alumno',
      maestro: 'Tutor / Maestro',
      tutor: 'Tutor / Maestro',
      admin: 'Asesor / Director',
    },

    // ── CambiarPassword ──
    changePassword: {
      title: 'Cambiar Contraseña',
      current: 'Contraseña actual',
      new: 'Nueva contraseña',
      confirm: 'Confirmar nueva contraseña',
      submit: 'Actualizar contraseña',
      cancel: 'Cancelar',
      saving: 'Actualizando...',
      success: 'Contraseña actualizada correctamente',
      errors: {
        required: 'Por favor completa todos los campos.',
        mismatch: 'Las contraseñas nuevas no coinciden.',
        short: 'La nueva contraseña debe tener al menos 6 caracteres.',
      },
    },

    // ── Dashboard Alumno ──
    dashboardAlumno: {
      welcome: 'Bienvenido',
      subtitle: 'Aquí puedes consultar tu historial y próximas tutorías',
      average: 'Mi Promedio',
      cycle: 'Ciclo actual',
      tutoriasReceived: 'Tutorías Recibidas',
      semester: 'Este semestre',
      nextTutoria: 'Próxima Tutoría',
      nextTutoriaTime: '10:00 AM — Individual',
      historyTitle: 'Historial de Tutorías',
      table: {
        date: 'Fecha',
        type: 'Tipo',
        commitments: 'Compromisos',
        status: 'Estado',
        fulfilled: 'Cumplido',
        pending: 'Pendiente',
      },
    },

    // ── Dashboard Maestro ──
    dashboardMaestro: {
      title: 'Panel del Tutor',
      subtitle: 'Gestiona el seguimiento académico de tus grupos',
      loading: 'Cargando datos...',
      studentsInGroup: 'Alumnos en el Grupo',
      requireAttention: 'Requieren Atención',
      tutoriasCompleted: 'Tutorías Realizadas',
      noStudents: 'No hay alumnos en este grupo',
      generateReport: 'Generar Reporte',
      report: 'Reporte',
      group: 'Grupo',
      selectStudents: 'Seleccionar alumnos',
      optional: 'opcional',
      download: 'Descargar Reporte',
      cancel: 'Cancelar',
      table: {
        matricula: 'Matrícula',
        name: 'Nombre',
        average: 'Promedio',
        status: 'Estado',
        lastTutoria: 'Última Tutoría',
        actions: 'Acciones',
        noTutorias: 'Sin tutorías',
        notAvailable: 'N/A',
      },
      semaforo: {
        rojo: 'Prioridad Alta',
        amarillo: 'Seguimiento',
        verde: 'Estable',
      },
      actions: {
        tutoria: 'Tutoría',
        expediente: 'Expediente',
      },
    },

    // ── Dashboard Admin ──
    dashboardAdmin: {
      title: 'Panel Administrativo',
      subtitle: 'Supervisión general del programa de tutorías',
      users: 'Usuarios',
      groups: 'Grupos',
      semaforo: 'Semáforo',
      backup: 'Respaldo',
      manageUsers: 'Gestionar Usuarios',
      manageGroups: 'Gestionar Grupos',
      viewSemaforo: 'Ver Semáforo',
      manageBackup: 'Gestionar Respaldo',
    },

    // ── Gestión Usuarios ──
    gestionUsuarios: {
      title: 'Gestión de Usuarios',
      subtitle: 'Administra los usuarios del sistema',
      newUser: 'Nuevo Usuario',
      search: 'Buscar...',
      table: {
        name: 'Nombre',
        email: 'Correo',
        role: 'Rol',
        status: 'Estado',
        actions: 'Acciones',
        active: 'Activo',
        inactive: 'Inactivo',
      },
      actions: {
        edit: 'Editar',
        delete: 'Eliminar',
      },
    },

    // ── Gestión Grupos ──
    gestionGrupos: {
      title: 'Gestión de Grupos',
      subtitle: 'Administra los grupos del programa',
      newGroup: 'Nuevo Grupo',
      viewStudents: 'Ver Alumnos',
      table: {
        key: 'Clave',
        program: 'Programa',
        tutor: 'Tutor',
        students: 'Alumnos',
        actions: 'Acciones',
      },
    },

    // ── Semáforo ──
    semaforo: {
      title: 'Semáforo Académico',
      subtitle: 'Monitoreo del estado de los alumnos',
      all: 'Todos',
      rojo: 'Prioridad Alta',
      amarillo: 'Seguimiento',
      verde: 'Estable',
      table: {
        student: 'Alumno',
        group: 'Grupo',
        tutor: 'Tutor',
        average: 'Promedio',
        status: 'Estado',
        actions: 'Acciones',
      },
      viewExpediente: 'Ver Expediente',
    },

    // ── Expediente Alumno ──
    expediente: {
      title: 'Expediente del Alumno',
      subtitle: 'Detalle académico y tutorías registradas',
      back: '← Volver',
      downloadPDF: 'Descargar PDF',
      generatingPDF: 'Generando PDF...',
      edit: 'Editar',
      save: 'Guardar cambios',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      noTutorias: 'No hay tutorías registradas',
      errorLoad: 'Error al cargar el expediente del alumno',
      notFound: 'Alumno no encontrado',
      fields: {
        fullName: 'Nombre completo',
        matricula: 'Matrícula',
        group: 'Grupo',
        tutor: 'Tutor',
        average: 'Promedio actual',
        tutoriasReceived: 'Tutorías recibidas',
        lastTutoria: 'Última tutoría',
        academicStatus: 'Estado académico',
        statusReason: 'Razón del estado:',
        noReason: 'Sin razón registrada',
        noTutoriasInfo: 'Sin tutorías',
        stable: 'Estable',
        preventive: 'Seguimiento preventivo',
        highPriority: 'Prioridad alta',
        noStatus: 'Sin estado',
      },
      history: {
        title: 'Historial de tutorías',
        records: 'registros',
        date: 'Fecha',
        tutor: 'Tutor',
        topic: 'Tema',
        commitment: 'Compromiso',
        observations: 'Observaciones',
        notSpecified: 'No especificado',
        noCommitment: 'Sin compromisos',
        noObservations: 'Sin observaciones',
        notAvailable: 'No disponible',
      },
    },

    // ── Registrar Tutoría ──
    registrarTutoria: {
      title: 'Registrar Tutoría',
      subtitle: 'Registra los detalles de la sesión',
      back: '← Volver',
      save: 'Guardar Tutoría',
      saving: 'Guardando...',
      fields: {
        date: 'Fecha',
        type: 'Tipo de Tutoría',
        topic: 'Tema tratado',
        commitment: 'Compromisos',
        observations: 'Observaciones',
        semaforo: 'Estado académico del alumno',
        typePlaceholder: 'Individual, Grupal...',
        topicPlaceholder: 'Describe el tema principal de la tutoría...',
        commitmentPlaceholder: 'Anota los compromisos del alumno...',
        observationsPlaceholder: 'Observaciones adicionales...',
      },
    },

    // ── Semáforo Maestro ──
    semaforoMaestro: {
      title: 'Semáforo de mi Grupo',
      subtitle: 'Estado académico de tus alumnos',
      all: 'Todos',
    },

    // ── Backup ──
    backup: {
      title: 'Gestión de Respaldo',
      subtitle: 'Administra las copias de seguridad del sistema',
      create: 'Crear Respaldo',
      download: 'Descargar',
      restore: 'Restaurar',
    },

    // ── Common ──
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      search: 'Buscar',
      noResults: 'Sin resultados',
      actions: 'Acciones',
      back: 'Volver',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      yes: 'Sí',
      no: 'No',
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // ENGLISH
  // ─────────────────────────────────────────────────────────────────
  en: {
    login: {
      title: 'Sign In',
      subtitle: 'Enter with your institutional account',
      userType: 'User type',
      email: 'Institutional email',
      emailPlaceholder: 'example@utn.edu.mx',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      submit: 'Enter the system',
      loading: 'Verifying...',
      helpText: 'Having trouble accessing?',
      heroTitle: 'Tutoring\nSystem UTN',
      heroSubtitle: 'Comprehensive academic monitoring for students, tutors, and directors of the Universidad Tecnológica de Nayarit.',
      mobileTitle: 'Tutoring System',
      mobileSubtitle: 'Universidad Tecnológica de Nayarit',
      stats: {
        students: 'Students',
        tutors: 'Tutors',
        groups: 'Groups',
      },
      roles: {
        alumno: { label: 'Student', description: 'View your tutoring sessions and commitments' },
        tutor: { label: 'Teacher / Tutor', description: 'Manage your groups\' academic progress' },
        admin: { label: 'Advisor / Director', description: 'General supervision of the program' },
      },
      errors: {
        invalidEmail: 'Please enter a valid email address.',
        shortPassword: 'Password must be at least 4 characters.',
        generic: 'Login failed. Please check your credentials.',
      },
    },

    header: {
      changePassword: 'Change password',
      logout: 'Sign Out',
      home: 'Home',
    },

    footer: {
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      contact: 'Contact',
    },

    roles: {
      alumno: 'Student',
      maestro: 'Tutor / Teacher',
      tutor: 'Tutor / Teacher',
      admin: 'Advisor / Director',
    },

    changePassword: {
      title: 'Change Password',
      current: 'Current password',
      new: 'New password',
      confirm: 'Confirm new password',
      submit: 'Update password',
      cancel: 'Cancel',
      saving: 'Updating...',
      success: 'Password updated successfully',
      errors: {
        required: 'Please fill in all fields.',
        mismatch: 'New passwords do not match.',
        short: 'New password must be at least 6 characters.',
      },
    },

    dashboardAlumno: {
      welcome: 'Welcome',
      subtitle: 'Here you can check your tutoring history and upcoming sessions',
      average: 'My Average',
      cycle: 'Current cycle',
      tutoriasReceived: 'Tutoring Sessions',
      semester: 'This semester',
      nextTutoria: 'Next Session',
      nextTutoriaTime: '10:00 AM — Individual',
      historyTitle: 'Tutoring History',
      table: {
        date: 'Date',
        type: 'Type',
        commitments: 'Commitments',
        status: 'Status',
        fulfilled: 'Fulfilled',
        pending: 'Pending',
      },
    },

    dashboardMaestro: {
      title: 'Tutor Dashboard',
      subtitle: 'Manage the academic progress of your groups',
      loading: 'Loading data...',
      studentsInGroup: 'Students in Group',
      requireAttention: 'Require Attention',
      tutoriasCompleted: 'Sessions Completed',
      noStudents: 'No students in this group',
      generateReport: 'Generate Report',
      report: 'Report',
      group: 'Group',
      selectStudents: 'Select students',
      optional: 'optional',
      download: 'Download Report',
      cancel: 'Cancel',
      table: {
        matricula: 'Student ID',
        name: 'Name',
        average: 'Average',
        status: 'Status',
        lastTutoria: 'Last Session',
        actions: 'Actions',
        noTutorias: 'No sessions',
        notAvailable: 'N/A',
      },
      semaforo: {
        rojo: 'High Priority',
        amarillo: 'Follow-up',
        verde: 'Stable',
      },
      actions: {
        tutoria: 'Session',
        expediente: 'Record',
      },
    },

    dashboardAdmin: {
      title: 'Admin Dashboard',
      subtitle: 'General supervision of the tutoring program',
      users: 'Users',
      groups: 'Groups',
      semaforo: 'Priority Status',
      backup: 'Backup',
      manageUsers: 'Manage Users',
      manageGroups: 'Manage Groups',
      viewSemaforo: 'View Status',
      manageBackup: 'Manage Backup',
    },

    gestionUsuarios: {
      title: 'User Management',
      subtitle: 'Manage system users',
      newUser: 'New User',
      search: 'Search...',
      table: {
        name: 'Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete',
      },
    },

    gestionGrupos: {
      title: 'Group Management',
      subtitle: 'Manage program groups',
      newGroup: 'New Group',
      viewStudents: 'View Students',
      table: {
        key: 'Code',
        program: 'Program',
        tutor: 'Tutor',
        students: 'Students',
        actions: 'Actions',
      },
    },

    semaforo: {
      title: 'Academic Status',
      subtitle: 'Student status monitoring',
      all: 'All',
      rojo: 'High Priority',
      amarillo: 'Follow-up',
      verde: 'Stable',
      table: {
        student: 'Student',
        group: 'Group',
        tutor: 'Tutor',
        average: 'Average',
        status: 'Status',
        actions: 'Actions',
      },
      viewExpediente: 'View Record',
    },

    expediente: {
      title: 'Student Record',
      subtitle: 'Academic detail and registered tutoring sessions',
      back: '← Back',
      downloadPDF: 'Download PDF',
      generatingPDF: 'Generating PDF...',
      edit: 'Edit',
      save: 'Save changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      noTutorias: 'No tutoring sessions registered',
      errorLoad: 'Error loading student record',
      notFound: 'Student not found',
      fields: {
        fullName: 'Full name',
        matricula: 'Student ID',
        group: 'Group',
        tutor: 'Tutor',
        average: 'Current average',
        tutoriasReceived: 'Sessions received',
        lastTutoria: 'Last session',
        academicStatus: 'Academic status',
        statusReason: 'Status reason:',
        noReason: 'No reason registered',
        noTutoriasInfo: 'No sessions',
        stable: 'Stable',
        preventive: 'Preventive follow-up',
        highPriority: 'High priority',
        noStatus: 'No status',
      },
      history: {
        title: 'Tutoring history',
        records: 'records',
        date: 'Date',
        tutor: 'Tutor',
        topic: 'Topic',
        commitment: 'Commitment',
        observations: 'Observations',
        notSpecified: 'Not specified',
        noCommitment: 'No commitments',
        noObservations: 'No observations',
        notAvailable: 'Not available',
      },
    },

    registrarTutoria: {
      title: 'Register Session',
      subtitle: 'Record the details of the session',
      back: '← Back',
      save: 'Save Session',
      saving: 'Saving...',
      fields: {
        date: 'Date',
        type: 'Session Type',
        topic: 'Topic covered',
        commitment: 'Commitments',
        observations: 'Observations',
        semaforo: 'Student academic status',
        typePlaceholder: 'Individual, Group...',
        topicPlaceholder: 'Describe the main topic of the session...',
        commitmentPlaceholder: 'Note the student\'s commitments...',
        observationsPlaceholder: 'Additional observations...',
      },
    },

    semaforoMaestro: {
      title: 'My Group Status',
      subtitle: 'Academic status of your students',
      all: 'All',
    },

    backup: {
      title: 'Backup Management',
      subtitle: 'Manage system backups',
      create: 'Create Backup',
      download: 'Download',
      restore: 'Restore',
    },

    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      search: 'Search',
      noResults: 'No results',
      actions: 'Actions',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      yes: 'Yes',
      no: 'No',
    },
  },
}

export default translations
