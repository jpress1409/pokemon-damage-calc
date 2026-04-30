def get_stat_boost_multiplier(boost_stage):
    """Calculate stat boost multiplier based on stage (0-6)"""
    if boost_stage == 0:
        return 1.0
    elif boost_stage > 0:
        # Positive boosts: +1 = 1.5x, +2 = 2x, +3 = 2.5x, etc.
        return 1.0 + (boost_stage * 0.5)
    else:
        # Negative boosts: -1 = 0.67x, -2 = 0.5x, etc.
        return 1.0 / (1.0 + (abs(boost_stage) * 0.5))

def apply_stat_boosts(pokemon, stat_boosts=None):
    """Apply stat boosts to a Pokemon's stats"""
    if stat_boosts is None:
        return pokemon
    
    boosted_pokemon = pokemon
    
    # Apply attack boost
    if hasattr(stat_boosts, 'attack') and stat_boosts.attack != 0:
        boosted_pokemon.attack = int(pokemon.attack * get_stat_boost_multiplier(stat_boosts.attack))
    
    # Apply defense boost
    if hasattr(stat_boosts, 'defense') and stat_boosts.defense != 0:
        boosted_pokemon.defense = int(pokemon.defense * get_stat_boost_multiplier(stat_boosts.defense))
    
    # Apply special attack boost
    if hasattr(stat_boosts, 'special_attack') and stat_boosts.special_attack != 0:
        boosted_pokemon.special_attack = int(pokemon.special_attack * get_stat_boost_multiplier(stat_boosts.special_attack))
    
    # Apply special defense boost
    if hasattr(stat_boosts, 'special_defense') and stat_boosts.special_defense != 0:
        boosted_pokemon.special_defense = int(pokemon.special_defense * get_stat_boost_multiplier(stat_boosts.special_defense))
    
    # Apply speed boost
    if hasattr(stat_boosts, 'speed') and stat_boosts.speed != 0:
        boosted_pokemon.speed = int(pokemon.speed * get_stat_boost_multiplier(stat_boosts.speed))
    
    return boosted_pokemon

def main_calc(move, attacker, defender, generation=8):
    if defender.defense == 0 or defender.special_defense == 0:
        raise ValueError("Defense stats cannot be zero")
    
    # Apply stat boosts
    attacker = apply_stat_boosts(attacker, getattr(attacker, 'stat_boosts', None))
    defender = apply_stat_boosts(defender, getattr(defender, 'stat_boosts', None))
    
    # Generation-based damage formula adjustments
    if generation == 1:
        # Gen 1 formula: different formula
        if move.cat == "physical":
            return (((2*attacker.level/5+2) * move.damage * (attacker.attack/defender.defense)) / 50) + 2
        if move.cat == "special":
            return (((2*attacker.level/5+2) * move.damage * (attacker.special_attack/defender.special_defense)) / 50) + 2
    elif generation == 2:
        # Gen 2-3 formula
        if move.cat == "physical":
            return ((2*attacker.level/5+2) * move.damage * (attacker.attack/defender.defense)) / 50 + 2
        if move.cat == "special":
            return ((2*attacker.level/5+2) * move.damage * (attacker.special_attack/defender.special_defense)) / 50 + 2
    elif generation >= 3 and generation <= 5:
        # Gen 3-5 formula
        if move.cat == "physical":
            return (((2*attacker.level/5+2) * move.damage * (attacker.attack/defender.defense)) / 50) + 2
        if move.cat == "special":
            return (((2*attacker.level/5+2) * move.damage * (attacker.special_attack/defender.special_defense)) / 50) + 2
    else:
        # Gen 6+ formula (current formula)
        if move.cat == "physical":
            return (2*attacker.level/5+2) * move.damage * (attacker.attack/defender.defense) / 50
        if move.cat == "special":
            return (2*attacker.level/5+2) * move.damage * (attacker.special_attack/defender.special_defense) / 50
    
    raise ValueError(f"Invalid move category: {move.cat}")

def super_effective_check(move_type, target_types):
    types = {"normal": {"ghost": 0},
             "fire": {"grass": 2, "ice": 2, "bug": 2, "steel": 2, "water": .5, "rock": .5, "ground": .5, "dragon": .5},
             "water": {"grass": .5, "steel": 2, "fire": .5, "ground": 2, "rock": 2, "dragon": .5},
             "electric": {"water": 2, "grass": .5, "ground": 0, "flying": 2, "steel": .5, "dragon": .5},
             "grass": {"fire": .5, "water": 2, "ground": 2, "rock": 2, "flying": .5, "bug": .5,
                       "steel": .5},
             "ice": {"fire": .5, "ground": 2, "flying": 2, "rock": .5, "dragon": 2, "steel": .5},
             "fighting": {"ice": 2, "poison": .5, "flying": .5, "psychic": .5, "rock": 2, "ghost": 0, "dark": 2,
                          "steel": 2, "fairy": .5},
             "poison": {"grass": 2, "ground": .5, "rock": .5, "steel": 0, "fairy": 2},
             "ground": {"fire": 2, "grass": .5, "electric": 2, "poison": 2, "flying": 0, "bug": .5, "rock": 2,
                        "steel": 2},
             "flying": {"electric": .5, "grass": 2, "fighting": 2, "bug": 2, "rock": .5, "steel": .5},
             "psychic": {"fighting": 2, "poison": 2, "dark": 0, "steel": .5},
             "bug": {"fire": .5, "grass": 2, "fighting": .5, "poison": .5, "flying": .5, "psychic": 2, "ghost": .5,
                     "dark": 2, "steel": .5, "fairy": .5},
             "rock": {"fire": 2, "ice": 2, "fighting": .5, "ground": .5, "flying": 2, "bug": 2, "steel": .5},
             "ghost": {"normal": 0, "psychic": 2, "ghost": 2, "dark": .5},
             "dragon": {"dragon": 2, "steel": .5, "fairy": 0},
             "dark": {"fighting": .5, "psychic": 2, "ghost": 2, "fairy": .5},
             "steel": {"fire": .5, "water": .5, "electric": .5, "ice": 2, "rock": 2, "fairy": 2},
             "fairy": {"fire": .5, "fighting": 2, "poison": .5, "dragon": 2, "dark": 2, "steel": .5, "fairy": .5}}
    eff = 1

    for i in target_types:
        eff*=types.get(move_type, {}).get(i, 1)

    return eff

