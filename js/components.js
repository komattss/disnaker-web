// ============================================
// DISNAKER WEB - UI Components
// ============================================

const Components = {
  // ── Alert/Toast System ──
  initAlertContainer() {
    if (!document.getElementById('alert-container')) {
      const container = document.createElement('div');
      container.id = 'alert-container';
      container.className = 'alert-container';
      document.body.appendChild(container);
    }
  },

  showAlert(type, title, message, duration = 4000) {
    Components.initAlertContainer();
    const container = document.getElementById('alert-container');
    const icons = { success: 'fa-check-circle', danger: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const id = 'alert_' + Date.now();
    const el = document.createElement('div');
    el.id = id;
    el.className = `alert alert-${type}`;
    el.innerHTML = `
      <i class="fas ${icons[type]} alert-icon"></i>
      <div class="alert-content">
        <div class="alert-title">${title}</div>
        <div class="alert-message">${message}</div>
      </div>
      <button class="alert-close-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(el);
    if (duration > 0) setTimeout(() => { const e = document.getElementById(id); if (e) e.remove(); }, duration);
  },

  // ── SweetAlert-style Dialog ──
  showDialog({ type = 'info', title, text, confirmText = 'OK', cancelText, onConfirm, onCancel }) {
    const icons = { success: 'fa-check', danger: 'fa-times', warning: 'fa-exclamation', info: 'fa-info', question: 'fa-question' };
    const overlay = document.createElement('div');
    overlay.className = 'swal-overlay';
    overlay.innerHTML = `
      <div class="swal-dialog">
        <div class="swal-icon ${type}"><i class="fas ${icons[type]}"></i></div>
        <h3 class="swal-title">${title}</h3>
        <p class="swal-text">${text}</p>
        <div class="swal-buttons">
          ${cancelText ? `<button class="btn btn-outline swal-cancel">${cancelText}</button>` : ''}
          <button class="btn btn-primary swal-confirm">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
    const close = () => { overlay.classList.remove('active'); setTimeout(() => overlay.remove(), 300); };
    overlay.querySelector('.swal-confirm').onclick = () => { close(); if (onConfirm) onConfirm(); };
    if (cancelText) overlay.querySelector('.swal-cancel').onclick = () => { close(); if (onCancel) onCancel(); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  // ── Modal ──
  showModal({ title, body, footer, size = '' }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" ${size ? `style="max-width:${size}"` : ''}>
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="Components.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) Components.closeModal(); });
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.remove('active'); setTimeout(() => overlay.remove(), 300); }
  },

  // ── Sidebar ──
  renderSidebar(currentPage = '') {
    const user = Auth.getCurrentUser();
    const role = user ? user.role : 'guest';
    const pendingCount = role === 'admin' ? DB.getPendingJobs().length : 0;

    const menuItems = {
      admin: [
        { section: 'MENU UTAMA', items: [
          { icon: 'fa-th-large', label: 'Dashboard', href: '/index.html', page: 'dashboard' },
          { icon: 'fa-briefcase', label: 'Lowongan Kerja', href: '/pages/jobs.html', page: 'jobs' },
        ]},
        { section: 'MANAJEMEN', items: [
          { icon: 'fa-check-double', label: 'Verifikasi', href: '/pages/admin-verification.html', page: 'admin-verification', badge: pendingCount },
          { icon: 'fa-users', label: 'Admin Panel', href: '/pages/admin.html', page: 'admin' },
        ]},
        { section: 'LAINNYA', items: [
          { icon: 'fa-cog', label: 'Pengaturan', href: '/pages/settings.html', page: 'settings' },
        ]},
      ],
      company: [
        { section: 'MENU UTAMA', items: [
          { icon: 'fa-th-large', label: 'Dashboard', href: '/index.html', page: 'dashboard' },
          { icon: 'fa-briefcase', label: 'Lowongan Kerja', href: '/pages/jobs.html', page: 'jobs' },
        ]},
        { section: 'PERUSAHAAN', items: [
          { icon: 'fa-plus-circle', label: 'Pasang Lowongan', href: '/pages/post-job.html', page: 'post-job' },
          { icon: 'fa-user', label: 'Profil', href: '/pages/profile.html', page: 'profile' },
        ]},
        { section: 'LAINNYA', items: [
          { icon: 'fa-cog', label: 'Pengaturan', href: '/pages/settings.html', page: 'settings' },
        ]},
      ],
      user: [
        { section: 'MENU UTAMA', items: [
          { icon: 'fa-th-large', label: 'Dashboard', href: '/index.html', page: 'dashboard' },
          { icon: 'fa-briefcase', label: 'Lowongan Kerja', href: '/pages/jobs.html', page: 'jobs' },
        ]},
        { section: 'AKUN SAYA', items: [
          { icon: 'fa-file-alt', label: 'Lamaran Saya', href: '/pages/my-applications.html', page: 'my-applications' },
          { icon: 'fa-user', label: 'Profil', href: '/pages/profile.html', page: 'profile' },
        ]},
        { section: 'LAINNYA', items: [
          { icon: 'fa-cog', label: 'Pengaturan', href: '/pages/settings.html', page: 'settings' },
        ]},
      ],
      guest: [
        { section: 'MENU', items: [
          { icon: 'fa-th-large', label: 'Dashboard', href: '/index.html', page: 'dashboard' },
          { icon: 'fa-briefcase', label: 'Lowongan Kerja', href: '/pages/jobs.html', page: 'jobs' },
        ]},
      ]
    };

    const sections = menuItems[role] || menuItems.guest;
    let navHtml = '';
    sections.forEach(section => {
      navHtml += `<div class="sidebar-section"><div class="sidebar-section-title">${section.section}</div>`;
      section.items.forEach(item => {
        const isActive = currentPage === item.page ? 'active' : '';
        const badge = item.badge ? `<span class="badge">${item.badge}</span>` : '';
        navHtml += `<a href="${item.href}" class="sidebar-link ${isActive}"><i class="fas ${item.icon}"></i><span>${item.label}</span>${badge}</a>`;
      });
      navHtml += `</div>`;
    });

    let footerHtml = '';
    if (user) {
      const initials = Utils.getInitials(user.name);
      footerHtml = `
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
              <div class="user-name">${Utils.escapeHtml(user.name)}</div>
              <div class="user-role">${user.role}</div>
            </div>
          </div>
          <a href="#" onclick="Auth.logout(); return false;" class="sidebar-link" style="margin-top: var(--space-2);">
            <i class="fas fa-sign-out-alt"></i><span>Keluar</span>
          </a>
        </div>`;
    } else {
      footerHtml = `
        <div class="sidebar-footer">
          <a href="/pages/login.html" class="btn btn-primary btn-block"><i class="fas fa-sign-in-alt"></i> Masuk</a>
        </div>`;
    }

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <a href="/index.html" class="brand-logo-link">
            <img src="/assets/logo.svg" alt="Disnakerja Logo" class="brand-logo-img">
          </a>
        </div>
        <nav class="sidebar-nav">${navHtml}</nav>
        ${footerHtml}
      </aside>
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
    `;
  },

  // ── Navbar ──
  renderNavbar(title = 'Dashboard') {
    const user = Auth.getCurrentUser();
    const unread = user ? DB.getUnreadCount(user.id) : 0;
    return `
      <header class="navbar" id="navbar">
        <div class="navbar-left">
          <button class="menu-toggle" id="menu-toggle" onclick="Components.toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>
          <h2 class="navbar-title">${title}</h2>
        </div>
        <div class="navbar-right">
          ${user ? `
            <button class="navbar-icon-btn" onclick="Components.showNotifications()" title="Notifikasi">
              <i class="fas fa-bell"></i>
              ${unread > 0 ? '<span class="notification-dot"></span>' : ''}
            </button>
          ` : ''}
        </div>
      </header>
    `;
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('active');
  },

  // ── Notification Panel ──
  showNotifications() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const notifs = DB.getNotifications(user.id);
    const typeIcons = { success: 'fa-check-circle text-success', info: 'fa-info-circle text-info', warning: 'fa-exclamation-circle text-warning', danger: 'fa-times-circle text-danger' };
    let body = '';
    if (notifs.length === 0) {
      body = '<div class="empty-state"><p>Tidak ada notifikasi.</p></div>';
    } else {
      body = `<div style="max-height:400px;overflow-y:auto;">`;
      notifs.forEach(n => {
        body += `<div style="padding:var(--space-3) 0;border-bottom:1px solid var(--border-color);display:flex;gap:var(--space-3);align-items:flex-start;opacity:${n.read ? '0.6' : '1'}">
          <i class="fas ${typeIcons[n.type] || typeIcons.info}" style="margin-top:3px;"></i>
          <div><div style="font-size:var(--font-size-sm);">${n.message}</div><div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:var(--space-1);">${Utils.timeAgo(n.createdAt)}</div></div>
        </div>`;
      });
      body += '</div>';
    }
    const footer = notifs.some(n => !n.read) ? `<button class="btn btn-sm btn-outline" onclick="DB.markAllNotifsRead('${user.id}');Components.closeModal();Components.showAlert('success','Notifikasi','Semua telah dibaca.');">Tandai semua dibaca</button>` : '';
    Components.showModal({ title: 'Notifikasi', body, footer });
  },

  // ── Job Card ──
  renderJobCard(job, options = {}) {
    const initials = Utils.getInitials(job.company);
    const salary = Utils.salaryRange(job.salaryMin, job.salaryMax);
    const timeAgo = Utils.timeAgo(job.createdAt);
    const statusLabels = { verified: 'Terverifikasi', pending: 'Menunggu', rejected: 'Ditolak' };
    const statusBadge = options.showStatus ? `<span class="verified-badge ${job.status}" role="status" aria-label="Status: ${statusLabels[job.status] || job.status}">${job.status === 'verified' ? '<i class="fas fa-check-circle"></i> Terverifikasi' : job.status === 'pending' ? '<i class="fas fa-clock"></i> Menunggu' : '<i class="fas fa-times-circle"></i> Ditolak'}</span>` : '';

    const skills = (job.skills || []).slice(0, 3).map(s => `<span class="tag">${Utils.escapeHtml(s)}</span>`).join('');

    return `
      <div class="job-card fade-in" onclick="window.location.href='/pages/job-detail.html?id=${job.id}'">
        <div class="job-header">
          <div>
            <div class="job-title">${Utils.escapeHtml(job.title)}</div>
            <div class="job-company">${Utils.escapeHtml(job.company)}</div>
          </div>
          <div class="job-company-logo">${initials}</div>
        </div>
        <div class="job-meta">
          <span class="job-meta-item"><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(job.location)}</span>
          <span class="job-meta-item"><i class="fas fa-folder"></i> ${Utils.escapeHtml(job.category)}</span>
          <span class="job-meta-item"><i class="fas fa-clock"></i> ${job.type || 'Full-time'}</span>
        </div>
        <div class="job-tags">${skills}</div>
        <div class="job-footer">
          <span class="job-salary">${salary}</span>
          <div style="display:flex;align-items:center;gap:var(--space-2);">${statusBadge}<span class="job-date">${timeAgo}</span></div>
        </div>
      </div>
    `;
  },

  // ── Job Card with Match Score ──
  renderJobCardWithMatch(job, matchScore) {
    const initials = Utils.getInitials(job.company);
    const salary = Utils.salaryRange(job.salaryMin, job.salaryMax);
    const timeAgo = Utils.timeAgo(job.createdAt);
    const matchInfo = Recommendation.getMatchLabel(matchScore);
    const skills = (job.skills || []).slice(0, 3).map(s => `<span class="tag">${Utils.escapeHtml(s)}</span>`).join('');
    const typeLabel = job.companyType === 'bumn'
      ? '<span class="badge badge-info" style="font-size:0.6rem;" role="status" aria-label="Tipe perusahaan: BUMN"><i class="fas fa-landmark" style="margin-right:3px;"></i>BUMN</span>'
      : '<span class="badge badge-neutral" style="font-size:0.6rem;" role="status" aria-label="Tipe perusahaan: Swasta"><i class="fas fa-building" style="margin-right:3px;"></i>Swasta</span>';

    return `
      <div class="job-card job-card-recommend fade-in" onclick="window.location.href='/pages/job-detail.html?id=${job.id}'" style="--card-index:${job._idx || 0}">
        <div class="match-score-badge ${matchInfo.class}" role="status" aria-label="Kecocokan: ${matchScore} persen">
          <i class="fas ${matchInfo.icon}"></i>
          <span>${matchScore}%</span>
        </div>
        <div class="job-header">
          <div>
            <div class="job-title">${Utils.escapeHtml(job.title)}</div>
            <div class="job-company">${Utils.escapeHtml(job.company)} ${typeLabel}</div>
          </div>
          <div class="job-company-logo">${initials}</div>
        </div>
        <div class="job-meta">
          <span class="job-meta-item"><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(job.location)}</span>
          <span class="job-meta-item"><i class="fas fa-folder"></i> ${Utils.escapeHtml(job.category)}</span>
          <span class="job-meta-item"><i class="fas fa-clock"></i> ${job.type || 'Full-time'}</span>
        </div>
        <div class="job-tags">${skills}</div>
        <div class="job-footer">
          <span class="job-salary">${salary}</span>
          <div style="display:flex;align-items:center;gap:var(--space-2);">
            <span class="match-label ${matchInfo.class}" role="status" aria-label="Tingkat kecocokan: ${matchInfo.text}"><i class="fas ${matchInfo.icon}" style="margin-right:3px;"></i>${matchInfo.text}</span>
          </div>
        </div>
      </div>
    `;
  },

  // ── Ticker / Marquee Notification ──
  renderTicker(companies) {
    if (!companies || companies.length === 0) return '';
    const items = companies.map(c => {
      const icon = c.type === 'bumn' ? 'fa-landmark' : 'fa-building';
      const badge = c.type === 'bumn' ? 'badge-info' : 'badge-neutral';
      return `<span class="ticker-item">
        <i class="fas ${icon} ticker-icon"></i>
        <strong>${Utils.escapeHtml(c.name)}</strong>
        sedang mencari
        <em>${Utils.escapeHtml(c.latestJob)}</em>
        ${c.jobCount > 1 ? `dan <strong>${c.jobCount - 1} posisi lainnya</strong>` : ''}
        di <span style="color:var(--primary-400)">${Utils.escapeHtml(c.location)}</span>
        <span class="badge ${badge}" style="font-size:0.6rem;margin-left:4px;">${c.type === 'bumn' ? 'BUMN' : 'Swasta'}</span>
        <span class="ticker-separator">•</span>
      </span>`;
    }).join('');

    // Duplicate items to ensure seamless loop
    return `
      <div class="ticker-bar" id="ticker-bar">
        <div class="ticker-label"><i class="fas fa-bullhorn"></i> INFO</div>
        <div class="ticker-track">
          <div class="ticker-content">${items}${items}</div>
        </div>
      </div>
    `;
  },

  // ── Job Fair Card ──
  renderJobFairCard(fair) {
    const dateStart = new Date(fair.date);
    const dateEnd = fair.endDate ? new Date(fair.endDate) : null;
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const dateStr = `${dateStart.getDate()} - ${dateEnd ? dateEnd.getDate() + ' ' : ''}${months[dateStart.getMonth()]} ${dateStart.getFullYear()}`;
    
    const catColors = {
      'Umum': { bg: 'var(--primary-50)', color: 'var(--primary-600)', icon: 'fa-globe' },
      'Teknologi': { bg: 'var(--info-light)', color: 'var(--info-dark)', icon: 'fa-microchip' },
      'BUMN': { bg: 'var(--accent-50)', color: 'var(--accent-700)', icon: 'fa-landmark' }
    };
    const cat = catColors[fair.category] || catColors['Umum'];

    return `
      <div class="fair-card fade-in">
        <div class="fair-card-icon">
          <i class="fas ${fair.image || 'fa-calendar-check'}"></i>
        </div>
        <div class="fair-card-body">
          <div class="fair-card-badge" style="background:${cat.bg};color:${cat.color}">
            <i class="fas ${cat.icon}"></i> ${Utils.escapeHtml(fair.category)}
          </div>
          <h4 class="fair-card-title">${Utils.escapeHtml(fair.title)}</h4>
          <p class="fair-card-organizer">${Utils.escapeHtml(fair.organizer)}</p>
          <div class="fair-card-meta">
            <span><i class="fas fa-calendar-alt"></i> ${dateStr}</span>
            <span><i class="fas fa-clock"></i> ${fair.time}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(fair.location)}</span>
          </div>
          <div class="fair-card-stats">
            <div class="fair-stat">
              <strong>${fair.companies}</strong>
              <span>Perusahaan</span>
            </div>
            <div class="fair-stat">
              <strong>${fair.vacancies.toLocaleString('id-ID')}</strong>
              <span>Lowongan</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ── Training Card ──
  renderTrainingCard(training) {
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const startDate = new Date(training.startDate);
    const dateStr = `${startDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    const priceStr = training.price === 0 ? 'GRATIS' : `Rp ${training.price.toLocaleString('id-ID')}`;
    const statusColors = {
      'open': { bg: 'var(--success-light)', color: 'var(--success-dark)', text: 'Pendaftaran Dibuka' },
      'upcoming': { bg: 'var(--info-light)', color: 'var(--info-dark)', text: 'Segera Dibuka' }
    };
    const statusInfo = statusColors[training.status] || statusColors['open'];

    return `
      <div class="training-card fade-in">
        <div class="training-card-header">
          <div class="training-icon-box">
            <i class="fas ${training.icon || 'fa-chalkboard-teacher'}"></i>
          </div>
          <div class="training-price-badge ${training.price === 0 ? 'free' : ''}">${priceStr}</div>
        </div>
        <div class="training-card-body">
          <span class="training-status" style="background:${statusInfo.bg};color:${statusInfo.color}">${statusInfo.text}</span>
          <h4 class="training-card-title">${Utils.escapeHtml(training.title)}</h4>
          <p class="training-institution"><i class="fas fa-university"></i> ${Utils.escapeHtml(training.institution)}</p>
          <div class="training-card-meta">
            <span><i class="fas fa-calendar"></i> Mulai ${dateStr}</span>
            <span><i class="fas fa-hourglass-half"></i> ${training.duration}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(training.location)}</span>
          </div>
          <div class="training-skills">
            ${(training.skills || []).slice(0, 4).map(s => `<span class="tag">${Utils.escapeHtml(s)}</span>`).join('')}
          </div>
          <div class="training-card-footer">
            <span class="training-level"><i class="fas fa-layer-group"></i> ${training.level}</span>
            <span class="training-cert"><i class="fas fa-award"></i> ${Utils.escapeHtml(training.certificate)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // ── Skeleton: Stat Cards ──
  renderSkeletonStats(count = 4) {
    let html = '<div class="stats-grid">';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-stat-card">
          <div class="skeleton-icon"></div>
          <div>
            <div class="skeleton-text skeleton-text-lg"></div>
            <div class="skeleton-text skeleton-text-sm"></div>
          </div>
        </div>`;
    }
    html += '</div>';
    return html;
  },

  // ── Skeleton: Job Cards ──
  renderSkeletonJobCards(count = 6) {
    let html = '<div class="jobs-grid">';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-job-card">
          <div class="skeleton-job-header">
            <div class="skeleton-job-lines">
              <div class="skeleton-line skeleton-line-80"></div>
              <div class="skeleton-line skeleton-line-60"></div>
            </div>
            <div class="skeleton-logo"></div>
          </div>
          <div style="display:flex;gap:var(--space-3);">
            <div class="skeleton-line skeleton-line-40"></div>
            <div class="skeleton-line skeleton-line-40"></div>
          </div>
          <div class="skeleton-tags">
            <div class="skeleton-tag"></div>
            <div class="skeleton-tag"></div>
            <div class="skeleton-tag"></div>
          </div>
          <div class="skeleton-footer">
            <div class="skeleton-line" style="width:80px;height:16px;"></div>
            <div class="skeleton-line" style="width:50px;height:12px;"></div>
          </div>
        </div>`;
    }
    html += '</div>';
    return html;
  },

  // ── Empty State with Illustration + CTA ──
  renderEmptyState({ icon = 'fa-inbox', title = 'Tidak ada data', description = '', ctaText = '', ctaHref = '', ctaIcon = 'fa-arrow-right' } = {}) {
    return `
      <div class="empty-state fade-in">
        <div class="empty-illustration">
          <i class="fas ${icon}"></i>
        </div>
        <h3>${title}</h3>
        ${description ? `<p>${description}</p>` : ''}
        ${ctaText ? `<a href="${ctaHref}" class="btn btn-primary"><i class="fas ${ctaIcon}"></i> ${ctaText}</a>` : ''}
      </div>
    `;
  },

  // ── Layout Shell ──
  renderLayout(currentPage, navbarTitle, contentHtml) {
    document.body.innerHTML = `
      <div class="app-layout">
        ${Components.renderSidebar(currentPage)}
        <div class="main-content">
          ${Components.renderNavbar(navbarTitle)}
          <div class="page-content">${contentHtml}</div>
        </div>
      </div>
    `;
    // close sidebar on overlay click
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.addEventListener('click', Components.toggleSidebar);
  }
};

