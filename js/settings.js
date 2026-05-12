// ============================================
// DISNAKER WEB - Settings Module
// ============================================

const Settings = {
  STORAGE_KEY: 'disnaker_settings',

  defaults: {
    theme: 'light',           // 'light' | 'dark'
    fontSize: 'normal',       // 'small' | 'normal' | 'large'
    sidebarCompact: false,
    notifJobNew: true,
    notifJobStatus: true,
    notifApplication: true,
    notifEmail: false,
    language: 'id',
  },

  /** Get all settings, merged with defaults */
  getAll() {
    try {
      const saved = JSON.parse(localStorage.getItem(Settings.STORAGE_KEY));
      return { ...Settings.defaults, ...(saved || {}) };
    } catch { return { ...Settings.defaults }; }
  },

  /** Get one setting value */
  get(key) {
    return Settings.getAll()[key];
  },

  /** Save one or more settings */
  save(data) {
    const current = Settings.getAll();
    const merged = { ...current, ...data };
    localStorage.setItem(Settings.STORAGE_KEY, JSON.stringify(merged));
    return merged;
  },

  /** Reset to defaults */
  reset() {
    localStorage.removeItem(Settings.STORAGE_KEY);
    Settings.applyTheme();
    Settings.applyFontSize();
    return { ...Settings.defaults };
  },

  // ── Theme ──────────────────────────────────
  applyTheme(theme) {
    const t = theme || Settings.get('theme');
    document.documentElement.setAttribute('data-theme', t);
    document.body.classList.toggle('dark-mode', t === 'dark');
  },

  toggleTheme() {
    const current = Settings.get('theme');
    const next = current === 'dark' ? 'light' : 'dark';
    Settings.save({ theme: next });
    Settings.applyTheme(next);
    return next;
  },

  // ── Font Size ──────────────────────────────
  applyFontSize(size) {
    const s = size || Settings.get('fontSize');
    const map = { small: '14px', normal: '15px', large: '17px' };
    document.documentElement.style.fontSize = map[s] || map.normal;
  },

  // ── Apply all settings on page load ────────
  applyAll() {
    Settings.applyTheme();
    Settings.applyFontSize();
  },

  // ── Change Password ────────────────────────
  changePassword(userId, currentPw, newPw) {
    const user = DB.getUserById(userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };
    if (user.password !== currentPw) return { success: false, message: 'Password saat ini salah.' };
    if (newPw.length < 6) return { success: false, message: 'Password baru minimal 6 karakter.' };
    if (currentPw === newPw) return { success: false, message: 'Password baru harus berbeda dari password saat ini.' };
    DB.updateUser(userId, { password: newPw });
    return { success: true, message: 'Password berhasil diubah.' };
  },

  // ── Delete Account ─────────────────────────
  deleteAccount(userId) {
    const users = DB.getUsers().filter(u => u.id !== userId);
    DB.set(DB.KEYS.USERS, users);
    // Clean up applications
    const apps = DB.getApplications().filter(a => a.userId !== userId);
    DB.set(DB.KEYS.APPLICATIONS, apps);
    // Clean up notifications
    const notifs = DB.get(DB.KEYS.NOTIFICATIONS).filter(n => n.userId !== userId);
    DB.set(DB.KEYS.NOTIFICATIONS, notifs);
    Auth.logout();
  },

  // ── Export Data ────────────────────────────
  exportUserData(userId) {
    const user = DB.getUserById(userId);
    if (!user) return null;
    const apps = DB.getApplicationsByUser(userId);
    const notifs = DB.getNotifications(userId);
    const exportData = {
      profile: { ...user, password: '***' },
      applications: apps,
      notifications: notifs,
      settings: Settings.getAll(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disnaker-data-${user.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
