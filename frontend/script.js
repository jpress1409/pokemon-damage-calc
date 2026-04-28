// Global variables
let currentTeam = [];
let currentOpponent = [];
const API_BASE_URL = 'http://localhost:5000/api';

// Sample Pokemon data for demonstration
const samplePokemon = [
    { name: 'Pikachu', types: ['electric'], stats: { hp: 35, attack: 55, defense: 40, sp_attack: 50, sp_defense: 50, speed: 90 } },
    { name: 'Charizard', types: ['fire', 'flying'], stats: { hp: 78, attack: 84, defense: 78, sp_attack: 109, sp_defense: 85, speed: 100 } },
    { name: 'Blastoise', types: ['water'], stats: { hp: 79, attack: 83, defense: 100, sp_attack: 85, sp_defense: 105, speed: 78 } },
    { name: 'Venusaur', types: ['grass', 'poison'], stats: { hp: 80, attack: 82, defense: 83, sp_attack: 100, sp_defense: 100, speed: 80 } },
    { name: 'Alakazam', types: ['psychic'], stats: { hp: 55, attack: 50, defense: 45, sp_attack: 135, sp_defense: 95, speed: 120 } },
    { name: 'Machamp', types: ['fighting'], stats: { hp: 90, attack: 130, defense: 80, sp_attack: 65, sp_defense: 85, speed: 55 } },
    { name: 'Gengar', types: ['ghost', 'poison'], stats: { hp: 60, attack: 65, defense: 60, sp_attack: 130, sp_defense: 75, speed: 110 } },
    { name: 'Dragonite', types: ['dragon', 'flying'], stats: { hp: 91, attack: 134, defense: 95, sp_attack: 100, sp_defense: 100, speed: 80 } },
    { name: 'Mewtwo', types: ['psychic'], stats: { hp: 106, attack: 110, defense: 90, sp_attack: 154, sp_defense: 90, speed: 130 } },
    { name: 'Lucario', types: ['fighting', 'steel'], stats: { hp: 70, attack: 110, defense: 70, sp_attack: 115, sp_defense: 70, speed: 90 } }
];

// Sample moves data
const sampleMoves = [
    { name: 'Thunderbolt', type: 'electric', power: 90, category: 'special' },
    { name: 'Flamethrower', type: 'fire', power: 90, category: 'special' },
    { name: 'Hydro Pump', type: 'water', power: 110, category: 'special' },
    { name: 'Solar Beam', type: 'grass', power: 120, category: 'special' },
    { name: 'Psychic', type: 'psychic', power: 90, category: 'special' },
    { name: 'Dynamic Punch', type: 'fighting', power: 100, category: 'physical' },
    { name: 'Shadow Ball', type: 'ghost', power: 80, category: 'special' },
    { name: 'Dragon Pulse', type: 'dragon', power: 85, category: 'special' },
    { name: 'Aura Sphere', type: 'fighting', power: 80, category: 'special' },
    { name: 'Ice Beam', type: 'ice', power: 90, category: 'special' },
    { name: 'Earthquake', type: 'ground', power: 100, category: 'physical' },
    { name: 'Surf', type: 'water', power: 90, category: 'special' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePokemonDropdowns();
    setupFileUploadHandlers();
    setupFormHandlers();
});

// Initialize Pokemon dropdowns
function initializePokemonDropdowns() {
    const attackerSelect = document.getElementById('attacker-select');
    const defenderSelect = document.getElementById('defender-select');
    
    // Add sample Pokemon to dropdowns
    samplePokemon.forEach(pokemon => {
        const option1 = new Option(pokemon.name, pokemon.name);
        const option2 = new Option(pokemon.name, pokemon.name);
        attackerSelect.add(option1);
        defenderSelect.add(option2);
    });
    
    // Add change handlers
    attackerSelect.addEventListener('change', function() {
        if (this.value) {
            loadPokemonData(this.value, 'attacker');
        }
    });
    
    defenderSelect.addEventListener('change', function() {
        if (this.value) {
            loadPokemonData(this.value, 'defender');
        }
    });
}

