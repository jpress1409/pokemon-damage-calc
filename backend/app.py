from flask import Flask, request, jsonify, send_from_directory
import sys
import os
import json

# Ensure backend directory is on the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')
DATA_DIR = os.path.join(BASE_DIR, 'data')

from classes.pokemon import Pokemon
from classes.move import Move
import utils

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='/')

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/api/calculate-damage', methods=['POST'])
def calculate_damage():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['attacker', 'defender', 'move']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        attacker_data = data['attacker']
        defender_data = data['defender']
        move_data = data['move']
        
        # Create attacker Pokemon
        attacker = Pokemon(
            name=attacker_data['name'],
            type=attacker_data['type'],
            level=attacker_data['level'],
            attack=attacker_data['attack'],
            special_attack=attacker_data['special_attack'],
            defense=attacker_data['defense'],
            special_defense=attacker_data['special_defense'],
            speed=attacker_data['speed'],
            ability=attacker_data.get('ability')
        )
        
        # Add stat boosts to attacker if provided
        if 'stat_boosts' in attacker_data:
            attacker.stat_boosts = type('StatBoosts', (), attacker_data['stat_boosts'])()
        
        # Add held item to attacker if provided
        if 'held_item' in attacker_data and attacker_data['held_item']:
            attacker.held_item = attacker_data['held_item']
        
        # Create defender Pokemon
        defender = Pokemon(
            name=defender_data['name'],
            type=defender_data['type'],
            level=defender_data['level'],
            attack=defender_data['attack'],
            special_attack=defender_data['special_attack'],
            defense=defender_data['defense'],
            special_defense=defender_data['special_defense'],
            speed=defender_data['speed'],
            ability=defender_data.get('ability')
        )
        
        # Add stat boosts to defender if provided
        if 'stat_boosts' in defender_data:
            defender.stat_boosts = type('StatBoosts', (), defender_data['stat_boosts'])()
        
        # Add held item to defender if provided
        if 'held_item' in defender_data and defender_data['held_item']:
            defender.held_item = defender_data['held_item']
        
        # Create move
        move = Move(
            name=move_data['name'],
            type=move_data['type'],
            damage=move_data['damage'],
            cat=move_data['category'],
            pp=move_data.get('pp'),
            priority=move_data.get('priority', 0)
        )
        
        # Calculate damage
        generation = data.get('generation', 8)
        base = utils.main_calc(move, attacker, defender, generation)
        mults = utils.multipliers(attacker, move, base, 
                                 burn=data.get('burn', False),
                                 screen=data.get('screen'),
                                 weather=data.get('weather'),
                                 ff=data.get('ff', False))
        final = utils.type_check(mults, attacker, move, defender)
        final = utils.apply_item_effects(final, attacker, move)
        crit = utils.secondary_mults(final, move, 
                                    critical=data.get('critical', False),
                                    charge=data.get('charge', False),
                                    hh=data.get('hh', False))
        
        # Get type effectiveness
        type_effectiveness = utils.super_effective_check(move.type, defender.type)
        
        return jsonify({
            'base_damage': round(base, 2),
            'max_damage': round(final, 2),
            'min_damage': round(utils.low_roll(final), 2),
            'crit_damage': round(crit, 2),
            'type_effectiveness': type_effectiveness,
            'stab': move.type in attacker.type,
            'move_info': {
                'name': move.name,
                'type': move.type,
                'category': move.cat,
                'power': move.damage
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/best-move', methods=['POST'])
def best_move():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['attacker', 'defender', 'moves']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        attacker_data = data['attacker']
        defender_data = data['defender']
        moves_data = data['moves']
        
        # Create attacker Pokemon with moves
        attacker = Pokemon(
            name=attacker_data['name'],
            type=attacker_data['type'],
            level=attacker_data['level'],
            attack=attacker_data['attack'],
            special_attack=attacker_data['special_attack'],
            defense=attacker_data['defense'],
            special_defense=attacker_data['special_defense'],
            speed=attacker_data['speed'],
            ability=attacker_data.get('ability'),
            moves=[]
        )
        
        # Add stat boosts to attacker if provided
        if 'stat_boosts' in attacker_data:
            attacker.stat_boosts = type('StatBoosts', (), attacker_data['stat_boosts'])()
        
        # Add moves to attacker
        for move_data in moves_data:
            move = Move(
                name=move_data['name'],
                type=move_data['type'],
                damage=move_data['damage'],
                cat=move_data['category'],
                pp=move_data.get('pp'),
                priority=move_data.get('priority', 0)
            )
            attacker.moves.append(move)
        
        # Create defender Pokemon
        defender = Pokemon(
            name=defender_data['name'],
            type=defender_data['type'],
            level=defender_data['level'],
            attack=defender_data['attack'],
            special_attack=defender_data['special_attack'],
            defense=defender_data['defense'],
            special_defense=defender_data['special_defense'],
            speed=defender_data['speed'],
            ability=defender_data.get('ability')
        )
        
        # Add stat boosts to defender if provided
        if 'stat_boosts' in defender_data:
            defender.stat_boosts = type('StatBoosts', (), defender_data['stat_boosts'])()
        
        # Calculate best move
        generation = data.get('generation', 8)
        result = utils.best_move(attacker, defender, generation)
        
        return jsonify({
            'best_move': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/type-chart')
def type_chart():
    return jsonify({
        'type_chart': utils.super_effective_check.__defaults__[0] if hasattr(utils.super_effective_check, '__defaults__') else {}
    })

@app.route('/api/boss-teams/<game_name>')
def get_boss_teams(game_name):
    try:
        boss_data_file = os.path.join(DATA_DIR, 'gym_leaders_e4.json')
        with open(boss_data_file, 'r') as f:
            boss_data = json.load(f)
        
        if game_name in boss_data:
            return jsonify(boss_data[game_name])
        else:
            return jsonify({'error': 'Game not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/boss-teams')
def get_available_games():
    try:
        boss_data_file = os.path.join(DATA_DIR, 'gym_leaders_e4.json')
        with open(boss_data_file, 'r') as f:
            boss_data = json.load(f)
        
        return jsonify({'games': list(boss_data.keys())})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/held-items')
def get_held_items():
    try:
        held_items_file = os.path.join(DATA_DIR, 'held_items.json')
        with open(held_items_file, 'r') as f:
            held_items = json.load(f)
        
        return jsonify({'items': held_items})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pokemon/<pokemon_name>')
def get_pokemon_from_api(pokemon_name):
    """Fetch Pokemon data from PokeAPI dynamically"""
    try:
        import requests
        
        # Normalize Pokemon name for API
        api_name = pokemon_name.lower().replace(' ', '-').replace('.', '').replace("'", '')
        
        # Fetch from PokeAPI
        response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{api_name}', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract types
            types = [t['type']['name'] for t in data['types']]
            
            # Extract stats
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
            
            # Extract abilities (first non-hidden ability)
            abilities = [a['ability']['name'] for a in data['abilities'] if not a['is_hidden']]
            ability = abilities[0] if abilities else data['abilities'][0]['ability']['name'] if data['abilities'] else ''
            
            return jsonify({
                'name': pokemon_name,
                'types': types,
                'stats': stats,
                'ability': ability.replace('-', ' ').title(),
                'sprite': data['sprites']['front_default']
            })
        else:
            return jsonify({'error': f'Pokemon not found: {pokemon_name}'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pokemon/search/<query>')
def search_pokemon(query):
    """Search for Pokemon by name"""
    try:
        import requests
        
        # Fetch from PokeAPI
        response = requests.get(f'https://pokeapi.co/api/v2/pokemon?limit=1000', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            all_pokemon = data['results']
            
            # Filter by query
            query_lower = query.lower()
            matches = [p for p in all_pokemon if query_lower in p['name'].lower()]
            
            return jsonify({'results': matches[:10]})  # Return top 10 matches
        else:
            return jsonify({'error': 'Failed to fetch Pokemon list'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
