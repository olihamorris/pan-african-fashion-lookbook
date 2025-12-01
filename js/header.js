

// js/header.js
// Injects header HTML into every page, and wires the hamburger + theme toggle.
// Use as an ES module and import where needed.

const headerHTML = `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a class="brand" href="/index.html">
        <img src="/images/logo.png" alt="Logo">
        <span class="name">Pan-African Lookbook</span>
      </a>

      <nav class="nav" id="mainNav" role="navigation" aria-label="Main navigation">
        <a href="/index.html">Home</a>
        <a href="/pages/lookbook.html">Lookbook</a>
        <a href="/pages/designers.html">Designers</a>
        <a href="/pages/regions.html">Regions</a>
        <a href="/pages/favorites.html">Favorites</a>
        <div class="dropdown" style="display:inline-block">
          <button id="moreBtn" class="btn" aria-expanded="false">More ▾</button>
          <div class="dropdown-menu">
            <a href="/pages/about-us.html">About Us</a>
            <a href="/pages/contact-us.html">Contact Us</a>
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

/**
 * Inject header into element with id "root".
 */
export function injectHeader(){
  const root = document.getElementById('root');
  if (!root) return;
  // insert header as first child
  root.insertAdjacentHTML('afterbegin', headerHTML);
  bindHeader();
}

/** Setup interaction */
function bindHeader(){
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const moreBtn = document.getElementById('moreBtn');

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

  // dropdown
  moreBtn?.addEventListener('click', () => {
    const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
    moreBtn.setAttribute('aria-expanded', String(!expanded));
    // basic keyboard-friendly focus will work with tabbing to links
  });

  // restore theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle && (themeToggle.textContent = 'Light');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
  }
}

// auto-run when module loaded in browser contexts
if (typeof window !== 'undefined') {
  // allow pages to import and call injectHeader manually
  // but also auto-inject if DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
  });
}


