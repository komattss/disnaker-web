// ============================================
// DISNAKER WEB - Utility Functions
// ============================================

const Utils = {
  generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  },

  formatDateShort(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  },

  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 30) return `${diffDays} hari lalu`;
    return Utils.formatDateShort(dateStr);
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone(phone) {
    return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/[\s-]/g, ''));
  },

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  truncate(str, maxLen = 100) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen) + '...';
  },

  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  },

  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  },

  getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  setUrlParam(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
  },

  salaryRange(min, max) {
    if (!min && !max) return 'Negotiable';
    if (min && max) return `${Utils.formatCurrency(min)} - ${Utils.formatCurrency(max)}`;
    if (min) return `Dari ${Utils.formatCurrency(min)}`;
    return `Hingga ${Utils.formatCurrency(max)}`;
  },

  educationLevels: ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'],
  educationScore(level) {
    const index = Utils.educationLevels.indexOf(level);
    return index >= 0 ? (index + 1) / Utils.educationLevels.length : 0;
  },

  categories: [
    'Teknologi Informasi', 'Keuangan & Akuntansi', 'Pemasaran', 'Manufaktur',
    'Kesehatan', 'Pendidikan', 'Konstruksi', 'Perhotelan & Pariwisata',
    'Transportasi & Logistik', 'Administrasi', 'Hukum', 'Desain & Kreatif'
  ],

  locations: [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
    'Yogyakarta', 'Palembang', 'Denpasar', 'Malang', 'Bekasi', 'Tangerang'
  ],

  skills: [
    'JavaScript', 'Python', 'Java', 'PHP', 'HTML/CSS', 'React', 'Node.js',
    'SQL', 'Excel', 'Communication', 'Leadership', 'Problem Solving',
    'Data Analysis', 'Project Management', 'Marketing Digital', 'Desain Grafis',
    'Akuntansi', 'Customer Service', 'Public Speaking', 'Bahasa Inggris'
  ]
};
