// js/header.js
// Injects header HTML into every page, and wires the hamburger + theme toggle.
// Uses basePath so images and links remain valid from pages/

function getBasePath(){
  // If page is inside /pages/ use '../' else use './'
  return location.pathname.includes('/pages/') ? '../' : './';
}

export function injectHeader(){
  const base = getBasePath();
  const headerHTML = `
    <header class="site-header" role="banner">
      <div class="container header-inner">
        <a class="brand" href="${base}index.html">
          <img src="${base}images/logo.png" alt="Logo">
          <span class="name">Pan-African Lookbook</span>
        </a>

        <nav class="nav" id="mainNav" role="navigation" aria-label="Main navigation">
          <a href="${base}index.html">Home</a>
          <a href="${base}pages/lookbook.html">Lookbook</a>
          <a href="${base}pages/designers.html">Designers</a>
          <a href="${base}pages/regions.html">Regions</a>
          <a href="${base}pages/favorites.html">Favorites</a>
          <div class="dropdown" style="display:inline-block;position:relative">
            <button id="moreBtn" class="btn" aria-expanded="false">More ▾</button>
            <div class="dropdown-menu" style="display:none;position:absolute;right:0;top:110%;background:var(--panel);padding:.6rem;border-radius:8px;box-shadow:var(--shadow);">
              <a href="${base}pages/about-us.html">About Us</a>
              <a href="${base}pages/contact-us.html">Contact Us</a>
            </div>
          </div>
        </nav>

        <div class="controls">
          <button id="themeToggle" class="btn" aria-pressed="false">Dark</button>
          <button id="hamburger" class="hamburger" aria-expanded="false" aria-controls="mainNav" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
          </button>
        </div>
      </div>
    </header>
  `;
  const root = document.getElementById('root');
  if (!root) return;
  root.insertAdjacentHTML('afterbegin', headerHTML);
  bindHeader();
}

function bindHeader(){
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const moreBtn = document.getElementById('moreBtn');
  const dropdownMenu = moreBtn ? moreBtn.nextElementSibling : null;

  // hamburger toggles nav open class for small screens
  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // theme toggle persists choice to localStorage
  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark){
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = 'Dark';
      themeToggle.setAttribute('aria-pressed', 'false');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = 'Light';
      themeToggle.setAttribute('aria-pressed', 'true');
      localStorage.setItem('theme', 'dark');
    }
  });

  // dropdown toggle
  if (moreBtn && dropdownMenu){
    moreBtn.addEventListener('click', () => {
      const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
      moreBtn.setAttribute('aria-expanded', String(!expanded));
      dropdownMenu.style.display = expanded ? 'none' : 'block';
    });
    // hide when click outside
    document.addEventListener('click', (e) => {
      if (!moreBtn.contains(e.target) && !dropdownMenu.contains(e.target)){
        dropdownMenu.style.display = 'none';
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // restore theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) { themeToggle.textContent = 'Light'; themeToggle.setAttribute('aria-pressed', 'true'); }
  }
}

// auto-inject header when script is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
  });
}