// Load Pokemon data into form
function loadPokemonData(pokemonName, role) {
    const pokemon = samplePokemon.find(p => p.name === pokemonName);
    if (!pokemon) return;
    
    // Set basic info
    document.getElementById(`${role}-name`).value = pokemon.name;
    document.getElementById(`${role}-level`).value = 50;
    
    // Set types
    document.getElementById(`${role}-type1`).value = pokemon.types[0];
    document.getElementById(`${role}-type2`).value = pokemon.types[1] || '';
    
    // Set stats
    document.getElementById(`${role}-hp`).value = pokemon.stats.hp;
    document.getElementById(`${role}-attack`).value = pokemon.stats.attack;
    document.getElementById(`${role}-defense`).value = pokemon.stats.defense;
    document.getElementById(`${role}-sp-attack`).value = pokemon.stats.sp_attack;
    document.getElementById(`${role}-sp-defense`).value = pokemon.stats.sp_defense;
    document.getElementById(`${role}-speed`).value = pokemon.stats.speed;
    
    // Add sample moves for attacker
    if (role === 'attacker') {
        const movesContainer = document.getElementById('attacker-moves');
        movesContainer.innerHTML = '';
        
        // Add 4 random moves
        const pokemonMoves = sampleMoves.slice(0, 4);
        pokemonMoves.forEach(move => {
            addMoveToContainer(movesContainer, move);
        });
    }
    
    // Show the form
    showManualInput(role);
}

// Add move to container
function addMoveToContainer(container, moveData = null) {
    const moveDiv = document.createElement('div');
    moveDiv.className = 'move-input';
    
    moveDiv.innerHTML = `
        <input type="text" placeholder="Move name" class="move-name" value="${moveData ? moveData.name : ''}">
        <select class="move-type">
            <option value="normal" ${moveData && moveData.type === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="fire" ${moveData && moveData.type === 'fire' ? 'selected' : ''}>Fire</option>
            <option value="water" ${moveData && moveData.type === 'water' ? 'selected' : ''}>Water</option>
            <option value="electric" ${moveData && moveData.type === 'electric' ? 'selected' : ''}>Electric</option>
            <option value="grass" ${moveData && moveData.type === 'grass' ? 'selected' : ''}>Grass</option>
            <option value="ice" ${moveData && moveData.type === 'ice' ? 'selected' : ''}>Ice</option>
            <option value="fighting" ${moveData && moveData.type === 'fighting' ? 'selected' : ''}>Fighting</option>
            <option value="poison" ${moveData && moveData.type === 'poison' ? 'selected' : ''}>Poison</option>
            <option value="ground" ${moveData && moveData.type === 'ground' ? 'selected' : ''}>Ground</option>
            <option value="flying" ${moveData && moveData.type === 'flying' ? 'selected' : ''}>Flying</option>
            <option value="psychic" ${moveData && moveData.type === 'psychic' ? 'selected' : ''}>Psychic</option>
            <option value="bug" ${moveData && moveData.type === 'bug' ? 'selected' : ''}>Bug</option>
            <option value="rock" ${moveData && moveData.type === 'rock' ? 'selected' : ''}>Rock</option>
            <option value="ghost" ${moveData && moveData.type === 'ghost' ? 'selected' : ''}>Ghost</option>
            <option value="dragon" ${moveData && moveData.type === 'dragon' ? 'selected' : ''}>Dragon</option>
            <option value="dark" ${moveData && moveData.type === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="steel" ${moveData && moveData.type === 'steel' ? 'selected' : ''}>Steel</option>
            <option value="fairy" ${moveData && moveData.type === 'fairy' ? 'selected' : ''}>Fairy</option>
        </select>
        <input type="number" placeholder="Power" class="move-power" min="0" value="${moveData ? moveData.power : ''}">
        <select class="move-category">
            <option value="physical" ${moveData && moveData.category === 'physical' ? 'selected' : ''}>Physical</option>
            <option value="special" ${moveData && moveData.category === 'special' ? 'selected' : ''}>Special</option>
            <option value="status" ${moveData && moveData.category === 'status' ? 'selected' : ''}>Status</option>
        </select>
        <button type="button" onclick="removeMove(this)">×</button>
    `;
    
    container.appendChild(moveDiv);
}

// Setup file upload handlers
function setupFileUploadHandlers() {
    const teamUpload = document.getElementById('team-upload');
    const opponentUpload = document.getElementById('opponent-upload');
    
    teamUpload.addEventListener('change', function(e) {
        handleFileUpload(e, 'team');
    });
    
    opponentUpload.addEventListener('change', function(e) {
        handleFileUpload(e, 'opponent');
    });
}

