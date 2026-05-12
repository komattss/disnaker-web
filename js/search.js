// ============================================
// DISNAKER WEB - Search & Filter
// ============================================

const Search = {
  filterJobs(jobs, filters = {}) {
    return jobs.filter(job => {
      // Keyword search (title, company, description)
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        const searchable = `${job.title} ${job.company} ${job.description} ${(job.skills||[]).join(' ')}`.toLowerCase();
        if (!searchable.includes(kw)) return false;
      }
      // Location filter
      if (filters.location && filters.location !== 'all') {
        if (job.location !== filters.location) return false;
      }
      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (job.category !== filters.category) return false;
      }
      // Salary range filter
      if (filters.salaryMin) {
        if ((job.salaryMax || 0) < Number(filters.salaryMin)) return false;
      }
      if (filters.salaryMax) {
        if ((job.salaryMin || 0) > Number(filters.salaryMax)) return false;
      }
      // Education filter
      if (filters.education && filters.education !== 'all') {
        if (job.education !== filters.education) return false;
      }
      // Experience filter
      if (filters.experience !== undefined && filters.experience !== '' && filters.experience !== 'all') {
        if (job.experience > Number(filters.experience)) return false;
      }
      // Type filter
      if (filters.type && filters.type !== 'all') {
        if (job.type !== filters.type) return false;
      }
      // Company type filter (Swasta/BUMN)
      if (filters.companyType && filters.companyType !== 'all') {
        if (job.companyType !== filters.companyType) return false;
      }
      return true;
    });
  },

  sortJobs(jobs, sortBy = 'newest') {
    const sorted = [...jobs];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'salary-high':
        sorted.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;
      case 'salary-low':
        sorted.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }
};
