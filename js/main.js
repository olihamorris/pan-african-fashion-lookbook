
// js/main.js
import { renderFooter } from './footer.js';
import { el, createEl, formatDateISO } from './utils.js';
import { searchUnsplash, fetchWikipediaSummary } from './api.js';

// If you already have header.js that injects header, ensure it's loaded before this script on pages that need it.

document.addEventListener('DOMContentLoaded', () => {
  // Render footer (safe to call even if footer already exists)
  renderFooter();

  const gallery = el('#gallery');
  const searchInput = el('#search-input');
  const regionSelect = el('#region-select');
  const searchBtn = el('#search-btn');
  const loadMoreBtn = el('#load-more');
  const lastModifiedEl = el('#last-modified');
  const lastVisitedEl = el('#last-visited');
  const themeToggle = el('#theme-toggle');

  // Theme handling
  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('pan-lookbook-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }
  };

  const savedTheme = localStorage.getItem('pan-lookbook-theme') || 'light';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Last modified & last visited
  if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified || '—';
  if (lastVisitedEl) {
    const last = localStorage.getItem('pan-lookbook-lastvisited');
    lastVisitedEl.textContent = last ? formatDateISO(last) : 'First visit';
    localStorage.setItem('pan-lookbook-lastvisited', Date.now());
  }

  // Lazy-load observer
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src || img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      io.unobserve(img);
    });
  }, { rootMargin: '200px' });

  // State
  let page = 1;
  let lastQuery = 'African fabric';

  function buildCard(photo) {
    const card = createEl('article', { class: 'card' });
    const img = createEl('img', {
      alt: photo.alt_description || photo.description || 'Fashion image',
      loading: 'lazy',
    });
    // use data-src for lazy load
    img.setAttribute('data-src', photo.urls.regular);
    img.addEventListener('error', () => { img.style.display = 'none'; });
    io.observe(img);

    const meta = createEl('div', { class: 'meta' },
      createEl('h3', {}, photo.description || photo.alt_description || 'Untitled'),
      createEl('p', {}, photo.user?.name || 'Unknown')
    );

    const actions = createEl('div', { class: 'actions' });
    const favBtn = createEl('button', {}, '❤ Favorite');
    favBtn.addEventListener('click', () => toggleFavorite(photo));
    const detailsBtn = createEl('button', {}, 'Details');
    detailsBtn.addEventListener('click', () => openDetail(photo));
    actions.appendChild(favBtn);
    actions.appendChild(detailsBtn);

    card.appendChild(img);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
  }

  function showError(message) {
    if (!gallery) return;
    gallery.innerHTML = `<p class="error">${message}</p>`;
  }

  async function loadImages({ query = 'African fabric', append = false } = {}) {
    if (!gallery) return;
    if (!append) {
      gallery.innerHTML = '';
      page = 1;
    }
    lastQuery = query;
    try {
      const res = await searchUnsplash(query, page, 12);
      const items = res?.results || [];
      if (!append && items.length === 0) {
        gallery.innerHTML = '<p>No results found — try another search.</p>';
        return;
      }
      items.forEach((it) => {
        const card = buildCard(it);
        gallery.appendChild(card);
      });
      page += 1;
    } catch (err) {
      console.error(err);
      showError('Error loading images. Check console and ensure your Unsplash key is set in js/api.js.');
    }
  }

  // Favorites stored in localStorage
  function getFavs() {
    return JSON.parse(localStorage.getItem('pan-lookbook-favs') || '[]');
  }

  function toggleFavorite(photo) {
    const favs = getFavs();
    const exists = favs.find((f) => f.id === photo.id);
    if (exists) {
      const newFavs = favs.filter((f) => f.id !== photo.id);
      localStorage.setItem('pan-lookbook-favs', JSON.stringify(newFavs));
      alert('Removed from favorites');
    } else {
      favs.push({
        id: photo.id,
        urls: photo.urls,
        desc: photo.description || photo.alt_description,
        user: photo.user,
      });
      localStorage.setItem('pan-lookbook-favs', JSON.stringify(favs));
      alert('Added to favorites');
    }
  }

  // Open detail (store in sessionStorage and navigate)
  function openDetail(photo) {
    sessionStorage.setItem('pan-lookbook-detail', JSON.stringify(photo));
    window.location.href = '/pages/style-detail.html';
  }

  // Event handlers
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = (searchInput && searchInput.value.trim()) || '';
      const region = regionSelect && regionSelect.value;
      const query = q || (region && region !== 'all' ? `${region} African fabric` : 'African fabric');
      loadImages({ query });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadImages({ query: lastQuery, append: true });
    });
  }

  // Initialize pages behavior
  const path = location.pathname;

  // index or lookbook page auto-load
  if (path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/pages/lookbook.html')) {
    // check query param region
    const params = new URLSearchParams(location.search);
    const region = params.get('region');
    const q = region ? `${region} African fabric` : 'African fabric';
    loadImages({ query: q });
  }

  // style-detail page: render saved detail
  if (path.endsWith('/pages/style-detail.html')) {
    const wrap = el('#style-detail');
    const raw = sessionStorage.getItem('pan-lookbook-detail');
    if (!wrap) return;
    if (!raw) {
      wrap.innerHTML = '<p>No detail loaded.</p>';
      return;
    }
    try {
      const item = JSON.parse(raw);
      (async () => {
        const wiki = await fetchWikipediaSummary(item.user?.name || item.description || 'African textile');
        wrap.innerHTML = `
          <h2>${item.description || item.alt_description || 'Style'}</h2>
          <img src="${item.urls.regular}" alt="${item.alt_description || ''}" style="max-width:100%;border-radius:8px;">
          <p><strong>Photographer / source:</strong> ${item.user?.name || 'Unknown'}</p>
          <h3>About</h3>
          <p>${(wiki && wiki.extract) ? wiki.extract : 'No additional info available.'}</p>
        `;
      })();
    } catch (err) {
      wrap.innerHTML = '<p>Unable to render detail.</p>';
    }
  }

  // designers page: render a small list with wiki extracts
  if (path.endsWith('/pages/designers.html')) {
    const wrap = el('#designers-list');
    if (!wrap) return;
    (async () => {
      const designers = ['Lisa Folawiyo', 'Maki Oh', 'Maxhosa by Laduma', 'Tiffany Amber', 'Deola Sagoe'];
      for (const name of designers) {
        const card = createEl('div', { class: 'card' });
        card.appendChild(createEl('h3', {}, name));
        const wiki = await fetchWikipediaSummary(name);
        card.appendChild(createEl('p', {}, wiki?.extract ? (wiki.extract.substring(0, 220) + '...') : 'No wiki info available.'));
        wrap.appendChild(card);
      }
    })();
  }

  // favorites page: render saved favourites
  if (path.endsWith('/pages/favorites.html')) {
    const wrap = el('#favorites');
    if (!wrap) return;
    const favs = getFavs();
    if (!favs.length) {
      wrap.innerHTML = '<p>No favorites yet.</p>';
    } else {
      favs.forEach((i) => {
        const c = createEl('article', { class: 'card' });
        const img = createEl('img', { src: i.urls.small, alt: i.desc || 'fav' });
        c.appendChild(img);
        const meta = createEl('div', { class: 'meta' },
          createEl('h3', {}, i.desc || 'Untitled'),
          createEl('p', {}, i.user?.name || 'Unknown')
        );
        c.appendChild(meta);
        wrap.appendChild(c);
      });
    }
  }

  // contact form handler (client-only)
  const contactForm = el('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! Message captured locally (this project uses no backend).');
      contactForm.reset();
    });
  }
});

// Theme
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  localStorage.setItem("theme", theme);
}

// Load saved theme
applyTheme(localStorage.getItem("theme") || "light");

// Toggle on click
themeToggle.addEventListener("click", () => {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
});

