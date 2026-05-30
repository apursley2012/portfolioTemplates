// Static GitHub Pages helper script. Loads separated HTML component partials and keeps links correct from root pages and nested /pages files.
document.addEventListener('DOMContentLoaded', () => {
  const depthPrefix = location.pathname.includes('/pages/') ? '../' : '';
  const normalizeLinks = (root = document) => {
    root.querySelectorAll('[data-link]').forEach((link) => {
      const target = link.getAttribute('data-link');
      if (!target) return;
      link.setAttribute('href', depthPrefix + target);
      const current = location.pathname.split('/').pop() || 'index.html';
      if (target.endsWith(current)) link.setAttribute('aria-current', 'page');
    });
  };

  normalizeLinks();
  document.querySelectorAll('[data-include]').forEach(async (slot) => {
    const src = slot.getAttribute('data-include');
    if (!src) return;
    try {
      const response = await fetch(src);
      if (response.ok) {
        slot.innerHTML = await response.text();
        normalizeLinks(slot);
      }
    } catch (error) {
      console.warn('Component include skipped:', src, error);
    }
  });
});
