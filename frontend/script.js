// Global variables
let currentTeam = [];
let currentOpponent = [];
let currentBossTeam = [];
let selectedBossPokemon = null;
let knockedOutPokemon = [];
const API_BASE_URL = '/api';

// Game to generation mapping
const GAME_GENERATIONS = {
    'Brilliant Diamond': 4,
    'Fire Red': 3,
    'Leaf Green': 3,
    'Emerald': 3,
    'Scarlet': 9,
    'Violet': 9
};

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

// Comprehensive moves database (Gen 1-9)
const MOVES_DATABASE = [
    // Normal
    { name: 'Tackle', type: 'normal', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Quick Attack', type: 'normal', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Slash', type: 'normal', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Hyper Beam', type: 'normal', power: 150, category: 'special', accuracy: 90 },
    { name: 'Giga Impact', type: 'normal', power: 150, category: 'physical', accuracy: 90 },
    { name: 'Extreme Speed', type: 'normal', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Facade', type: 'normal', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Body Slam', type: 'normal', power: 85, category: 'physical', accuracy: 100 },
    { name: 'Return', type: 'normal', power: 102, category: 'physical', accuracy: 100 },
    { name: 'Double-Edge', type: 'normal', power: 120, category: 'physical', accuracy: 100 },
    // Fire
    { name: 'Ember', type: 'fire', power: 40, category: 'special', accuracy: 100 },
    { name: 'Flamethrower', type: 'fire', power: 90, category: 'special', accuracy: 100 },
    { name: 'Fire Blast', type: 'fire', power: 110, category: 'special', accuracy: 85 },
    { name: 'Fire Punch', type: 'fire', power: 75, category: 'physical', accuracy: 100 },
    { name: 'Flare Blitz', type: 'fire', power: 120, category: 'physical', accuracy: 100 },
    { name: 'Heat Wave', type: 'fire', power: 95, category: 'special', accuracy: 90 },
    { name: 'Blast Burn', type: 'fire', power: 150, category: 'special', accuracy: 90 },
    { name: 'Mystical Fire', type: 'fire', power: 75, category: 'special', accuracy: 100 },
    // Water
    { name: 'Water Gun', type: 'water', power: 40, category: 'special', accuracy: 100 },
    { name: 'Bubble Beam', type: 'water', power: 65, category: 'special', accuracy: 100 },
    { name: 'Surf', type: 'water', power: 90, category: 'special', accuracy: 100 },
    { name: 'Hydro Pump', type: 'water', power: 110, category: 'special', accuracy: 80 },
    { name: 'Aqua Tail', type: 'water', power: 90, category: 'physical', accuracy: 90 },
    { name: 'Scald', type: 'water', power: 80, category: 'special', accuracy: 100 },
    { name: 'Hydro Cannon', type: 'water', power: 150, category: 'special', accuracy: 90 },
    { name: 'Liquidation', type: 'water', power: 85, category: 'physical', accuracy: 100 },
    { name: 'Wave Crash', type: 'water', power: 120, category: 'physical', accuracy: 100 },
    // Electric
    { name: 'Thunder Shock', type: 'electric', power: 40, category: 'special', accuracy: 100 },
    { name: 'Thunderbolt', type: 'electric', power: 90, category: 'special', accuracy: 100 },
    { name: 'Thunder', type: 'electric', power: 110, category: 'special', accuracy: 70 },
    { name: 'Thunder Punch', type: 'electric', power: 75, category: 'physical', accuracy: 100 },
    { name: 'Volt Switch', type: 'electric', power: 70, category: 'special', accuracy: 100 },
    { name: 'Wild Charge', type: 'electric', power: 90, category: 'physical', accuracy: 100 },
    { name: 'Discharge', type: 'electric', power: 80, category: 'special', accuracy: 100 },
    // Grass
    { name: 'Vine Whip', type: 'grass', power: 45, category: 'physical', accuracy: 100 },
    { name: 'Razor Leaf', type: 'grass', power: 55, category: 'physical', accuracy: 95 },
    { name: 'Giga Drain', type: 'grass', power: 75, category: 'special', accuracy: 100 },
    { name: 'Solar Beam', type: 'grass', power: 120, category: 'special', accuracy: 100 },
    { name: 'Leaf Blade', type: 'grass', power: 90, category: 'physical', accuracy: 100 },
    { name: 'Energy Ball', type: 'grass', power: 90, category: 'special', accuracy: 100 },
    { name: 'Petal Dance', type: 'grass', power: 120, category: 'special', accuracy: 100 },
    { name: 'Frenzy Plant', type: 'grass', power: 150, category: 'special', accuracy: 90 },
    { name: 'Leaf Storm', type: 'grass', power: 130, category: 'special', accuracy: 90 },
    { name: 'Seed Bomb', type: 'grass', power: 80, category: 'physical', accuracy: 100 },
    // Ice
    { name: 'Ice Shard', type: 'ice', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Ice Beam', type: 'ice', power: 90, category: 'special', accuracy: 100 },
    { name: 'Blizzard', type: 'ice', power: 110, category: 'special', accuracy: 70 },
    { name: 'Ice Punch', type: 'ice', power: 75, category: 'physical', accuracy: 100 },
    { name: 'Icicle Crash', type: 'ice', power: 85, category: 'physical', accuracy: 90 },
    { name: 'Freeze-Dry', type: 'ice', power: 70, category: 'special', accuracy: 100 },
    // Fighting
    { name: 'Karate Chop', type: 'fighting', power: 50, category: 'physical', accuracy: 100 },
    { name: 'Dynamic Punch', type: 'fighting', power: 100, category: 'physical', accuracy: 50 },
    { name: 'Close Combat', type: 'fighting', power: 120, category: 'physical', accuracy: 100 },
    { name: 'Aura Sphere', type: 'fighting', power: 80, category: 'special', accuracy: 100 },
    { name: 'Focus Blast', type: 'fighting', power: 120, category: 'special', accuracy: 70 },
    { name: 'High Jump Kick', type: 'fighting', power: 130, category: 'physical', accuracy: 90 },
    { name: 'Superpower', type: 'fighting', power: 120, category: 'physical', accuracy: 100 },
    { name: 'Mach Punch', type: 'fighting', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Cross Chop', type: 'fighting', power: 100, category: 'physical', accuracy: 80 },
    // Poison
    { name: 'Poison Sting', type: 'poison', power: 15, category: 'physical', accuracy: 100 },
    { name: 'Acid', type: 'poison', power: 40, category: 'special', accuracy: 100 },
    { name: 'Sludge Bomb', type: 'poison', power: 90, category: 'special', accuracy: 100 },
    { name: 'Poison Jab', type: 'poison', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Sludge Wave', type: 'poison', power: 95, category: 'special', accuracy: 100 },
    { name: 'Gunk Shot', type: 'poison', power: 120, category: 'physical', accuracy: 80 },
    { name: 'Cross Poison', type: 'poison', power: 70, category: 'physical', accuracy: 100 },
    // Ground
    { name: 'Sand Attack', type: 'ground', power: 0, category: 'status', accuracy: 100 },
    { name: 'Mud Shot', type: 'ground', power: 55, category: 'special', accuracy: 95 },
    { name: 'Dig', type: 'ground', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Earthquake', type: 'ground', power: 100, category: 'physical', accuracy: 100 },
    { name: 'Mud Bomb', type: 'ground', power: 65, category: 'special', accuracy: 85 },
    { name: 'Earth Power', type: 'ground', power: 90, category: 'special', accuracy: 100 },
    { name: 'High Horsepower', type: 'ground', power: 95, category: 'physical', accuracy: 95 },
    { name: 'Scorching Sands', type: 'ground', power: 70, category: 'special', accuracy: 100 },
    // Flying
    { name: 'Gust', type: 'flying', power: 40, category: 'special', accuracy: 100 },
    { name: 'Peck', type: 'flying', power: 35, category: 'physical', accuracy: 100 },
    { name: 'Aerial Ace', type: 'flying', power: 60, category: 'physical', accuracy: 100 },
    { name: 'Drill Peck', type: 'flying', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Air Slash', type: 'flying', power: 75, category: 'special', accuracy: 95 },
    { name: 'Brave Bird', type: 'flying', power: 120, category: 'physical', accuracy: 100 },
    { name: 'Hurricane', type: 'flying', power: 110, category: 'special', accuracy: 70 },
    { name: 'Acrobatics', type: 'flying', power: 55, category: 'physical', accuracy: 100 },
    // Psychic
    { name: 'Confusion', type: 'psychic', power: 50, category: 'special', accuracy: 100 },
    { name: 'Psybeam', type: 'psychic', power: 65, category: 'special', accuracy: 100 },
    { name: 'Psychic', type: 'psychic', power: 90, category: 'special', accuracy: 100 },
    { name: 'Psycho Cut', type: 'psychic', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Zen Headbutt', type: 'psychic', power: 80, category: 'physical', accuracy: 90 },
    { name: 'Psyshock', type: 'psychic', power: 80, category: 'special', accuracy: 100 },
    { name: 'Future Sight', type: 'psychic', power: 120, category: 'special', accuracy: 100 },
    { name: 'Stored Power', type: 'psychic', power: 20, category: 'special', accuracy: 100 },
    // Bug
    { name: 'Bug Bite', type: 'bug', power: 60, category: 'physical', accuracy: 100 },
    { name: 'Signal Beam', type: 'bug', power: 75, category: 'special', accuracy: 100 },
    { name: 'X-Scissor', type: 'bug', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Bug Buzz', type: 'bug', power: 90, category: 'special', accuracy: 100 },
    { name: 'Megahorn', type: 'bug', power: 120, category: 'physical', accuracy: 85 },
    { name: 'Leech Life', type: 'bug', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Lunge', type: 'bug', power: 80, category: 'physical', accuracy: 100 },
    // Rock
    { name: 'Rock Throw', type: 'rock', power: 50, category: 'physical', accuracy: 90 },
    { name: 'Rollout', type: 'rock', power: 30, category: 'physical', accuracy: 90 },
    { name: 'Ancient Power', type: 'rock', power: 60, category: 'special', accuracy: 100 },
    { name: 'Rock Slide', type: 'rock', power: 75, category: 'physical', accuracy: 90 },
    { name: 'Power Gem', type: 'rock', power: 80, category: 'special', accuracy: 100 },
    { name: 'Stone Edge', type: 'rock', power: 100, category: 'physical', accuracy: 80 },
    { name: 'Head Smash', type: 'rock', power: 150, category: 'physical', accuracy: 80 },
    { name: 'Meteor Beam', type: 'rock', power: 120, category: 'special', accuracy: 90 },
    // Ghost
    { name: 'Lick', type: 'ghost', power: 30, category: 'physical', accuracy: 100 },
    { name: 'Shadow Punch', type: 'ghost', power: 60, category: 'physical', accuracy: 100 },
    { name: 'Shadow Ball', type: 'ghost', power: 80, category: 'special', accuracy: 100 },
    { name: 'Shadow Claw', type: 'ghost', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Hex', type: 'ghost', power: 65, category: 'special', accuracy: 100 },
    { name: 'Phantom Force', type: 'ghost', power: 90, category: 'physical', accuracy: 100 },
    { name: 'Shadow Sneak', type: 'ghost', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Poltergeist', type: 'ghost', power: 110, category: 'physical', accuracy: 90 },
    // Dragon
    { name: 'Dragon Breath', type: 'dragon', power: 60, category: 'special', accuracy: 100 },
    { name: 'Dragon Claw', type: 'dragon', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Dragon Pulse', type: 'dragon', power: 85, category: 'special', accuracy: 100 },
    { name: 'Outrage', type: 'dragon', power: 120, category: 'physical', accuracy: 100 },
    { name: 'Draco Meteor', type: 'dragon', power: 130, category: 'special', accuracy: 90 },
    { name: 'Dragon Rush', type: 'dragon', power: 100, category: 'physical', accuracy: 75 },
    { name: 'Dragon Tail', type: 'dragon', power: 60, category: 'physical', accuracy: 90 },
    { name: 'Breaking Swipe', type: 'dragon', power: 60, category: 'physical', accuracy: 100 },
    // Dark
    { name: 'Bite', type: 'dark', power: 60, category: 'physical', accuracy: 100 },
    { name: 'Feint Attack', type: 'dark', power: 60, category: 'physical', accuracy: 100 },
    { name: 'Crunch', type: 'dark', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Dark Pulse', type: 'dark', power: 80, category: 'special', accuracy: 100 },
    { name: 'Night Slash', type: 'dark', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Sucker Punch', type: 'dark', power: 70, category: 'physical', accuracy: 100 },
    { name: 'Foul Play', type: 'dark', power: 95, category: 'physical', accuracy: 100 },
    { name: 'Darkest Lariat', type: 'dark', power: 85, category: 'physical', accuracy: 100 },
    { name: 'Throat Chop', type: 'dark', power: 80, category: 'physical', accuracy: 100 },
    // Steel
    { name: 'Metal Claw', type: 'steel', power: 50, category: 'physical', accuracy: 95 },
    { name: 'Steel Wing', type: 'steel', power: 70, category: 'physical', accuracy: 90 },
    { name: 'Iron Head', type: 'steel', power: 80, category: 'physical', accuracy: 100 },
    { name: 'Flash Cannon', type: 'steel', power: 80, category: 'special', accuracy: 100 },
    { name: 'Meteor Mash', type: 'steel', power: 90, category: 'physical', accuracy: 90 },
    { name: 'Bullet Punch', type: 'steel', power: 40, category: 'physical', accuracy: 100 },
    { name: 'Steel Beam', type: 'steel', power: 140, category: 'special', accuracy: 95 },
    { name: 'Heavy Slam', type: 'steel', power: 100, category: 'physical', accuracy: 100 },
    // Fairy
    { name: 'Fairy Wind', type: 'fairy', power: 40, category: 'special', accuracy: 100 },
    { name: 'Draining Kiss', type: 'fairy', power: 50, category: 'special', accuracy: 100 },
    { name: 'Play Rough', type: 'fairy', power: 90, category: 'physical', accuracy: 90 },
    { name: 'Moonblast', type: 'fairy', power: 95, category: 'special', accuracy: 100 },
    { name: 'Dazzling Gleam', type: 'fairy', power: 80, category: 'special', accuracy: 100 },
    { name: 'Spirit Break', type: 'fairy', power: 75, category: 'physical', accuracy: 100 }
];

// Common abilities database
const ABILITIES_DATABASE = [
    'Overgrow', 'Blaze', 'Torrent', 'Shield Dust', 'Shed Skin', 'Compound Eyes', 'Swarm',
    'Keen Eye', 'Run Away', 'Static', 'Lightning Rod', 'Sand Veil', 'Poison Point', ' rivalry',
    'Cute Charm', 'Magic Guard', 'Flash Fire', 'Drought', 'Rain Dish', 'Synchronize',
    'Inner Focus', 'Intimidate', 'Guts', 'Thick Fat', 'Huge Power', 'Levitate',
    'Effect Spore', 'Pickup', 'Technician', 'Skill Link', 'Pressure', 'Super Luck',
    'Serene Grace', 'Sturdy', 'Damp', 'Volt Absorb', 'Water Absorb', 'Rock Head',
    'Reckless', 'Iron Fist', 'Natural Cure', 'Quick Feet', 'Download', 'Adaptability',
    'Regenerator', 'Defiant', 'Justified', 'Moxie', 'Speed Boost', 'Protean',
    'Intrepid Sword', 'Libero', 'Unseen Fist', 'Chilling Neigh', 'Grim Neigh'
];

// Sample moves data (kept for backwards compatibility)
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

// Search and fill move details
function searchMove(input, role) {
    const query = input.value.toLowerCase();
    if (query.length < 2) return;
    
    const datalistId = `${role}-moves-list`;
    let datalist = document.getElementById(datalistId);
    
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        document.body.appendChild(datalist);
    }
    
    // Clear and populate with matching moves
    datalist.innerHTML = '';
    const matches = MOVES_DATABASE.filter(move => 
        move.name.toLowerCase().includes(query)
    ).slice(0, 10);
    
    matches.forEach(move => {
        const option = document.createElement('option');
        option.value = move.name;
        option.dataset.type = move.type;
        option.dataset.power = move.power;
        option.dataset.category = move.category;
        datalist.appendChild(option);
    });
}

// Fill move details when selected
function fillMoveDetails(input, role) {
    const moveName = input.value;
    const move = MOVES_DATABASE.find(m => m.name.toLowerCase() === moveName.toLowerCase());
    
    if (!move) return;
    
    // Find the move input container
    const moveContainer = input.closest('.move-input');
    if (!moveContainer) return;
    
    // Fill in the hidden move name
    const nameInput = moveContainer.querySelector('.move-name');
    if (nameInput) nameInput.value = move.name;
    
    // Fill in type
    const typeSelect = moveContainer.querySelector('.move-type');
    if (typeSelect) {
        typeSelect.value = move.type;
        typeSelect.disabled = false;
    }
    
    // Fill in power
    const powerInput = moveContainer.querySelector('.move-power');
    if (powerInput) {
        powerInput.value = move.power;
        powerInput.disabled = false;
    }
    
    // Fill in category
    const categorySelect = moveContainer.querySelector('.move-category');
    if (categorySelect) {
        categorySelect.value = move.category;
        categorySelect.disabled = false;
    }
}

// Load abilities into dropdowns
function loadAbilities() {
    const attackerAbility = document.getElementById('attacker-ability');
    const defenderAbility = document.getElementById('defender-ability');
    
    if (attackerAbility) {
        attackerAbility.innerHTML = '<option value="">None</option>';
        ABILITIES_DATABASE.forEach(ability => {
            const option = document.createElement('option');
            option.value = ability.toLowerCase().replace(/\s+/g, '-');
            option.textContent = ability;
            attackerAbility.appendChild(option);
        });
    }
    
    if (defenderAbility) {
        defenderAbility.innerHTML = '<option value="">None</option>';
        ABILITIES_DATABASE.forEach(ability => {
            const option = document.createElement('option');
            option.value = ability.toLowerCase().replace(/\s+/g, '-');
            option.textContent = ability;
            defenderAbility.appendChild(option);
        });
    }
}

// Predict enemy's next move using game AI logic
function predictEnemyMove() {
    const defenderMoves = [];
    const moveInputs = document.querySelectorAll('#defender-moves .move-input');
    
    moveInputs.forEach(moveInput => {
        const name = moveInput.querySelector('.move-name')?.value;
        const type = moveInput.querySelector('.move-type')?.value;
        const power = parseInt(moveInput.querySelector('.move-power')?.value) || 0;
        const category = moveInput.querySelector('.move-category')?.value;
        
        if (name && power > 0) {
            defenderMoves.push({ name, type, power, category });
        }
    });
    
    if (defenderMoves.length === 0) return null;
    
    // Game AI Logic: Prioritize moves based on:
    // 1. STAB (Same Type Attack Bonus) - 40% weight
    // 2. Super effective moves - 35% weight
    // 3. Highest base power - 25% weight
    
    const attackerTypes = [
        document.getElementById('attacker-type1')?.value,
        document.getElementById('attacker-type2')?.value
    ].filter(Boolean);
    
    const defenderTypes = [
        document.getElementById('defender-type1')?.value,
        document.getElementById('defender-type2')?.value
    ].filter(Boolean);
    
    let bestMove = null;
    let bestScore = -1;
    
    defenderMoves.forEach(move => {
        let score = 0;
        
        // STAB bonus (40 points)
        if (defenderTypes.includes(move.type)) {
            score += 40;
        }
        
        // Super effective check (35 points)
        const effectiveness = getEffectiveness(move.type, attackerTypes);
        if (effectiveness > 1) {
            score += 35 * effectiveness;
        } else if (effectiveness < 1) {
            score -= 35 * (1 - effectiveness);
        }
        
        // Power weighting (0-25 points)
        score += (move.power / 150) * 25;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });
    
    return bestMove;
}

// Get type effectiveness
function getEffectiveness(attackType, defenderTypes) {
    const typeChart = {
        normal: { rock: 0.5, ghost: 0, steel: 0.5 },
        fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
        water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
        electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
        grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
        ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
        fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
        poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
        ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
        flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
        psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
        bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
        rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
        ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
        dragon: { dragon: 2, steel: 0.5, fairy: 0 },
        dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
        steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
        fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
    };
    
    let effectiveness = 1;
    defenderTypes.forEach(defType => {
        const multipliers = typeChart[attackType] || {};
        effectiveness *= multipliers[defType] !== undefined ? multipliers[defType] : 1;
    });
    
    return effectiveness;
}

// Update enemy prediction display
function updateEnemyPrediction() {
    const predictedMove = predictEnemyMove();
    const predictionCard = document.getElementById('enemy-prediction-card');
    
    if (!predictedMove || !predictionCard) {
        if (predictionCard) predictionCard.style.display = 'none';
        return;
    }
    
    predictionCard.style.display = 'block';
    document.getElementById('predicted-move').textContent = predictedMove.name;
    
    // Calculate confidence based on move score
    let confidence = 'Medium';
    const defenderTypes = [
        document.getElementById('defender-type1')?.value,
        document.getElementById('defender-type2')?.value
    ].filter(Boolean);
    
    if (defenderTypes.includes(predictedMove.type)) {
        confidence = 'High (STAB)';
    }
    
    const effectiveness = getEffectiveness(predictedMove.type, [
        document.getElementById('attacker-type1')?.value,
        document.getElementById('attacker-type2')?.value
    ].filter(Boolean));
    
    if (effectiveness >= 2) {
        confidence = 'High (Super Effective)';
    }
    
    document.getElementById('prediction-confidence').textContent = confidence;
    
    // Calculate expected damage (simplified)
    const attackerHP = parseInt(document.getElementById('attacker-hp')?.value) || 100;
    const damagePercent = Math.min(100, Math.round((predictedMove.power / 150) * 50));
    document.getElementById('predicted-damage').textContent = `~${damagePercent}% HP`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializePokemonDropdowns();
    setupPokemonSearch('attacker');
    setupPokemonSearch('defender');
    setupFileUploadHandlers();
    setupFormHandlers();
    setupBossTeamImport();
    loadHeldItems();
    loadAbilities();
});

// Initialize Pokemon dropdowns
function initializePokemonDropdowns() {
    const attackerList = document.getElementById('attacker-pokemon-list');
    const defenderList = document.getElementById('defender-pokemon-list');
    
    // Add sample Pokemon to datalists
    samplePokemon.forEach(pokemon => {
        const option1 = document.createElement('option');
        option1.value = pokemon.name;
        attackerList.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = pokemon.name;
        defenderList.appendChild(option2);
    });
    
    // Add change handlers for search inputs
    const attackerSearch = document.getElementById('attacker-search');
    const defenderSearch = document.getElementById('defender-search');
    
    attackerSearch.addEventListener('change', function() {
        if (this.value) {
            loadPokemonData(this.value, 'attacker');
        }
    });
    
    defenderSearch.addEventListener('change', function() {
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
                populatePokemonDropdown(data, 'attacker-pokemon-list');
            } else {
                currentOpponent = data;
                displayTeamPreview(data, preview);
                populatePokemonDropdown(data, 'defender-pokemon-list');
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
        const types = pokemon.type || pokemon.types || pokemon.Type || 'Unknown';
        const level = pokemon.level || pokemon.Level || '50';
        
        // Format types for display
        let typeDisplay = '';
        if (Array.isArray(types)) {
            typeDisplay = types.join(' / ');
        } else if (types) {
            typeDisplay = types;
        } else {
            typeDisplay = 'Unknown';
        }
        
        pokemonDiv.innerHTML = `
            <strong>${name}</strong> (Lv. ${level})<br>
            <small>Type: ${typeDisplay}</small>
        `;
        
        previewElement.appendChild(pokemonDiv);
    });
}

// Populate Pokemon dropdown with team data
function populatePokemonDropdown(team, listId) {
    const datalist = document.getElementById(listId);
    
    // Clear existing options except the first one
    while (datalist.children.length > 1) {
        datalist.removeChild(datalist.lastChild);
    }
    
    // Add team Pokemon to datalist
    team.forEach(pokemon => {
        const name = pokemon.name || pokemon.Name;
        if (name) {
            const option = document.createElement('option');
            option.value = name;
            datalist.appendChild(option);
        }
    });
}

// Fetch Pokemon data from PokeAPI via backend
async function fetchPokemonFromAPI(pokemonName, role) {
    if (!pokemonName) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonName}`);
        
        if (!response.ok) {
            console.log(`Pokemon ${pokemonName} not found in API`);
            return;
        }
        
        const data = await response.json();
        
        // Populate form fields with fetched data
        document.getElementById(`${role}-name`).value = data.name;
        document.getElementById(`${role}-type1`).value = data.types[0] || '';
        document.getElementById(`${role}-type2`).value = data.types[1] || '';
        document.getElementById(`${role}-hp`).value = data.stats.hp || 50;
        document.getElementById(`${role}-attack`).value = data.stats.attack || 50;
        document.getElementById(`${role}-defense`).value = data.stats.defense || 50;
        document.getElementById(`${role}-sp-attack`).value = data.stats.special_attack || 50;
        document.getElementById(`${role}-sp-defense`).value = data.stats.special_defense || 50;
        document.getElementById(`${role}-speed`).value = data.stats.speed || 50;
        
        // Update stats display
        updateUserStatsDisplay();
        
        console.log(`Fetched ${data.name} from PokeAPI:`, data);
        
    } catch (error) {
        console.error(`Error fetching ${pokemonName}:`, error);
    }
}

// Setup Pokemon search with debouncing
let searchTimeout;
function setupPokemonSearch(role) {
    const searchInput = document.getElementById(`${role}-search`);
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        
        if (query.length >= 3) {
            searchTimeout = setTimeout(() => {
                searchPokemonAPI(query, `${role}-pokemon-list`);
            }, 500);
        }
    });
    
    // Also fetch full data when user selects a Pokemon
    searchInput.addEventListener('change', (e) => {
        fetchPokemonFromAPI(e.target.value, role);
    });
}

// Search Pokemon via API
async function searchPokemonAPI(query, listId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon/search/${query}`);
        
        if (!response.ok) return;
        
        const data = await response.json();
        const datalist = document.getElementById(listId);
        
        // Clear existing options
        datalist.innerHTML = '';
        
        // Add search results
        data.results.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            datalist.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error searching Pokemon:', error);
    }
}

// Setup form handlers
function setupFormHandlers() {
    // Add initial move for attacker
    addMove('attacker');
    
    // Add event listeners to update enemy prediction when defender changes
    const defenderInputs = document.querySelectorAll('#defender-form input, #defender-form select');
    defenderInputs.forEach(input => {
        input.addEventListener('change', updateEnemyPrediction);
    });
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
    
    // Get stat boosts
    const statBoosts = {
        attack: parseInt(document.getElementById(`${role}-attack-boost`).value) || 0,
        defense: parseInt(document.getElementById(`${role}-defense-boost`).value) || 0,
        special_attack: parseInt(document.getElementById(`${role}-sp-attack-boost`).value) || 0,
        special_defense: parseInt(document.getElementById(`${role}-sp-defense-boost`).value) || 0,
        speed: parseInt(document.getElementById(`${role}-speed-boost`).value) || 0
    };
    
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
        moves: moves,
        stat_boosts: statBoosts,
        held_item: document.getElementById(`${role}-item`).value || null
    };
}

// Get battle conditions
function getBattleConditions() {
    return {
        generation: parseInt(document.getElementById('generation').value) || 8,
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
                speed: attacker.speed,
                stat_boosts: attacker.stat_boosts
            },
            defender: {
                name: defender.name,
                type: defender.type,
                level: defender.level,
                attack: defender.attack,
                special_attack: defender.special_attack,
                defense: defender.defense,
                special_defense: defender.special_defense,
                speed: defender.speed,
                stat_boosts: defender.stat_boosts
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
                moves: attacker.moves,
                stat_boosts: attacker.stat_boosts
            },
            defender: {
                name: defender.name,
                type: defender.type,
                level: defender.level,
                attack: defender.attack,
                special_attack: defender.special_attack,
                defense: defender.defense,
                special_defense: defender.special_defense,
                speed: defender.speed,
                stat_boosts: defender.stat_boosts
            },
            generation: conditions.generation
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
    
    // Update enemy prediction
    updateEnemyPrediction();
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
    document.getElementById('attacker-search').value = '';
    document.getElementById('attacker-form').classList.remove('active');
    document.getElementById('attacker-moves').innerHTML = '';
    
    // Clear defender form
    document.getElementById('defender-search').value = '';
    document.getElementById('defender-form').classList.remove('active');
    
    // Clear battle conditions
    document.getElementById('generation').value = '8';
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

// Setup boss team import functionality
function setupBossTeamImport() {
    const gameSelect = document.getElementById('boss-game-select');
    
    if (!gameSelect) {
        console.error('Boss game select element not found');
        return;
    }
    
    console.log('Boss game select found, setting up event listener');
    
    // Load available games
    loadAvailableGames();
    
    // Handle game selection
    gameSelect.addEventListener('change', function() {
        console.log('Game selected:', this.value);
        if (this.value) {
            loadBossTeams(this.value);
        } else {
            document.getElementById('boss-teams-container').style.display = 'none';
        }
    });
}

// Load available games
async function loadAvailableGames() {
    try {
        console.log('Fetching available games from:', `${API_BASE_URL}/boss-teams`);
        const response = await fetch(`${API_BASE_URL}/boss-teams`);
        const data = await response.json();
        
        console.log('Games response:', data);
        
        if (response.ok && data.games) {
            const gameSelect = document.getElementById('boss-game-select');
            gameSelect.innerHTML = '<option value="">Select a game...</option>';
            
            data.games.forEach(game => {
                const option = document.createElement('option');
                option.value = game;
                option.textContent = game;
                gameSelect.appendChild(option);
            });
            console.log('Games loaded successfully');
        } else {
            console.error('Failed to load games:', data.error);
        }
    } catch (error) {
        console.error('Failed to load available games:', error);
    }
}

// Load boss teams for selected game
async function loadBossTeams(gameName) {
    try {
        console.log('Loading boss teams for:', gameName);
        const response = await fetch(`${API_BASE_URL}/boss-teams/${gameName}`);
        const data = await response.json();
        
        console.log('Boss teams response:', data);
        
        if (response.ok) {
            displayBossTeams(data, gameName);
        } else {
            console.error('Failed to load boss teams:', data.error);
        }
    } catch (error) {
        console.error('Failed to load boss teams:', error);
    }
}

// Game-specific gym leader orders
const GYM_LEADER_ORDERS = {
    'Red': ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni'],
    'Blue': ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni'],
    'Yellow': ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni'],
    'Gold': ['Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair'],
    'Silver': ['Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair'],
    'Crystal': ['Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair'],
    'Ruby': ['Roxanne', 'Brawly', 'Wattson', 'Flannery', 'Norman', 'Winona', 'Tate and Liza', 'Juan'],
    'Sapphire': ['Roxanne', 'Brawly', 'Wattson', 'Flannery', 'Norman', 'Winona', 'Tate and Liza', 'Juan'],
    'Emerald': ['Roxanne', 'Brawly', 'Wattson', 'Flannery', 'Norman', 'Winona', 'Tate and Liza', 'Juan'],
    'Fire Red': ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni'],
    'Leaf Green': ['Brock', 'Misty', 'Lt. Surge', 'Erika', 'Koga', 'Sabrina', 'Blaine', 'Giovanni'],
    'Diamond': ['Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner'],
    'Pearl': ['Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner'],
    'Platinum': ['Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner'],
    'Heart Gold': ['Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair'],
    'Soul Silver': ['Falkner', 'Bugsy', 'Whitney', 'Morty', 'Chuck', 'Jasmine', 'Pryce', 'Clair'],
    'Black': ['Cilan', 'Lenora', 'Burgh', 'Elesa', 'Clay', 'Skyla', 'Brycen', 'Drayden'],
    'White': ['Cilan', 'Lenora', 'Burgh', 'Elesa', 'Clay', 'Skyla', 'Brycen', 'Drayden'],
    'Black 2': ['Cheren', 'Roxie', 'Burgh', 'Elesa', 'Clay', 'Skyla', 'Drayden', 'Marlon'],
    'White 2': ['Cheren', 'Roxie', 'Burgh', 'Elesa', 'Clay', 'Skyla', 'Draylen', 'Marlon'],
    'Brilliant Diamond': ['Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner'],
    'Shining Pearl': ['Roark', 'Gardenia', 'Maylene', 'Crasher Wake', 'Fantina', 'Byron', 'Candice', 'Volkner'],
    'Scarlet': ['Katy', 'Brassius', 'Iono', 'Kofu', 'Larry', 'Ryme', 'Tulip', 'Grusha'],
    'Violet': ['Katy', 'Brassius', 'Iono', 'Kofu', 'Larry', 'Ryme', 'Tulip', 'Grusha']
};

// Display boss teams
function displayBossTeams(data, gameName) {
    console.log('Displaying boss teams for:', gameName, data);
    const container = document.getElementById('boss-teams-container');
    container.style.display = 'block';
    
    // Clear previous boss lists
    document.getElementById('gym-leaders-list').innerHTML = '';
    document.getElementById('elite-four-list').innerHTML = '';
    document.getElementById('champion-list').innerHTML = '';
    document.getElementById('rival-battles-list').innerHTML = '';
    
    // Create case-insensitive lookup for leaders
    const leaders = data.gym_leaders || {};
    const leadersLower = {};
    Object.keys(leaders).forEach(key => {
        leadersLower[key.toLowerCase()] = { originalKey: key, data: leaders[key] };
    });
    
    // Display gym leaders - use game-specific order if available, otherwise show all
    if (data.gym_leaders) {
        console.log('Gym leaders:', Object.keys(data.gym_leaders));
        const order = GYM_LEADER_ORDERS[gameName] || Object.keys(data.gym_leaders);
        
        // Try to use ordered list first (case-insensitive lookup)
        const displayedLeaders = new Set();
        
        order.forEach(leaderName => {
            const lookup = leadersLower[leaderName.toLowerCase()];
            if (lookup) {
                const leaderDiv = createBossTeamButton(lookup.originalKey, lookup.data, 'gym_leaders');
                document.getElementById('gym-leaders-list').appendChild(leaderDiv);
                displayedLeaders.add(lookup.originalKey);
            }
        });
        
        // Add any leaders not in the order list
        Object.keys(leaders).forEach(leaderName => {
            if (!displayedLeaders.has(leaderName)) {
                const leaderDiv = createBossTeamButton(leaderName, leaders[leaderName], 'gym_leaders');
                document.getElementById('gym-leaders-list').appendChild(leaderDiv);
            }
        });
    } else {
        console.log('No gym leaders found');
    }
    
    // Display elite four
    if (data.elite_four) {
        console.log('Elite four:', Object.keys(data.elite_four));
        Object.keys(data.elite_four).forEach(memberName => {
            const memberDiv = createBossTeamButton(memberName, data.elite_four[memberName], 'elite_four');
            document.getElementById('elite-four-list').appendChild(memberDiv);
        });
    } else {
        console.log('No elite four found');
    }
    
    // Display champion
    if (data.champion) {
        console.log('Champion:', Object.keys(data.champion));
        Object.keys(data.champion).forEach(championName => {
            const championDiv = createBossTeamButton(championName, data.champion[championName], 'champion');
            document.getElementById('champion-list').appendChild(championDiv);
        });
    } else {
        console.log('No champion found');
    }
    
    // Display rival battles
    if (data.rival_battles) {
        console.log('Rival battles:', Object.keys(data.rival_battles));
        Object.keys(data.rival_battles).forEach(rivalName => {
            const rivalDiv = createBossTeamButton(rivalName, data.rival_battles[rivalName], 'rival_battles');
            document.getElementById('rival-battles-list').appendChild(rivalDiv);
        });
    } else {
        console.log('No rival battles found');
        document.getElementById('rival-battles-list').parentElement.style.display = 'none';
    }
}

// Create boss team button
function createBossTeamButton(name, team, category) {
    const div = document.createElement('div');
    div.className = 'boss-team-item';
    
    const button = document.createElement('button');
    button.className = 'boss-team-btn';
    button.textContent = name;
    button.onclick = () => importBossTeam(team);
    
    div.appendChild(button);
    return div;
}

// Import boss team as opponent
function importBossTeam(team) {
    currentBossTeam = team;
    knockedOutPokemon = []; // Reset knockout tracking
    
    // Display team preview in boss section
    const preview = document.getElementById('boss-team-display');
    displayTeamPreview(team, preview);
    
    // Show the preview section
    document.getElementById('boss-team-preview').style.display = 'block';
    
    // Set generation based on selected game
    const gameSelect = document.getElementById('boss-game-select');
    const selectedGame = gameSelect.value;
    if (GAME_GENERATIONS[selectedGame]) {
        document.getElementById('generation').value = GAME_GENERATIONS[selectedGame];
    }
    
    // Make Pokemon clickable in preview
    const pokemonItems = preview.querySelectorAll('div');
    pokemonItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.onclick = () => selectBossPokemon(index);
    });
    
    // Update knockout tracker
    updateKnockoutTracker();
}

// Select a Pokemon from the boss team
function selectBossPokemon(index) {
    selectedBossPokemon = index;
    
    // Highlight selected Pokemon
    const preview = document.getElementById('boss-team-display');
    const pokemonItems = preview.querySelectorAll('div');
    pokemonItems.forEach((item, i) => {
        if (i === index) {
            item.style.background = 'rgba(255, 255, 255, 0.3)';
            item.style.border = '2px solid white';
        } else {
            item.style.background = '';
            item.style.border = '';
        }
    });
}

// Load selected boss Pokemon into form
function loadSelectedBossPokemon() {
    if (selectedBossPokemon === null || !currentBossTeam[selectedBossPokemon]) {
        alert('Please select a Pokemon from the team first');
        return;
    }
    
    const pokemon = currentBossTeam[selectedBossPokemon];
    loadBossPokemonData(pokemon, 'defender');
    
    // Also populate the opponent dropdown
    populatePokemonDropdown(currentBossTeam, 'defender-pokemon-list');
    
    // Update file info
    document.getElementById('opponent-file-info').textContent = 'Imported: Boss Team';
    
    showManualInput('defender');
}

// Load boss Pokemon data into form
function loadBossPokemonData(pokemon, role) {
    // Set basic info
    document.getElementById(`${role}-name`).value = pokemon.name || pokemon.Name || 'Unknown';
    document.getElementById(`${role}-level`).value = pokemon.level || pokemon.Level || 50;
    
    // Set types (normalize to lowercase to match select dropdown values)
    const types = pokemon.type || pokemon.Type || [];
    if (Array.isArray(types)) {
        document.getElementById(`${role}-type1`).value = types[0] ? types[0].toLowerCase() : '';
        document.getElementById(`${role}-type2`).value = types[1] ? types[1].toLowerCase() : '';
    } else {
        document.getElementById(`${role}-type1`).value = types ? types.toLowerCase() : '';
        document.getElementById(`${role}-type2`).value = '';
    }
    
    // Set stats
    document.getElementById(`${role}-hp`).value = pokemon.hp || pokemon.HP || 100;
    document.getElementById(`${role}-attack`).value = pokemon.attack || pokemon.Attack || 75;
    document.getElementById(`${role}-defense`).value = pokemon.defense || pokemon.Defense || 75;
    document.getElementById(`${role}-sp-attack`).value = pokemon.special_attack || pokemon.Special_Attack || 75;
    document.getElementById(`${role}-sp-defense`).value = pokemon.special_defense || pokemon.Special_Defense || 75;
    document.getElementById(`${role}-speed`).value = pokemon.speed || pokemon.Speed || 75;
    
    // Reset stat boosts
    document.getElementById(`${role}-attack-boost`).value = '0';
    document.getElementById(`${role}-defense-boost`).value = '0';
    document.getElementById(`${role}-sp-attack-boost`).value = '0';
    document.getElementById(`${role}-sp-defense-boost`).value = '0';
    document.getElementById(`${role}-speed-boost`).value = '0';
    
    // Reset held item
    document.getElementById(`${role}-item`).value = '';
}

// Update knockout tracker
function updateKnockoutTracker() {
    if (!currentBossTeam || currentBossTeam.length === 0) return;
    
    const trackerDiv = document.getElementById('knockout-tracker');
    const displayDiv = document.getElementById('knockout-display');
    
    trackerDiv.style.display = 'block';
    displayDiv.innerHTML = '';
    
    currentBossTeam.forEach((pokemon, index) => {
        const isKnockedOut = knockedOutPokemon.includes(index);
        const pokemonDiv = document.createElement('div');
        pokemonDiv.style.cssText = `
            margin-bottom: 8px; 
            padding: 8px; 
            background: ${isKnockedOut ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255,255,255,0.1)'}; 
            border-radius: 5px;
            cursor: pointer;
            border: ${isKnockedOut ? '2px solid red' : '2px solid transparent'};
        `;
        
        const name = pokemon.name || pokemon.Name || 'Unknown';
        const types = pokemon.type || pokemon.types || pokemon.Type || 'Unknown';
        let typeDisplay = Array.isArray(types) ? types.join(' / ') : types;
        
        pokemonDiv.innerHTML = `
            <strong>${name}</strong> (${typeDisplay})
            <button onclick="toggleKnockout(${index}, event)" style="margin-left: 10px; padding: 2px 8px;">
                ${isKnockedOut ? 'Revive' : 'Knockout'}
            </button>
        `;
        
        displayDiv.appendChild(pokemonDiv);
    });
    
    // Suggest next Pokemon
    suggestNextPokemon();
}

// Toggle knockout status
function toggleKnockout(index, event) {
    event.stopPropagation();
    
    const indexInArray = knockedOutPokemon.indexOf(index);
    if (indexInArray > -1) {
        knockedOutPokemon.splice(indexInArray, 1);
    } else {
        knockedOutPokemon.push(index);
    }
    
    updateKnockoutTracker();
}

// Suggest next Pokemon based on generation switch logic
function suggestNextPokemon() {
    if (!currentBossTeam || currentBossTeam.length === 0) return;
    
    const suggestedDiv = document.getElementById('suggested-pokemon');
    const generation = parseInt(document.getElementById('generation').value) || 8;
    
    // Get alive Pokemon
    const alivePokemon = currentBossTeam.filter((_, index) => !knockedOutPokemon.includes(index));
    
    if (alivePokemon.length === 0) {
        suggestedDiv.innerHTML = '<p>All Pokemon knocked out!</p>';
        return;
    }
    
    let suggestedPokemon = null;
    
    // Generation-specific switch logic
    switch(generation) {
        case 3: // Gen 3 (Emerald, Fire Red, Leaf Green)
            // In Gen 3, AI switches to Pokemon with type advantage
            suggestedPokemon = suggestByTypeAdvantage(alivePokemon);
            break;
        case 4: // Gen 4 (Brilliant Diamond)
            // In Gen 4, AI considers type advantage and remaining HP
            suggestedPokemon = suggestByTypeAndHP(alivePokemon);
            break;
        case 9: // Gen 9 (Scarlet/Violet)
            // In Gen 9, AI uses more complex logic including tera types and speed
            suggestedPokemon = suggestBySpeedAndType(alivePokemon);
            break;
        default:
            // Default to type advantage
            suggestedPokemon = suggestByTypeAdvantage(alivePokemon);
    }
    
    if (suggestedPokemon) {
        const name = suggestedPokemon.name || suggestedPokemon.Name || 'Unknown';
        const types = suggestedPokemon.type || suggestedPokemon.types || suggestedPokemon.Type || 'Unknown';
        let typeDisplay = Array.isArray(types) ? types.join(' / ') : types;
        
        suggestedDiv.innerHTML = `
            <div style="padding: 10px; background: rgba(100, 200, 100, 0.2); border-radius: 5px; border: 2px solid green;">
                <strong>${name}</strong> (${typeDisplay})
            </div>
        `;
    }
}

// Suggest Pokemon by type advantage (Gen 3)
function suggestByTypeAdvantage(alivePokemon) {
    // Simple logic: suggest Pokemon with highest speed
    return alivePokemon.reduce((best, current) => {
        const bestSpeed = best.speed || best.Speed || 0;
        const currentSpeed = current.speed || current.Speed || 0;
        return currentSpeed > bestSpeed ? current : best;
    });
}

// Suggest Pokemon by type advantage and HP (Gen 4)
function suggestByTypeAndHP(alivePokemon) {
    // Logic: suggest Pokemon with highest HP
    return alivePokemon.reduce((best, current) => {
        const bestHP = best.hp || best.HP || 0;
        const currentHP = current.hp || current.HP || 0;
        return currentHP > bestHP ? current : best;
    });
}

// Suggest Pokemon by speed and type (Gen 9)
function suggestBySpeedAndType(alivePokemon) {
    // Logic: suggest fastest Pokemon
    return alivePokemon.reduce((best, current) => {
        const bestSpeed = best.speed || best.Speed || 0;
        const currentSpeed = current.speed || current.Speed || 0;
        return currentSpeed > bestSpeed ? current : best;
    });
}

// Load held items from backend
async function loadHeldItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/held-items`);
        const data = await response.json();
        
        if (response.ok && data.items) {
            populateItemDropdown(data.items, 'attacker-item');
            populateItemDropdown(data.items, 'defender-item');
        }
    } catch (error) {
        console.error('Failed to load held items:', error);
    }
}

// Populate item dropdown
function populateItemDropdown(items, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">None</option>';
    
    // Add individual items
    Object.keys(items).forEach(key => {
        if (key === 'type_boosting_items' || key === 'type_plates') {
            // Handle nested items
            if (items[key].items) {
                Object.keys(items[key].items).forEach(subKey => {
                    const item = items[key].items[subKey];
                    const option = document.createElement('option');
                    option.value = subKey;
                    option.textContent = item.name;
                    dropdown.appendChild(option);
                });
            }
        } else if (items[key].name) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = items[key].name;
            dropdown.appendChild(option);
        }
    });
}
