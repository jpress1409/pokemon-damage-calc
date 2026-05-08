import json
import os

# Get the directory where the script is located
data_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(data_dir, 'gym_leaders_e4.json')

# Load the JSON
with open(json_path, 'r', encoding='utf-8') as f:
    games = json.load(f)

# Fix each game
for game_name, game_data in games.items():
    # Ensure all required sections exist (even if empty)
    if 'elite_four' not in game_data:
        game_data['elite_four'] = {}
    if 'champion' not in game_data:
        game_data['champion'] = {}
    if 'rival_battles' not in game_data:
        game_data['rival_battles'] = {}
    
    # Fix gym leader casing and add hp to all Pokemon
    if 'gym_leaders' in game_data:
        new_gym_leaders = {}
        for leader_name, pokemon_list in game_data['gym_leaders'].items():
            # Capitalize leader name
            proper_name = leader_name.title()
            new_gym_leaders[proper_name] = pokemon_list
            
            # Add hp to each Pokemon if missing
            for pokemon in pokemon_list:
                if isinstance(pokemon, dict):
                    if 'hp' not in pokemon or not pokemon['hp']:
                        # Calculate a reasonable HP based on level
                        level = pokemon.get('level', 50)
                        pokemon['hp'] = level + 20  # Simple fallback
        
        game_data['gym_leaders'] = new_gym_leaders
    
    # Add hp to elite four Pokemon
    if 'elite_four' in game_data:
        for member_name, pokemon_list in game_data['elite_four'].items():
            for pokemon in pokemon_list:
                if isinstance(pokemon, dict):
                    if 'hp' not in pokemon or not pokemon['hp']:
                        level = pokemon.get('level', 50)
                        pokemon['hp'] = level + 20
    
    # Add hp to champion Pokemon
    if 'champion' in game_data:
        for champ_name, pokemon_list in game_data['champion'].items():
            for pokemon in pokemon_list:
                if isinstance(pokemon, dict):
                    if 'hp' not in pokemon or not pokemon['hp']:
                        level = pokemon.get('level', 50)
                        pokemon['hp'] = level + 20

# Save the fixed JSON
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(games, f, indent=2)

print(f'Fixed JSON structure for {len(games)} games')
print('Added elite_four, champion, rival_battles sections where missing')
print('Capitalized gym leader names')
print('Added hp stat where missing')
