// ============================================
// DISNAKER WEB - Recommendation Engine
// Scores job matches based on user profile
// ============================================

const Recommendation = {
  WEIGHTS: {
    skills: 0.40,
    education: 0.20,
    experience: 0.20,
    salary: 0.10,
    history: 0.10
  },

  /**
   * Calculate match score between a user and a job
   * @returns {number} Score from 0-100
   */
  calculateScore(user, job, applications = []) {
    if (!user || !job) return 0;

    const skillScore = Recommendation._skillScore(user.skills || [], job.skills || []);
    const eduScore = Recommendation._educationScore(user.education, job.education);
    const expScore = Recommendation._experienceScore(user.experience || 0, job.experience || 0);
    const salaryScore = Recommendation._salaryScore(user.salaryPreference || 0, job.salaryMin, job.salaryMax);
    const historyScore = Recommendation._historyScore(user.id, job, applications);

    const total =
      skillScore * Recommendation.WEIGHTS.skills +
      eduScore * Recommendation.WEIGHTS.education +
      expScore * Recommendation.WEIGHTS.experience +
      salaryScore * Recommendation.WEIGHTS.salary +
      historyScore * Recommendation.WEIGHTS.history;

    return Math.round(total * 100);
  },

  /**
   * Get recommended jobs sorted by match score
   */
  getRecommendedJobs(user, jobs, applications = []) {
    if (!user || user.role !== 'user') return [];

    const scored = jobs.map(job => ({
      ...job,
      matchScore: Recommendation.calculateScore(user, job, applications)
    }));

    return scored
      .filter(j => j.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Get match label and CSS class based on score
   */
  getMatchLabel(score) {
    if (score >= 70) return { class: 'match-high', text: 'Sangat Cocok', icon: 'fa-fire' };
    if (score >= 40) return { class: 'match-medium', text: 'Cukup Cocok', icon: 'fa-thumbs-up' };
    return { class: 'match-low', text: 'Kurang Cocok', icon: 'fa-circle-info' };
  },

  // ── Private scoring functions ──

  _skillScore(userSkills, jobSkills) {
    if (jobSkills.length === 0) return 0.5;
    const matched = jobSkills.filter(s =>
      userSkills.some(us => us.toLowerCase() === s.toLowerCase())
    ).length;
    return matched / jobSkills.length;
  },

  _educationScore(userEdu, jobEdu) {
    const levels = ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'];
    const userIdx = levels.indexOf(userEdu);
    const jobIdx = levels.indexOf(jobEdu);
    if (userIdx === -1 || jobIdx === -1) return 0.3;
    if (userIdx >= jobIdx) return 1.0;
    if (userIdx === jobIdx - 1) return 0.6;
    return 0.2;
  },

  _experienceScore(userExp, jobExp) {
    if (jobExp === 0) return 1.0;
    if (userExp >= jobExp) return 1.0;
    if (userExp >= jobExp * 0.7) return 0.7;
    if (userExp >= jobExp * 0.5) return 0.4;
    return 0.15;
  },

  _salaryScore(userPref, jobMin, jobMax) {
    if (!userPref || (!jobMin && !jobMax)) return 0.5;
    if (userPref >= jobMin && userPref <= jobMax) return 1.0;
    if (userPref < jobMin) {
      const ratio = userPref / jobMin;
      return ratio >= 0.7 ? 0.7 : 0.3;
    }
    if (userPref > jobMax) {
      const ratio = jobMax / userPref;
      return ratio >= 0.7 ? 0.6 : 0.2;
    }
    return 0.5;
  },

  _historyScore(userId, job, applications) {
    if (!applications || applications.length === 0) return 0.5;
    const userApps = applications.filter(a => a.userId === userId);
    if (userApps.length === 0) return 0.5;

    // Check if user has applied to jobs in the same category
    const appliedJobIds = userApps.map(a => a.jobId);
    const allJobs = typeof DB !== 'undefined' ? DB.getJobs() : [];
    const appliedCategories = allJobs
      .filter(j => appliedJobIds.includes(j.id))
      .map(j => j.category);

    if (appliedCategories.includes(job.category)) return 1.0;
    return 0.3;
  }
};
