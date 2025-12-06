

function getBase() {
  return location.pathname.includes("/pages/") ? "../" : "./";
}

function buildHeaderHTML(base) {
  return `
    <div class="navbar container">
      <a class="logo" href="${base}index.html">
        <img src="${base}images/logo.png" class="logo-img" alt="Logo">
      </a>
      <button id="hamburgerBtn" class="hamburger" aria-expanded="false">☰</button>
      <ul id="navLinks" class="nav-links">
        <li><a href="${base}index.html">Home</a></li>
        <li><a href="${base}pages/regions.html">Regions</a></li>
        <li class="dropdown">
          <a href="${base}pages/lookbook.html">Lookbook ▾</a>
          <ul class="dropdown-menu">
            <li><a href="${base}pages/about-us.html">About</a></li>
            <li><a href="${base}pages/contact-us.html">Contact</a></li>
            <li><a href="${base}pages/style-detail.html">Style Detail</a></li>
          </ul>
        </li>
        <li><a href="${base}pages/designers.html">Designers</a></li>
        <li><a href="${base}pages/favorites.html">Favorites</a></li>
      </ul>
      <button id="theme-toggle" class="btn">Dark mode</button>
    </div>
  `;
}

function bindHeaderHandlers() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  const toggleBtn = document.getElementById("theme-toggle");

  // Hamburger Menu
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Theme Toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      // Update button text
      toggleBtn.textContent = document.body.classList.contains("dark") ? "Light mode" : "Dark mode";
      // Save preference
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("site-header");
  if (!host) return;
  const base = getBase();
  host.innerHTML = buildHeaderHTML(base);
  // Wait a moment so the DOM fully builds, then attach handlers
  setTimeout(() => {
    bindHeaderHandlers();
  }, 50);
});