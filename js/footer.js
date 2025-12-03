// js/footer.js
export function renderFooter() {
  const footerHost = document.getElementById('site-footer');
  if (!footerHost) return;

  const lastModified = document.lastModified;
  
  let lastVisit = localStorage.getItem("lastVisit");
  const now = new Date();
  localStorage.setItem("lastVisit", now.toString());

  footerHost.innerHTML = `
    <div class="foot-inner container">
      <p>&copy; <span id="year">${new Date().getFullYear()}</span> Pan-African Fashion Lookbook</p>

      <p>Last Modified: ${lastModified}</p>
      <p>Last Visited: ${lastVisit ? new Date(lastVisit).toLocaleString() : "First visit"}</p>

      <p class="muted">Made with ❤️ • <a href="#">Terms</a> • <a href="#">Privacy</a></p>

      <div class="socials">
        <a href="#" aria-label="Facebook">Facebook</a>
        <a href="#" aria-label="Twitter">Twitter</a>
        <a href="#" aria-label="Instagram">Instagram</a>
      </div>
    </div>
  `;
}