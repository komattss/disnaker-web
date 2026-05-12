// ============================================
// DISNAKER WEB - Application Entry Point
// ============================================

const App = {
  init() {
    DB.init();
    // Apply user settings (theme, font size, etc.)
    if (typeof Settings !== 'undefined') {
      Settings.applyAll();
    }
  }
};

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
