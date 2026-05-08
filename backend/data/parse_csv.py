import csv
import json
import os

# Get the directory where the script is located
data_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(data_dir, 'PokemonGymLeaders.csv')
json_path = os.path.join(data_dir, 'gym_leaders_e4_new.json')

# Read CSV data
csv_data = []
with open(csv_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        csv_data.append(row)

# Parse data into structured format
games = {}

for row in csv_data:
    generation = row['Generation']
    game = row['Game']
    gym = row['Gym']
    leader = row['Gym leader']
    pokemon_name = row['Pokemon']
    level = row['Level']
    moves = [row['Move 1'], row['Move 2'], row['Move 3'], row['Move 4']]
    moves = [m for m in moves if m]  # Remove empty moves
    
    # Create game entry if not exists
    if game not in games:
        games[game] = {
            'generation': int(generation),
            'gym_leaders': {},
            'elite_four': {},
            'champion': {}
        }
    
    # Determine category based on gym/leader
    category = None
    leader_key = leader
    
    if 'Elite Four' in gym:
        if 'Champion' in leader:
            category = 'champion'
            # Clean up champion name
            leader_key = leader.replace('Champion ', '').replace(' Blue ', '_')
        else:
            category = 'elite_four'
    else:
        category = 'gym_leaders'
    
    # Create leader entry if not exists
    if leader_key not in games[game][category]:
        games[game][category][leader_key] = []
    
    # Create Pokemon entry with all required fields
    pokemon_entry = {
        'name': pokemon_name,
        'type': [],  # Will need to be filled manually
        'level': int(level) if level else 0,
        'attack': '',
        'special_attack': '',
        'defense': '',
        'special_defense': '',
        'speed': '',
        'ability': '',
        'moves': moves
    }
    
    games[game][category][leader_key].append(pokemon_entry)

# Write to JSON
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(games, f, indent=2)

print(f'Created JSON with {len(games)} games')
for game, data in games.items():
    gym_count = len(data['gym_leaders'])
    elite_count = len(data['elite_four'])
    champ_count = len(data['champion'])
    print(f'{game}: Gen {data["generation"]}, {gym_count} gym leaders, {elite_count} elite four, {champ_count} champions')
