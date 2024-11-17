// storage.js
export function loadKnights() {
  return JSON.parse(localStorage.getItem('knights')) || [];
}

export function saveKnights(knights) {
  localStorage.setItem('knights', JSON.stringify(knights));
}
