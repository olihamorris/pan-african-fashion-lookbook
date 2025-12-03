
// Unsplash + Wikipedia wrapper for the project
// IMPORTANT: Replace UNSPLASH_ACCESS_KEY with your own Unsplash key

const UNSPLASH_ACCESS_KEY = 'UaBJNyaTcR69lISPYXJbKEoHll3qksLrd5CgfOsA5cU'; // <-- put your key here
const UNSPLASH_BASE = 'https://api.unsplash.com';
const WIKIPEDIA_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

function throwIfNoKey() {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY.includes('REPLACE_WITH')) {
    throw new Error(
      'Unsplash access key missing. Open js/api.js and set UNSPLASH_ACCESS_KEY.'
    );
  }
}

/**
 * Search Unsplash for photos
 * @param {string} query
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Object>} response JSON
 */
export async function searchUnsplash(query = 'African fabric', page = 1, perPage = 12) {
  throwIfNoKey();
  const q = encodeURIComponent(query);
  const url = `${UNSPLASH_BASE}/search/photos?query=${q}&page=${page}&per_page=${perPage}&orientation=portrait`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Unsplash API error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json;
}

/**
 * Fetch a Wikipedia summary for a term (if available)
 * @param {string} term
 * @returns {Promise<Object|null>}
 */
export async function fetchWikipediaSummary(term) {
  if (!term) return null;
  try {
    const q = encodeURIComponent(term);
    const res = await fetch(`${WIKIPEDIA_SUMMARY}${q}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (err) {
    return null;
  }
}