def multipliers(attacker, move, base_calc, burn=False, screen=None, target=1, weather=None, ff=False):
    if burn and attacker.ability != "guts":
        base_calc *= .5
    if move.cat == "physical" and screen == "reflect":
        base_calc *= .5
    if move.cat == "special" and screen == "light_screen":
        base_calc *= .5
    if ff:
        base_calc *= 1.5
    if weather == "rain":
        if move.type == "water":
            base_calc *= 1.5
        elif move.type == "fire":
            base_calc *= .5
    elif weather == "sun":
        if move.type == "fire":
            base_calc *= 1.5
        elif move.type == "water":
            base_calc *= .5
    return base_calc + 2

def secondary_mults(damage, move, stockpile=1, critical=False, charge=False, hh=False):
    if critical:
        damage *= 2
    if charge and move.type == "electric":
        damage*=2
    if move.name == "spit up":
        damage *= stockpile
    if hh:
        damage *= 1.5
    return damage

def type_check(base_damage, attacker, move, target):
    if move.type in attacker.type:
        base_damage *= 1.5

    damage = base_damage * super_effective_check(move.type, target.type)
    return damage
def low_roll(damage):
    return damage * (85/100)

def best_move(attacker, defender, generation=8):
    moves = {}
    for move in attacker.moves:
        base=main_calc(move, attacker, defender, generation)
        mults=multipliers(attacker, move, base)
        final = type_check(mults, attacker, move, defender)
        final = apply_item_effects(final, attacker, move)
        moves[move] = final

    max_dam = max(moves.values())
    move_name = [k for k, v in moves.items() if v == max_dam]

    return f"Move: {move_name}\nDamage: {max_dam}"

def apply_item_effects(damage, attacker, move):
    """Apply held item effects to damage calculation"""
    if not hasattr(attacker, 'held_item') or not attacker.held_item:
        return damage
    
    try:
        import json
        import os
        
        # Load held items data
        DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
        held_items_file = os.path.join(DATA_DIR, 'held_items.json')
        
        with open(held_items_file, 'r') as f:
            held_items = json.load(f)
        
        # Get item effect
        item_key = attacker.held_item
        item = None
        
        # Check if it's a nested item (type gems or plates or berries)
        if item_key in held_items.get('type_boosting_items', {}).get('items', {}):
            item = held_items['type_boosting_items']['items'][item_key]
        elif item_key in held_items.get('type_plates', {}).get('items', {}):
            item = held_items['type_plates']['items'][item_key]
        elif item_key in held_items.get('type_resist_berries', {}).get('items', {}):
            item = held_items['type_resist_berries']['items'][item_key]
        elif item_key in held_items:
            item = held_items[item_key]
        
        if not item or 'effect' not in item:
            return damage
        
        effect = item['effect']
        
        # Apply attack multiplier
        if 'attack_multiplier' in effect:
            damage *= effect['attack_multiplier']
        
        # Apply special attack multiplier
        if 'special_attack_multiplier' in effect:
            damage *= effect['special_attack_multiplier']
        
        # Apply physical multiplier
        if 'physical_multiplier' in effect and move.cat == 'physical':
            damage *= effect['physical_multiplier']
        
        # Apply special multiplier
        if 'special_multiplier' in effect and move.cat == 'special':
            damage *= effect['special_multiplier']
        
        # Apply type-specific multiplier
        if 'type_multiplier' in effect and 'type' in effect:
            if effect['type'] == move.type:
                damage *= effect['type_multiplier']
        
        # Apply type resist multiplier (for berries)
        if 'type_resist' in effect and 'resist_multiplier' in effect:
            # This would need to check if the move is super-effective against the defender
            # For now, apply if move type matches the resist type
            if effect['type_resist'] == move.type:
                damage *= effect['resist_multiplier']
        
        # Apply super-effective multiplier
        if 'super_effective_multiplier' in effect:
            # This would need type effectiveness check, simplified for now
            pass
        
    except Exception as e:
        # If item loading fails, just return original damage
        pass
    
    return damage