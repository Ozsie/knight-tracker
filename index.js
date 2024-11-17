
const levelMapping = {
  1: 'Väpnare',
  2: 'Riddare',
  3: 'Hjälte',
  4: 'Furste',
  5: 'Mästare'
};

// Function to load knights from local storage
function loadKnights() {
  const knights = JSON.parse(localStorage.getItem('knights')) || [];
  const knightList = document.getElementById('knight-list');
  knightList.innerHTML = '';

  // Group knights by playing group
  const playingGroups = knights.reduce((acc, knight, index) => {
    const playingGroup = knight.playingGroup || 'Okänd spelargrupp';
    if (!acc[playingGroup]) {
      acc[playingGroup] = [];
    }
    acc[playingGroup].push({ knight, index });
    return acc;
  }, {});

  // Display knights grouped by playing group
  for (const [playingGroup, groupKnights] of Object.entries(playingGroups)) {
    const groupHeader = document.createElement('h3');
    groupHeader.textContent = playingGroup;
    knightList.appendChild(groupHeader);

    groupKnights.forEach(({ knight, index }) => {
      const levelText = levelMapping[knight.level];
      const li = document.createElement('li');
      li.innerHTML = `
        ${levelText} ${knight.name} - ${knight.health} Hälsa - ${knight.points} Poäng
        <div style="display: flex; gap: 10px;">
          <span>Kampanj: ${knight.campaign || 'Ingen kampanj'}</span>
          <span>Uppdrag: ${knight.scenario || 'Inget uppdrag'}</span>
        </div>
      `;
      li.addEventListener('click', () => showKnightDetails(index));
      knightList.appendChild(li);
    });
  }
}

// Function to show the knight form
function showKnightForm() {
  document.getElementById('add-knight').style.display = 'none';
  document.getElementById('knight-form').style.display = 'block';
}

// Function to add a new knight
function addKnight() {
  const name = document.getElementById('knight-name').value;
  const level = document.getElementById('knight-level').value;
  const health = document.getElementById('knight-health').value;

  if (name && level && health) {
    const knights = JSON.parse(localStorage.getItem('knights')) || [];
    knights.push({ name, level, health, 'points': 0, 'equipment': ['Svärd'], 'campaign': 'Isdrakens skatt', 'scenario': '' })
    localStorage.setItem('knights', JSON.stringify(knights));
    loadKnights();
    document.getElementById('knight-form').style.display = 'none';
  } else {
    alert('Alla fält måste fyllas i');
  }
}

// Function to show knight details
function showKnightDetails(index) {
  const knights = JSON.parse(localStorage.getItem('knights')) || [];
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
    localStorage.setItem('knights', JSON.stringify(knights));
    showKnightDetails(index);
  }
}

// Function to go back to the list
function backToList() {
  document.getElementById('knight-details').style.display = 'none';
  document.getElementById('knight-list').style.display = 'block';
  document.getElementById('add-knight').style.display = 'block';
  loadKnights();
}

// Load knights when the page loads
window.onload = () => {
  document.getElementById('add-knight').addEventListener('click', showKnightForm);
  document.getElementById('save-knight').addEventListener('click', addKnight);
  document.getElementById('back-to-list').addEventListener('click', backToList);
  loadKnights();
}