

// js/footer.js
// Inject site footer into pages

const footerHTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <div class="socials" aria-label="Social links">
        <a href="#" aria-label="Facebook placeholder">Facebook</a>
        <a href="#" aria-label="Instagram placeholder">Instagram</a>
        <a href="#" aria-label="Twitter placeholder">Twitter</a>
        <a href="#" aria-label="LinkedIn placeholder">LinkedIn</a>
      </div>
      <div class="meta small muted">
        <span>© <span id="siteYear"></span> Pan-African Fashion Lookbook</span>
      </div>
    </div>
  </footer>
`;

export function injectFooter(){
  const root = document.getElementById('root');
  if (!root) return;
  root.insertAdjacentHTML('beforeend', footerHTML);
  const yearEl = document.getElementById('siteYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    injectFooter();
  });
}


