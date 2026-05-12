// ============================================
// DISNAKER WEB - Authentication System
// ============================================

const Auth = {
  SESSION_KEY: 'disnaker_session',

  login(email, password) {
    const user = DB.getUserByEmail(email);
    if (!user) return { success: false, message: 'Email tidak terdaftar.' };
    if (user.password !== password) return { success: false, message: 'Password salah.' };
    sessionStorage.setItem(Auth.SESSION_KEY, JSON.stringify({ userId: user.id, role: user.role, loginAt: new Date().toISOString() }));
    return { success: true, user };
  },

  logout() {
    sessionStorage.removeItem(Auth.SESSION_KEY);
    window.location.href = '/pages/login.html';
  },

  getSession() {
    try { return JSON.parse(sessionStorage.getItem(Auth.SESSION_KEY)); } catch { return null; }
  },

  getCurrentUser() {
    const session = Auth.getSession();
    if (!session) return null;
    return DB.getUserById(session.userId);
  },

  isLoggedIn() { return !!Auth.getSession(); },

  getRole() {
    const session = Auth.getSession();
    return session ? session.role : null;
  },

  isAdmin()   { return Auth.getRole() === 'admin'; },
  isCompany() { return Auth.getRole() === 'company'; },
  isUser()    { return Auth.getRole() === 'user'; },

  requireAuth(allowedRoles = []) {
    if (!Auth.isLoggedIn()) { window.location.href = '/pages/login.html'; return false; }
    if (allowedRoles.length > 0 && !allowedRoles.includes(Auth.getRole())) {
      window.location.href = '/index.html';
      return false;
    }
    return true;
  },

  register(userData) {
    if (DB.getUserByEmail(userData.email)) return { success: false, message: 'Email sudah terdaftar.' };
    if (!Utils.validateEmail(userData.email)) return { success: false, message: 'Format email tidak valid.' };
    if (userData.password.length < 6) return { success: false, message: 'Password minimal 6 karakter.' };
    const user = DB.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      phone: userData.phone || '',
      companyName: userData.companyName || '',
      companyAddress: userData.companyAddress || '',
      companyIndustry: userData.companyIndustry || '',
      companyDescription: userData.companyDescription || '',
      skills: userData.skills || [],
      education: userData.education || '',
      experience: userData.experience || 0,
      salaryPreference: userData.salaryPreference || 0
    });
    return { success: true, user };
  }
};
