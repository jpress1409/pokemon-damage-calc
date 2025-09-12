def main_calc(move, attacker, defender):
    if move.cat == "physical":
        return (2*attacker.level/5+2) * move.damage * (attacker.attack/defender.defense) / 50
    if move.cat == "special":
        return (2*attacker.level/5+2) * move.damage * (attacker.special_attack/defender.special_defense) / 50

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
             "fairy": {"fire": .5, "fighting": 2, "poison": .5, "dragon": 2, "dark": 2, "steel": .5, "fairy": 1}}
    eff = 1

    for i in target_types:
        eff*=types.get(move_type, {}).get(i, 1)

    return eff

def multipliers(attacker, move, base_calc, burn=False, screen=None, target=1, weather=None, ff=False):
    if burn and attacker.ability !="guts":
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
        if move.type == "fire":
            base_calc *= .5
    if weather == "sun":
        if move.type == "fire":
            base_calc *= 1.5
        if move.type == "water":
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

def best_move(attacker, defender):
    moves = {}
    for move in attacker.moves:
        base=main_calc(move, attacker, defender)
        mults=multipliers(attacker, move, base)
        final = type_check(mults, attacker, move, defender)

        moves[move] = final

        max_dam = max(moves.values())
        move_name = [k for k, v in moves.items() if v == max_dam]

    return f"Move: {move_name}\nDamage: {max_dam}"