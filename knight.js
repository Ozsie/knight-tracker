// knight.js
import { loadKnights, saveKnights } from './storage.js';
import { displayKnights } from './ui.js';

export const levelMapping = {
  1: 'Väpnare',
  2: 'Riddare',
  3: 'Hjälte',
  4: 'Furste',
  5: 'Mästare'
};

export function addKnight() {
  const name = document.getElementById('knight-name').value;
  const level = document.getElementById('knight-level').value;
  const health = document.getElementById('knight-health').value;

  if (name && level && health) {
    const knights = loadKnights();
    knights.push({ name, level, health, 'points': 0, 'equipment': ['Svärd'], 'campaign': 'Isdrakens skatt', 'scenario': '' });
    saveKnights(knights);
    displayKnights(knights);
    document.getElementById('knight-form').style.display = 'none';
  } else {
    alert('Alla fält måste fyllas i');
  }
}

export function showKnightDetails(index) {
  const knights = loadKnights();
  const knight = knights[index];
  const levelText = levelMapping[knight.level];
  const equipmentList = knight.equipment.map(item => `<li>${item}</li>`).join('');

  document.getElementById('knight-info').innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center;">
      <h2>${knight.name}</h2>
      <div style="display: flex; gap: 5px; align-items: center;">
        <label for="playing-group">Spelargrupp</label>
        <input type="text" id="playing-group" value="${knight.playingGroup || ''}">
      </div>
    </div>
    <div style="display: flex; gap: 10px;">
      <div>
        <label for="campaign">Kampanj</label>
        <input type="text" id="campaign" value="${knight.campaign || ''}">
      </div>
      <div>
        <label for="scenario">Uppdrag</label>
        <input type="text" id="scenario" value="${knight.scenario || ''}">
      </div>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <h3>Nivå</h3>
      <h3>Hälsa</h3>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>
        ${levelText} (${knight.points})
        <button id="level-decrease" class="small-button">-</button>
        <button id="level-increase" class="small-button">+</button>
      </span>
      <span>
        <button id="health-decrease" class="small-button">-</button>
        <button id="health-increase" class="small-button">+</button>
        ${knight.health}
      </span>
    </div>
    <h3>Utrustning</h3>
    <input type="text" id="new-equipment" placeholder="Lägg till utrustning">
    <button id="add-equipment" class="small-button">Lägg till</button>
    <ul>${equipmentList}</ul>
  `;
  document.getElementById('knight-list').style.display = 'none';
  document.getElementById('add-knight').style.display = 'none';
  document.getElementById('search-div').style.display = 'none';
  document.getElementById('knight-details').style.display = 'block';

  document.getElementById('playing-group').onchange = (event) => {
    knight.playingGroup = event.target.value;
    saveAndUpdate();
  };

  document.getElementById('campaign').onchange = (event) => {
    knight.campaign = event.target.value;
    saveAndUpdate();
  };

  document.getElementById('scenario').onchange = (event) => {
    knight.scenario = event.target.value;
    saveAndUpdate();
  };

  document.getElementById('level-increase').onclick = () => {
    if (knight.level < 5) {
      knight.points++;
      if (knight.points >= 28) {
        knight.level = 5;
      } else if (knight.points >= 18) {
        knight.level = 4;
      } else if (knight.points >= 10) {
        knight.level = 3;
      } else if (knight.points >= 4) {
        knight.level = 2;
      }
      saveAndUpdate();
    }
  };

  document.getElementById('level-decrease').onclick = () => {
    if (knight.points > 1) {
      knight.points--;
      if (knight.points >= 28) {
        knight.level = 5;
      } else if (knight.points >= 18) {
        knight.level = 4;
      } else if (knight.points >= 10) {
        knight.level = 3;
      } else if (knight.points >= 4) {
        knight.level = 2;
      } else {
        knight.level = 1;
      }
      saveAndUpdate();
    }
  };

  document.getElementById('health-increase').onclick = () => {
    if (knight.health < 7) {
      knight.health++;
      saveAndUpdate();
    }
  };

  document.getElementById('health-decrease').onclick = () => {
    if (knight.health > 1) {
      knight.health--;
      saveAndUpdate();
    }
  };

  document.getElementById('add-equipment').onclick = () => {
    const newEquipment = document.getElementById('new-equipment').value;
    if (newEquipment) {
      knight.equipment.push(newEquipment);
      saveAndUpdate();
    }
  };

  function saveAndUpdate() {
    knights[index] = knight;
    saveKnights(knights);
    showKnightDetails(index);
  }
}
