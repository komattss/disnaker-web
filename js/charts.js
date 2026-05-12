// ============================================
// DISNAKER WEB - Dashboard Charts (Chart.js)
// ============================================

const Charts = {
  colors: {
    primary: '#4c6ef5',
    accent: '#20c997',
    warning: '#fab005',
    danger: '#fa5252',
    info: '#339af0',
    purple: '#7950f2',
    pink: '#e64980',
    teal: '#12b886',
    orange: '#fd7e14',
    gray: '#adb5bd'
  },

  palette: ['#4c6ef5', '#20c997', '#fab005', '#fa5252', '#339af0', '#7950f2', '#e64980', '#12b886', '#fd7e14', '#adb5bd', '#845ef7', '#22b8cf'],

  renderJobsByCategory(canvasId) {
    const stats = DB.getStats();
    const data = stats.jobsByCategory;
    if (!data.length) return;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: Charts.palette.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { family: "'Inter', sans-serif", size: 12 }, usePointStyle: true, pointStyleWidth: 10 } }
        },
        cutout: '65%'
      }
    });
  },

  renderJobsByStatus(canvasId) {
    const stats = DB.getStats();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Terverifikasi', 'Menunggu', 'Ditolak'],
        datasets: [{
          label: 'Jumlah Lowongan',
          data: [stats.verifiedJobs, stats.pendingJobs, stats.rejectedJobs],
          backgroundColor: [Charts.colors.accent + 'CC', Charts.colors.warning + 'CC', Charts.colors.danger + 'CC'],
          borderColor: [Charts.colors.accent, Charts.colors.warning, Charts.colors.danger],
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Inter', sans-serif" } }, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { ticks: { font: { family: "'Inter', sans-serif" } }, grid: { display: false } }
        }
      }
    });
  },

  renderApplicationsTrend(canvasId) {
    const apps = DB.getApplications();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    // Group by month
    const months = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    apps.forEach(a => {
      const d = new Date(a.appliedAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      months[key] = (months[key] || 0) + 1;
    });
    const labels = Object.keys(months);
    const values = Object.values(months);
    // If insufficient data, add some placeholder months
    if (labels.length < 2) {
      const now = new Date();
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (!months[key]) { labels.unshift(key); values.unshift(0); }
      }
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Lamaran',
          data: values,
          borderColor: Charts.colors.primary,
          backgroundColor: Charts.colors.primary + '20',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: Charts.colors.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Inter', sans-serif" } }, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { ticks: { font: { family: "'Inter', sans-serif" } }, grid: { display: false } }
        }
      }
    });
  }
};
