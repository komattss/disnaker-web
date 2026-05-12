// ============================================
// DISNAKER WEB - Verification System
// ============================================

const Verification = {
  approveJob(jobId) {
    const job = DB.updateJob(jobId, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: Auth.getCurrentUser()?.id,
      rejectionReason: null
    });
    if (job) {
      DB.addNotification(job.companyId, `Lowongan "${job.title}" telah diverifikasi dan dipublikasikan.`, 'success');
      Components.showAlert('success', 'Disetujui', `Lowongan "${job.title}" berhasil diverifikasi.`);
    }
    return job;
  },

  rejectJob(jobId, reason) {
    const job = DB.updateJob(jobId, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: Auth.getCurrentUser()?.id,
      rejectionReason: reason
    });
    if (job) {
      DB.addNotification(job.companyId, `Lowongan "${job.title}" ditolak. Alasan: ${reason}`, 'danger');
      Components.showAlert('warning', 'Ditolak', `Lowongan "${job.title}" telah ditolak.`);
    }
    return job;
  },

  showRejectDialog(jobId, callback) {
    Components.showModal({
      title: 'Tolak Lowongan',
      body: `
        <div class="form-group">
          <label class="form-label">Alasan Penolakan <span class="required">*</span></label>
          <textarea class="form-control" id="reject-reason" placeholder="Jelaskan alasan penolakan lowongan ini..." rows="4"></textarea>
          <p class="form-text">Alasan akan dikirimkan ke perusahaan yang bersangkutan.</p>
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="Components.closeModal()">Batal</button>
        <button class="btn btn-danger" onclick="Verification.handleReject('${jobId}')"><i class="fas fa-times"></i> Tolak Lowongan</button>
      `
    });
  },

  handleReject(jobId) {
    const reason = document.getElementById('reject-reason')?.value?.trim();
    if (!reason) {
      Components.showAlert('danger', 'Error', 'Alasan penolakan wajib diisi.');
      return;
    }
    Components.closeModal();
    Verification.rejectJob(jobId, reason);
    // Trigger page refresh if callback is available
    if (typeof window.refreshVerificationPage === 'function') {
      setTimeout(() => window.refreshVerificationPage(), 400);
    }
  },

  getVerificationStats() {
    const jobs = DB.getJobs();
    return {
      total: jobs.length,
      verified: jobs.filter(j => j.status === 'verified').length,
      pending: jobs.filter(j => j.status === 'pending').length,
      rejected: jobs.filter(j => j.status === 'rejected').length,
      rate: jobs.length ? ((jobs.filter(j => j.status === 'verified').length / jobs.length) * 100).toFixed(1) : 0
    };
  }
};
