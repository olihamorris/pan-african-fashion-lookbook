// js/api.js
// Encapsulate third-party API calls (Unsplash + Wikipedia)
// Replace UNSPLASH_ACCESS_KEY with your key.

const UNSPLASH_ACCESS_KEY = 'UaBJNyaTcR69lISPYXJbKEoHll3qksLrd5CgfOsA5cU'; // <-- put your key here

/**
 * Search Unsplash for images.
 * Returns array of objects with id, urls.small, alt_description, user.name
 */
export async function searchImages(query = 'african fashion', perPage = 12){
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'UNSPLASH_ACCESS_KEY'){
    // fallback to local demo data (small)
    return [
      { id: 'demo1', alt_description: 'African fabric', urls: { small: '/images/hero-image.jpg' }, user: { name: 'Local' } }
    ];
  }
  const url = `https://api.unsplash.com/search/photos?page=1&per_page=${perPage}&query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unsplash error: ' + res.status);
  const data = await res.json();
  return data.results || [];
}

/**
 * Lookup Wikipedia summary for a given page title / name.
 * Uses the Wikipedia REST API.
 * Returns JSON or null.
 */
export async function lookupDesigner(name = ''){
  if (!name) return null;
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
  const res = await fetch(endpoint);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}


