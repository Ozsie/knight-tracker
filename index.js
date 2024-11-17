
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
  knights.forEach((knight, index) => {
    const levelText = levelMapping[knight.level];
    const li = document.createElement('li');
    li.textContent = `${levelText} ${knight.name} - ${knight.health} Hälsa - ${knight.points} Poäng`;
    li.addEventListener('click', () => showKnightDetails(index));
    knightList.appendChild(li);
  });
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
    knights.push({ name, level, health, 'points': 0, 'equipment': ['Svärd'] })
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
    <h2>${knight.name}</h2>
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