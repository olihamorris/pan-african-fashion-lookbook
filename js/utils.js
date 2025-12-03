// js/utils.js
export function el(sel) {
  if (!sel) return null;
  return document.querySelector(sel);
}

export function createEl(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (typeof c === 'string' || typeof c === 'number') node.appendChild(document.createTextNode(c));
    else if (c instanceof Node) node.appendChild(c);
  }
  return node;
}

export function formatDateISO(val) {
  // accepts number or string timestamp or Date
  if (!val) return '';
  const n = Number(val);
  const d = Number.isFinite(n) ? new Date(n) : new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleString();
}

