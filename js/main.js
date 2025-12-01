

// js/main.js
// App initialization, search wiring, gallery rendering, detail logic.
// Uses searchImages and lookupDesigner from api.js

import { injectHeader } from './header.js';
import { injectFooter } from './footer.js';
import { searchImages, lookupDesigner } from './api.js';
import { setLastVisited, getLastVisited, formatISODate } from './utils.js';

// Wait for DOM then wire
document.addEventListener('DOMContentLoaded', async () => {
  // header and footer are injected by header.js and footer.js automatically
  // ensure footer year and header state are present
  try {
    setupLastModifiedAndVisited();
    wireSearchControls();
    await loadInitialGallery();
    wireContactForm();
    wireFavoritesPage();
    wireDetailPage();
  } catch (err) {
    console.error('Initialization error', err);
  }
});

// Show last modified & last visited where present
function setupLastModifiedAndVisited(){
  const lastModifiedEl = document.getElementById('lastModified');
  const lastVisitedEl = document.getElementById('lastVisited');
  if (lastModifiedEl) lastModifiedEl.textContent = formatISODate(document.lastModified);
  if (lastVisitedEl) lastVisitedEl.textContent = getLastVisited();
  setLastVisited();
}

// Build a gallery card element
function buildCard(item){
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <img data-src="${item.img}" alt="${item.title || 'Style'}" class="lazy" loading="lazy">
    <div class="card-body">
      <h3>${escapeHtml(item.title || 'Untitled')}</h3>
      <p class="muted small">${escapeHtml(item.description || '')}</p>
      <div class="actions">
        <button class="icon-btn view-btn" data-id="${item.id}">View</button>
        <button class="icon-btn fav-btn" data-id="${item.id}">♥ Save</button>
      </div>
    </div>
  `;
  return article;
}

// Simple escape to avoid injection in injected strings
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Lazy load images using IntersectionObserver
function lazyLoadInit(){
  const els = document.querySelectorAll('img.lazy[data-src]');
  if (!('IntersectionObserver' in window)) {
    // fallback: load all
    els.forEach(img => { img.src = img.dataset.src; });
    return;
  }
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const img = ent.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '120px' });
  els.forEach(img => io.observe(img));
}

// Render a list of items to a gallery container (id 'gallery' or page-specific)
function renderGallery(items = [], containerId = 'gallery'){
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => container.appendChild(buildCard(item)));
  lazyLoadInit();
  // wire actions
  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => saveFavorite(btn.dataset.id, items));
  });
  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => viewDetail(btn.dataset.id, items));
  });
}

// Save a favorite to localStorage
function saveFavorite(id, items){
  const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (stored.find(s => s.id === id)) return;
  const item = items.find(i => i.id === id);
  if (!item) return;
  stored.push(item);
  localStorage.setItem('favorites', JSON.stringify(stored));
  // simple user feedback
  alert('Saved to favorites');
}

// View detail: store in sessionStorage and navigate to detail page
function viewDetail(id, items){
  const item = items.find(i => i.id === id);
  if (!item) return;
  sessionStorage.setItem('detailItem', JSON.stringify(item));
  // navigate to pages/style-detail.html (works from root and pages)
  // choose path depending on current location
  const base = location.pathname.includes('/pages/') ? 'style-detail.html' : 'pages/style-detail.html';
  location.href = base;
}

// Load initial gallery (index / lookbook)
async function loadInitialGallery(){
  const path = location.pathname;
  // determine where to render
  const galleryId = document.getElementById('gallery') ? 'gallery'
                  : document.getElementById('lookbookGallery') ? 'lookbookGallery'
                  : document.getElementById('favoritesGallery') ? 'favoritesGallery'
                  : null;

  if (!galleryId) {
    // maybe this is detail or other page — still bind favorites or detail
    return;
  }

  try {
    const results = await searchImages('african fashion', 12);
    const items = results.map((r, i) => ({
      id: r.id || `r${i}`,
      title: r.alt_description || `Style ${i+1}`,
      description: r.user?.name ? `Photo by ${r.user.name}` : '',
      img: r.urls?.small || r.urls?.regular || '/images/hero-image.jpg',
      designer: ''
    }));
    renderGallery(items, galleryId);
  } catch (err) {
    console.warn('Image load failed, showing fallback', err);
    renderGallery([{
      id: 'fallback1',
      title: 'Demo style',
      description: 'Demo content',
      img: '/images/hero-image.jpg'
    }], galleryId);
  }
}

// Wire search controls on index page
function wireSearchControls(){
  const searchBtn = document.getElementById('searchBtn');
  if (!searchBtn) return;
  searchBtn.addEventListener('click', async () => {
    const region = document.getElementById('region').value.trim();
    const fabric = document.getElementById('fabric').value.trim();
    const designer = document.getElementById('designer').value.trim();
    const qParts = [];
    if (region) qParts.push(region + ' Africa fashion');
    if (fabric) qParts.push(fabric);
    if (designer) qParts.push(designer);
    const q = qParts.length ? qParts.join(' ') : 'african fashion';
    try {
      const data = await searchImages(q, 12);
      const items = data.map((r, i) => ({
        id: r.id || `s${i}`,
        title: r.alt_description || `${fabric || 'Style'}`,
        description: r.user?.name ? `Photo by ${r.user.name}` : '',
        img: r.urls?.small || r.urls?.regular || '/images/hero-image.jpg',
        designer: designer || ''
      }));
      renderGallery(items, 'gallery');
    } catch (err) {
      console.error(err);
      alert('Search failed, try again.');
    }
  });
}

// Favorites page wiring
function wireFavoritesPage(){
  const favContainer = document.getElementById('favoritesGallery');
  if (!favContainer) return;
  const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (stored.length === 0){
    favContainer.innerHTML = '<p class="muted">No favorites yet. Save a look from the lookbook.</p>';
    return;
  }
  renderGallery(stored, 'favoritesGallery');
}

// Detail page logic
function wireDetailPage(){
  const detailEl = document.getElementById('detailArticle');
  if (!detailEl) return;
  const raw = sessionStorage.getItem('detailItem');
  if (!raw) {
    detailEl.innerHTML = '<p>No item selected. Go to <a href="../index.html">home</a>.</p>';
    return;
  }
  const item = JSON.parse(raw);
  detailEl.innerHTML = `
    <h2>${escapeHtml(item.title)}</h2>
    <img src="${item.img}" alt="${escapeHtml(item.title)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:8px;margin:0.6rem 0">
    <p class="muted">${escapeHtml(item.description || '')}</p>
    <p><strong>Designer:</strong> ${escapeHtml(item.designer || 'Unknown')}</p>
  `;
}

// Contact form handling (fake submit: store in localStorage for demo)
function wireContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      date: new Date().toISOString()
    };
    const stored = JSON.parse(localStorage.getItem('messages') || '[]');
    stored.push(data);
    localStorage.setItem('messages', JSON.stringify(stored));
    form.reset();
    if (status) status.textContent = 'Message saved locally (demo). Thank you!';
  });
}

