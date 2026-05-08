import json
import requests
import os
import time
import threading
import sys

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon"

# Loading animation flag
loading_running = False

def loading_animation():
    """Print loading dots animation"""
    dots = 0
    while loading_running:
        sys.stdout.write(f"\rRunning {'.' * dots}{' ' * (3 - dots)}")
        sys.stdout.flush()
        dots = (dots + 1) % 4
        time.sleep(1)
    sys.stdout.write("\r           \r")
    sys.stdout.flush()

def start_loading():
    """Start the loading animation in a separate thread"""
    global loading_running
    loading_running = True
    thread = threading.Thread(target=loading_animation)
    thread.daemon = True
    thread.start()
    return thread

def stop_loading():
    """Stop the loading animation"""
    global loading_running
    loading_running = False
    time.sleep(0.5)  # Give time for animation to clear

def fetch_pokemon_data(pokemon_name):
    """Fetch Pokemon data from PokeAPI"""
    api_name = pokemon_name.lower().replace(' ', '-').replace('.', '').replace("'", '')
    
    try:
        response = requests.get(f"{POKEAPI_URL}/{api_name}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            types = [t['type']['name'] for t in data['types']]
            
            stats = {}
            for stat in data['stats']:
                stat_name = stat['stat']['name']
                base_stat = stat['base_stat']
                if stat_name == 'hp':
                    stats['hp'] = base_stat
                elif stat_name == 'attack':
                    stats['attack'] = base_stat
                elif stat_name == 'defense':
                    stats['defense'] = base_stat
                elif stat_name == 'special-attack':
                    stats['special_attack'] = base_stat
                elif stat_name == 'special-defense':
                    stats['special_defense'] = base_stat
                elif stat_name == 'speed':
                    stats['speed'] = base_stat
            
            abilities = [a['ability']['name'] for a in data['abilities'] if not a['is_hidden']]
            ability = abilities[0] if abilities else data['abilities'][0]['ability']['name'] if data['abilities'] else ''
            
            return {
                'types': types,
                'stats': stats,
                'ability': ability.replace('-', ' ').title()
            }
        else:
            print(f"  Could not find {pokemon_name} (status {response.status_code})")
            return None
    except Exception as e:
        print(f"  Error fetching {pokemon_name}: {e}")
        return None

def update_pokemon(pokemon, pokemon_cache):
    """Update a single Pokemon entry"""
    pokemon_name = pokemon['name']
    
    # Skip if already has type data
    if pokemon.get('type') and len(pokemon['type']) > 0:
        return False, pokemon_name
    
    # Check cache first
    if pokemon_name in pokemon_cache:
        cached_data = pokemon_cache[pokemon_name]
        if cached_data:
            pokemon['type'] = cached_data['types']
            pokemon['attack'] = cached_data['stats'].get('attack', '')
            pokemon['special_attack'] = cached_data['stats'].get('special_attack', '')
            pokemon['defense'] = cached_data['stats'].get('defense', '')
            pokemon['special_defense'] = cached_data['stats'].get('special_defense', '')
            pokemon['speed'] = cached_data['stats'].get('speed', '')
            pokemon['ability'] = cached_data['ability']
        return True, pokemon_name
    
    # Fetch from API
    print(f"  Fetching {pokemon_name}...", end='', flush=True)
    data = fetch_pokemon_data(pokemon_name)
    
    if data:
        pokemon['type'] = data['types']
        pokemon['attack'] = data['stats'].get('attack', '')
        pokemon['special_attack'] = data['stats'].get('special_attack', '')
        pokemon['defense'] = data['stats'].get('defense', '')
        pokemon['special_defense'] = data['stats'].get('special_defense', '')
        pokemon['speed'] = data['stats'].get('speed', '')
        pokemon['ability'] = data['ability']
        pokemon_cache[pokemon_name] = data
        print(f" Done! Types: {data['types']}")
        return True, pokemon_name
    else:
        pokemon_cache[pokemon_name] = None
        print(" Failed!")
        return False, pokemon_name

def update_gym_leaders_json():
    """Update gym_leaders_e4.json with PokeAPI data"""
    data_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(data_dir, 'gym_leaders_e4.json')
    
    # Load current JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        games = json.load(f)
    
    pokemon_cache = {}
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    # Collect all Pokemon that need updating
    all_pokemon_to_update = []
    
    for game_name, game_data in games.items():
        for category in ['gym_leaders', 'elite_four', 'champion']:
            for leader_name, pokemon_list in game_data.get(category, {}).items():
                for pokemon in pokemon_list:
                    if not pokemon.get('type') or len(pokemon['type']) == 0:
                        all_pokemon_to_update.append((game_name, category, leader_name, pokemon))
    
    total_to_update = len(all_pokemon_to_update)
    print(f"Found {total_to_update} Pokemon that need data from PokeAPI")
    print("="*60)
    
    # Process each Pokemon
    for idx, (game_name, category, leader_name, pokemon) in enumerate(all_pokemon_to_update, 1):
        success, name = update_pokemon(pokemon, pokemon_cache)
        
        if success:
            updated_count += 1
        elif pokemon.get('type') and len(pokemon['type']) > 0:
            skipped_count += 1
        else:
            error_count += 1
        
        # Save progress every 10 Pokemon
        if idx % 10 == 0:
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(games, f, indent=2)
            print(f"  [Saved progress: {idx}/{total_to_update}]")
        
        # Rate limiting
        time.sleep(0.3)
    
    # Final save
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(games, f, indent=2)
    
    print("\n" + "="*60)
    print(f"SUMMARY:")
    print(f"  Updated: {updated_count} Pokemon")
    print(f"  Skipped (already had data): {skipped_count} Pokemon")
    print(f"  Errors: {error_count} Pokemon")
    print("="*60)
    print(f"\nSaved to {json_path}")

if __name__ == "__main__":
    print("Starting PokeAPI data fetch...")
    print("This will save progress every 10 Pokemon\n")
    
    # Start loading animation
    loading_thread = start_loading()
    
    try:
        update_gym_leaders_json()
    finally:
        # Stop loading animation
        stop_loading()
    
    print("\nDone!")
