// main.js
import { loadKnights } from './storage.js';
import { displayKnights, showKnightForm, backToList } from './ui.js';
import { addKnight } from './knight.js';

function searchKnights() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const knights = loadKnights();
  const filteredKnights = knights.filter(knight =>
    knight.name.toLowerCase().includes(searchQuery) ||
    (knight.playingGroup && knight.playingGroup.toLowerCase().includes(searchQuery))
  );
  displayKnights(filteredKnights);
}

window.onload = () => {
  document.getElementById('search-input').style.display = 'block';
  document.getElementById('search-input').oninput = searchKnights;
  document.getElementById('add-knight').addEventListener('click', showKnightForm);
  document.getElementById('save-knight').addEventListener('click', addKnight);
  document.getElementById('back-to-list').addEventListener('click', backToList);
  displayKnights(loadKnights());
};