// Handle file upload
function handleFileUpload(event, teamType) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileInfo = document.getElementById(`${teamType}-file-info`);
    const preview = document.getElementById(`${teamType}-preview`);
    
    fileInfo.textContent = `Selected: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            if (file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
            } else if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            }
            
            if (teamType === 'team') {
                currentTeam = data;
                displayTeamPreview(data, preview);
                populatePokemonDropdown(data, 'attacker-select');
            } else {
                currentOpponent = data;
                displayTeamPreview(data, preview);
                populatePokemonDropdown(data, 'defender-select');
            }
        } catch (error) {
            fileInfo.textContent = `Error reading file: ${error.message}`;
            preview.innerHTML = '';
        }
    };
    
    reader.readAsText(file);
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const pokemon = {};
            
            headers.forEach((header, index) => {
                pokemon[header] = values[index];
            });
            
            data.push(pokemon);
        }
    }
    
    return data;
}

// Display team preview
function displayTeamPreview(team, previewElement) {
    previewElement.innerHTML = '';
    
    if (team.length === 0) {
        previewElement.innerHTML = '<p>No Pokemon in team</p>';
        return;
    }
    
    team.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.style.cssText = 'margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;';
        
        const name = pokemon.name || pokemon.Name || 'Unknown';
        const types = pokemon.types || pokemon.Type || 'Unknown';
        const level = pokemon.level || pokemon.Level || '50';
        
        pokemonDiv.innerHTML = `
            <strong>${name}</strong> (Lv. ${level})<br>
            <small>Types: ${Array.isArray(types) ? types.join(', ') : types}</small>
        `;
        
        previewElement.appendChild(pokemonDiv);
    });
}

// Populate Pokemon dropdown with team data
function populatePokemonDropdown(team, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    
    // Clear existing options except the first one
    while (dropdown.children.length > 1) {
        dropdown.removeChild(dropdown.lastChild);
    }
    
    // Add team Pokemon to dropdown
    team.forEach(pokemon => {
        const name = pokemon.name || pokemon.Name;
        if (name) {
            const option = new Option(name, name);
            dropdown.add(option);
        }
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Add initial move for attacker
    addMove('attacker');
}

// Show manual input form
function showManualInput(role) {
    const form = document.getElementById(`${role}-form`);
    form.classList.add('active');
}

// Add move to Pokemon
function addMove(role) {
    const container = document.getElementById(`${role}-moves`);
    addMoveToContainer(container);
}

// Remove move
function removeMove(button) {
    const moveInput = button.parentElement;
    moveInput.remove();
}

// Get Pokemon data from form
function getPokemonData(role) {
    const types = [];
    const type1 = document.getElementById(`${role}-type1`).value;
    const type2 = document.getElementById(`${role}-type2`).value;
    
    if (type1) types.push(type1);
    if (type2) types.push(type2);
    
    const moves = [];
    if (role === 'attacker') {
        const moveInputs = document.querySelectorAll('#attacker-moves .move-input');
        moveInputs.forEach(moveInput => {
            const name = moveInput.querySelector('.move-name').value;
            const type = moveInput.querySelector('.move-type').value;
            const power = moveInput.querySelector('.move-power').value;
            const category = moveInput.querySelector('.move-category').value;
            
            if (name && type && power) {
                moves.push({
                    name: name,
                    type: type,
                    damage: parseInt(power),
                    category: category
                });
            }
        });
    }
    
    return {
        name: document.getElementById(`${role}-name`).value || 'Unknown',
        type: types,
        level: parseInt(document.getElementById(`${role}-level`).value) || 50,
        hp: parseInt(document.getElementById(`${role}-hp`).value) || 100,
        attack: parseInt(document.getElementById(`${role}-attack`).value) || 75,
        defense: parseInt(document.getElementById(`${role}-defense`).value) || 75,
        special_attack: parseInt(document.getElementById(`${role}-sp-attack`).value) || 75,
        special_defense: parseInt(document.getElementById(`${role}-sp-defense`).value) || 75,
        speed: parseInt(document.getElementById(`${role}-speed`).value) || 75,
        moves: moves
    };
}

// Get battle conditions
function getBattleConditions() {
    return {
        critical: document.getElementById('critical-hit').checked,
        burn: document.getElementById('burned').checked,
        weather: document.getElementById('weather').value || null,
        screen: document.getElementById('screen').value || null,
        field: document.getElementById('field').value || null
    };
}

// Calculate damage
async function calculateDamage() {
    hideError();
    hideResults();
    
    try {
        const attacker = getPokemonData('attacker');
        const defender = getPokemonData('defender');
        const conditions = getBattleConditions();
        
        // Get the first move for calculation (or let user select)
        if (attacker.moves.length === 0) {
            showError('Please add at least one move to your Pokemon');
            return;
        }
        
        const move = attacker.moves[0]; // Use first move for now
        
        const requestData = {
            attacker: {
                name: attacker.name,
                type: attacker.type,
                level: attacker.level,
                attack: attacker.attack,
                special_attack: attacker.special_attack,
                defense: attacker.defense,
                special_defense: attacker.special_defense,
                speed: attacker.speed
            },
            defender: {
                name: defender.name,
                type: defender.type,
                level: defender.level,
                attack: defender.attack,
                special_attack: defender.special_attack,
                defense: defender.defense,
                special_defense: defender.special_defense,
                speed: defender.speed
            },
            move: move,
            ...conditions
        };
        
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/calculate-damage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        hideLoading();
        
        const result = await response.json();
        
        if (response.ok) {
            displayResults(result);
        } else {
            showError(result.error || 'Failed to calculate damage');
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error: ' + error.message);
    }
}

// Find best move
async function findBestMove() {
    hideError();
    hideResults();
    
    try {
        const attacker = getPokemonData('attacker');
        const defender = getPokemonData('defender');
        const conditions = getBattleConditions();
        
        if (attacker.moves.length === 0) {
            showError('Please add at least one move to your Pokemon');
            return;
        }
        
        const requestData = {
            attacker: {
                name: attacker.name,
                type: attacker.type,
                level: attacker.level,
                attack: attacker.attack,
                special_attack: attacker.special_attack,
                defense: attacker.defense,
                special_defense: attacker.special_defense,
                speed: attacker.speed,
                moves: attacker.moves
            },
            defender: {
                name: defender.name,
                type: defender.type,
                level: defender.level,
                attack: defender.attack,
                special_attack: defender.special_attack,
                defense: defender.defense,
                special_defense: defender.special_defense,
                speed: defender.speed
            }
        };
        
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/best-move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        hideLoading();
        
        const result = await response.json();
        
        if (response.ok) {
            displayBestMoveResult(result);
        } else {
            showError(result.error || 'Failed to find best move');
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error: ' + error.message);
    }
}

// Display results
function displayResults(result) {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    document.getElementById('max-damage').textContent = result.max_damage;
    document.getElementById('min-damage').textContent = result.min_damage;
    document.getElementById('crit-damage').textContent = result.crit_damage;
    
    // Format type effectiveness
    let effectivenessText = '1x';
    if (result.type_effectiveness === 0) effectivenessText = '0x (No effect)';
    else if (result.type_effectiveness === 0.25) effectivenessText = '0.25x';
    else if (result.type_effectiveness === 0.5) effectivenessText = '0.5x (Not very effective)';
    else if (result.type_effectiveness === 2) effectivenessText = '2x (Super effective)';
    else if (result.type_effectiveness === 4) effectivenessText = '4x (Super effective)';
    
    document.getElementById('type-effectiveness').textContent = effectivenessText;
    document.getElementById('stab').textContent = result.stab ? 'Yes (1.5x)' : 'No';
    
    // Hide best move result
    document.getElementById('best-move-result').style.display = 'none';
}

// Display best move result
function displayBestMoveResult(result) {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    const bestMoveResult = document.getElementById('best-move-result');
    bestMoveResult.style.display = 'block';
    
    document.getElementById('best-move-details').innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
            <pre style="color: white; font-family: monospace; white-space: pre-wrap;">${result.best_move}</pre>
        </div>
    `;
}

