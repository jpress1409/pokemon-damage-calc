from flask import Flask, request, jsonify, send_from_directory
import sys
import os

# Ensure backend directory is on the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

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
        base = utils.main_calc(move, attacker, defender)
        mults = utils.multipliers(attacker, move, base, 
                                 burn=data.get('burn', False),
                                 screen=data.get('screen'),
                                 weather=data.get('weather'),
                                 ff=data.get('ff', False))
        final = utils.type_check(mults, attacker, move, defender)
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
        
        # Calculate best move
        result = utils.best_move(attacker, defender)
        
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
