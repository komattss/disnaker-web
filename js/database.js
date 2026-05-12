// ============================================
// DISNAKER WEB - LocalStorage Database Layer
// ============================================

const DB = {
  KEYS: {
    USERS: 'disnaker_users',
    JOBS: 'disnaker_jobs',
    APPLICATIONS: 'disnaker_applications',
    NOTIFICATIONS: 'disnaker_notifications',
    JOB_FAIRS: 'disnaker_job_fairs',
    TRAININGS: 'disnaker_trainings',
    INITIALIZED: 'disnaker_initialized'
  },

  init() {
    if (!localStorage.getItem(DB.KEYS.INITIALIZED)) {
      DB.set(DB.KEYS.USERS, SeedData.users);
      DB.set(DB.KEYS.JOBS, SeedData.jobs);
      DB.set(DB.KEYS.APPLICATIONS, SeedData.applications);
      DB.set(DB.KEYS.NOTIFICATIONS, SeedData.notifications);
      DB.set(DB.KEYS.JOB_FAIRS, SeedData.jobFairs || []);
      DB.set(DB.KEYS.TRAININGS, SeedData.trainings || []);
      localStorage.setItem(DB.KEYS.INITIALIZED, 'true');
    }
    // Migrate: add new data if missing from old initialization
    if (!localStorage.getItem(DB.KEYS.JOB_FAIRS)) {
      DB.set(DB.KEYS.JOB_FAIRS, SeedData.jobFairs || []);
    }
    if (!localStorage.getItem(DB.KEYS.TRAININGS)) {
      DB.set(DB.KEYS.TRAININGS, SeedData.trainings || []);
    }
  },

  reset() {
    Object.values(DB.KEYS).forEach(key => localStorage.removeItem(key));
    DB.init();
  },

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  },

  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // ── Users ──
  getUsers()         { return DB.get(DB.KEYS.USERS); },
  getUserById(id)    { return DB.getUsers().find(u => u.id === id); },
  getUserByEmail(e)  { return DB.getUsers().find(u => u.email === e); },

  createUser(user) {
    const users = DB.getUsers();
    user.id = Utils.generateId();
    user.createdAt = new Date().toISOString();
    users.push(user);
    DB.set(DB.KEYS.USERS, users);
    return user;
  },

  updateUser(id, data) {
    const users = DB.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    DB.set(DB.KEYS.USERS, users);
    return users[idx];
  },

  // ── Jobs ──
  getJobs()       { return DB.get(DB.KEYS.JOBS); },
  getJobById(id)  { return DB.getJobs().find(j => j.id === id); },

  getVerifiedJobs() {
    return DB.getJobs().filter(j => j.status === 'verified');
  },

  getPendingJobs() {
    return DB.getJobs().filter(j => j.status === 'pending');
  },

  getJobsByCompany(companyId) {
    return DB.getJobs().filter(j => j.companyId === companyId);
  },

  createJob(job) {
    const jobs = DB.getJobs();
    job.id = Utils.generateId();
    job.status = 'pending';
    job.createdAt = new Date().toISOString();
    jobs.push(job);
    DB.set(DB.KEYS.JOBS, jobs);
    DB.addNotification(job.companyId, `Lowongan "${job.title}" telah disubmit dan menunggu verifikasi.`, 'info');
    return job;
  },

  updateJob(id, data) {
    const jobs = DB.getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    jobs[idx] = { ...jobs[idx], ...data };
    DB.set(DB.KEYS.JOBS, jobs);
    return jobs[idx];
  },

  deleteJob(id) {
    const jobs = DB.getJobs().filter(j => j.id !== id);
    DB.set(DB.KEYS.JOBS, jobs);
  },

  // ── Applications ──
  getApplications() { return DB.get(DB.KEYS.APPLICATIONS); },

  getApplicationsByUser(userId) {
    return DB.getApplications().filter(a => a.userId === userId);
  },

  getApplicationsByJob(jobId) {
    return DB.getApplications().filter(a => a.jobId === jobId);
  },

  hasApplied(userId, jobId) {
    return DB.getApplications().some(a => a.userId === userId && a.jobId === jobId);
  },

  createApplication(app) {
    const apps = DB.getApplications();
    app.id = Utils.generateId();
    app.status = 'pending';
    app.appliedAt = new Date().toISOString();
    apps.push(app);
    DB.set(DB.KEYS.APPLICATIONS, apps);
    const job = DB.getJobById(app.jobId);
    if (job) {
      DB.addNotification(job.companyId, `Ada lamaran baru untuk posisi "${job.title}".`, 'info');
    }
    return app;
  },

  updateApplication(id, data) {
    const apps = DB.getApplications();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return null;
    apps[idx] = { ...apps[idx], ...data };
    DB.set(DB.KEYS.APPLICATIONS, apps);
    return apps[idx];
  },


  // ── Notifications ──
  getNotifications(userId) {
    return DB.get(DB.KEYS.NOTIFICATIONS).filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getUnreadCount(userId) {
    return DB.getNotifications(userId).filter(n => !n.read).length;
  },

  addNotification(userId, message, type = 'info') {
    const notifs = DB.get(DB.KEYS.NOTIFICATIONS);
    notifs.push({
      id: Utils.generateId(),
      userId, message, type,
      read: false,
      createdAt: new Date().toISOString()
    });
    DB.set(DB.KEYS.NOTIFICATIONS, notifs);
  },

  markNotifRead(id) {
    const notifs = DB.get(DB.KEYS.NOTIFICATIONS);
    const n = notifs.find(n => n.id === id);
    if (n) n.read = true;
    DB.set(DB.KEYS.NOTIFICATIONS, notifs);
  },

  markAllNotifsRead(userId) {
    const notifs = DB.get(DB.KEYS.NOTIFICATIONS);
    notifs.filter(n => n.userId === userId).forEach(n => n.read = true);
    DB.set(DB.KEYS.NOTIFICATIONS, notifs);
  },

  // ── Company Type Queries ──
  getJobsByCompanyType(type) {
    return DB.getVerifiedJobs().filter(j => j.companyType === type);
  },

  getHiringCompanies() {
    const verifiedJobs = DB.getVerifiedJobs();
    const companyMap = {};
    verifiedJobs.forEach(job => {
      if (!companyMap[job.company]) {
        companyMap[job.company] = {
          name: job.company,
          type: job.companyType || 'swasta',
          jobCount: 0,
          latestJob: job.title,
          location: job.location,
          category: job.category
        };
      }
      companyMap[job.company].jobCount++;
    });
    return Object.values(companyMap);
  },

  // ── Stats ──
  getStats() {
    const jobs = DB.getJobs();
    const users = DB.getUsers();
    const apps = DB.getApplications();
    return {
      totalJobs: jobs.length,
      verifiedJobs: jobs.filter(j => j.status === 'verified').length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      rejectedJobs: jobs.filter(j => j.status === 'rejected').length,
      totalUsers: users.filter(u => u.role === 'user').length,
      totalCompanies: users.filter(u => u.role === 'company').length,
      totalApplications: apps.length,
      jobsByCategory: Utils.categories.map(c => ({ name: c, count: jobs.filter(j => j.category === c).length })).filter(c => c.count > 0),
      jobsByStatus: [
        { name: 'Terverifikasi', count: jobs.filter(j => j.status === 'verified').length },
        { name: 'Menunggu', count: jobs.filter(j => j.status === 'pending').length },
        { name: 'Ditolak', count: jobs.filter(j => j.status === 'rejected').length }
      ]
    };
  },

  // ── Job Fairs ──
  getJobFairs() { return DB.get(DB.KEYS.JOB_FAIRS); },
  getUpcomingJobFairs() {
    return DB.getJobFairs().filter(jf => jf.status === 'upcoming').sort((a,b) => new Date(a.date) - new Date(b.date));
  },

  // ── Trainings ──
  getTrainings() { return DB.get(DB.KEYS.TRAININGS); },
  getOpenTrainings() {
    return DB.getTrainings().filter(t => t.status === 'open' || t.status === 'upcoming').sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
  }
};
