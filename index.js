
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
    <p>${knight.name}</p>
    <div style="display: flex; justify-content: space-between;">
      <span>Nivå</span>
      <span>Hälsa</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>${levelText} (${knight.points})</span>
      <span>${knight.health}</span>
    </div>
    <p>Utrustning:</p>
    <ul>${equipmentList}</ul>
  `;
  document.getElementById('knight-list').style.display = 'none';
  document.getElementById('add-knight').style.display = 'none';
  document.getElementById('knight-details').style.display = 'block';

  document.getElementById('edit-knight').onclick = () => {
    document.getElementById('knight-info').innerHTML = `
      <p>Name: ${knight.name}</p>
      <div style="display: flex; justify-content: space-between;">
        <span>Level: <select id="edit-knight-level">
          <option value="1" ${knight.level === 1 ? 'selected' : ''}>Väpnare</option>
          <option value="2" ${knight.level === 2 ? 'selected' : ''}>Riddare</option>
          <option value="3" ${knight.level === 3 ? 'selected' : ''}>Hjälte</option>
          <option value="4" ${knight.level === 4 ? 'selected' : ''}>Furste</option>
          <option value="5" ${knight.level === 5 ? 'selected' : ''}>Mästare</option>
        </select>, Poäng: <input type="number" id="edit-knight-points" value="${knight.points}"></span>
        <span>Hälsa: <input type="number" id="edit-knight-health" value="${knight.health}"></span>
      </div>
      <p>Utrustning: <input type="text" id="edit-knight-equipment" value="${knight.equipment.join(', ')}"></p>
      <button id="save-edits">Spara ändringar</button>
    `;

    document.getElementById('save-edits').onclick = () => {
      knight.level = document.getElementById('edit-knight-level').value;
      knight.health = document.getElementById('edit-knight-health').value;
      knight.points = document.getElementById('edit-knight-points').value;
      knight.equipment = document.getElementById('edit-knight-equipment').value.split(',').map(item => item.trim());
      knights[index] = knight;
      localStorage.setItem('knights', JSON.stringify(knights));
      showKnightDetails(index);
    };
  };
}

// Function to go back to the list
function backToList() {
  document.getElementById('knight-details').style.display = 'none';
  document.getElementById('knight-list').style.display = 'block';
  document.getElementById('add-knight').style.display = 'block';
}

// Load knights when the page loads
window.onload = () => {
  document.getElementById('add-knight').addEventListener('click', showKnightForm);
  document.getElementById('save-knight').addEventListener('click', addKnight);
  document.getElementById('back-to-list').addEventListener('click', backToList);
  loadKnights();
}