
function getBase() {
  return location.pathname.includes("/pages/") ? "../" : "./";
}

function buildHeaderHTML(base) {
  return `
    <div class="nav-border">
      <nav class="navbar container">
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
      </nav>
    </div>
  `;
}

function bindHeaderHandlers() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  const toggleBtn = document.getElementById("theme-toggle");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      toggleBtn.textContent = document.body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("site-header");
  if (!host) return;
  const base = getBase();
  host.innerHTML = buildHeaderHTML(base);

  setTimeout(() => bindHeaderHandlers(), 50);
});
