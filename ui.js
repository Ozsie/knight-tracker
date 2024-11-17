import { showKnightDetails, levelMapping } from './knight.js';
import { loadKnights, saveKnights } from './storage.js';

export function displayKnights(knights) {
  const knightList = document.getElementById('knight-list');
  knightList.innerHTML = '';

  const playingGroups = knights.reduce((acc, knight, index) => {
    const playingGroup = knight.playingGroup || 'Okänd spelargrupp';
    if (!acc[playingGroup]) {
      acc[playingGroup] = [];
    }
    acc[playingGroup].push({ knight, index });
    return acc;
  }, {});

  for (const [playingGroup, groupKnights] of Object.entries(playingGroups)) {
    const groupHeader = document.createElement('h3');
    groupHeader.textContent = playingGroup;
    knightList.appendChild(groupHeader);

    groupKnights.forEach(({ knight, index }) => {
      const levelText = levelMapping[knight.level];
      const li = document.createElement('li');
      const color = knight.color || 'white';
      li.className = "knight-item";
      li.style.setProperty(`--knight-color`, color);
      li.innerHTML = `
        ${levelText} ${knight.name} - ${knight.health} Hälsa - ${knight.points} Poäng
        <div style="display: flex; gap: 10px;">
          <span>Kampanj: ${knight.campaign || 'Ingen kampanj'} - ${knight.scenario || 'Inget uppdrag'}</span>
        </div>
        <button class="delete-knight">Ta bort</button>
      `;
      li.querySelector('.delete-knight').addEventListener('click', () => deleteKnight(index));
      li.addEventListener('click', () => showKnightDetails(index));
      knightList.appendChild(li);
    });
  }
}

function deleteKnight(index) {
  if (confirm('Är du säker på att du vill ta bort riddaren?')) {
    const knights = loadKnights();
    knights.splice(index, 1);
    saveKnights(knights);
    displayKnights(knights);
  }
}

export function showKnightForm() {
  document.getElementById('search-div').style.display = 'none';
  document.getElementById('add-knight').style.display = 'none';
  document.getElementById('knight-details').style.display = 'none';
  document.getElementById('knight-list').style.display = 'none';
  document.getElementById('knight-form').style.display = 'block';
}

export function backToList() {
  document.getElementById('search-div').style.display = 'block';
  document.getElementById('knight-details').style.display = 'none';
  document.getElementById('knight-list').style.display = 'block';
  document.getElementById('add-knight').style.display = 'block';
  document.getElementById('knight-form').style.display = 'none'; // Hide the knight form
  displayKnights(loadKnights());
}