// Show error
function showError(message) {
    const errorSection = document.getElementById('error');
    const errorText = document.getElementById('error-text');
    
    errorText.textContent = message;
    errorSection.style.display = 'block';
}

// Hide error
function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Hide results
function hideResults() {
    document.getElementById('results').style.display = 'none';
}

// Show loading
function showLoading() {
    // You could add a loading spinner here
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.innerHTML = '<span class="loading"></span> Calculating...';
    calculateBtn.disabled = true;
}

// Hide loading
function hideLoading() {
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.innerHTML = 'Calculate Damage';
    calculateBtn.disabled = false;
}

// Clear all forms
function clearAll() {
    // Clear attacker form
    document.getElementById('attacker-select').value = '';
    document.getElementById('attacker-form').classList.remove('active');
    document.getElementById('attacker-moves').innerHTML = '';
    
    // Clear defender form
    document.getElementById('defender-select').value = '';
    document.getElementById('defender-form').classList.remove('active');
    
    // Clear battle conditions
    document.getElementById('critical-hit').checked = false;
    document.getElementById('burned').checked = false;
    document.getElementById('weather').value = '';
    document.getElementById('screen').value = '';
    document.getElementById('field').value = '';
    
    // Clear file uploads
    document.getElementById('team-upload').value = '';
    document.getElementById('opponent-upload').value = '';
    document.getElementById('team-file-info').textContent = 'No file selected';
    document.getElementById('opponent-file-info').textContent = 'No file selected';
    document.getElementById('team-preview').innerHTML = '';
    document.getElementById('opponent-preview').innerHTML = '';
    
    // Hide results and errors
    hideResults();
    hideError();
    
    // Reset global variables
    currentTeam = [];
    currentOpponent = [];
}
