// js/utils.js
// small utilities used across the app

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function setLastVisited(){
  try {
    localStorage.setItem('lastVisited', new Date().toISOString());
  } catch(e) { /* ignore */ }
}
export function getLastVisited(){
  try {
    const v = localStorage.getItem('lastVisited');
    return v ? new Date(v).toLocaleString() : 'First visit';
  } catch(e){ return 'Unknown' }
}

export function formatISODate(d = document.lastModified){
  if (!d) return new Date().toLocaleString();
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString();
}

// simple helper to fetch JSON and handle errors
export async function safeFetch(url, opts = {}){
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  return res.json();
}


