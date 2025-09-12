class Pokemon:
    def __init__(self, name, type, level, attack, special_attack, defense, special_defense, speed, ability=None, moves=None):
        self.name = name
        self.type = type
        self.level = level
        self.attack = attack
        self.special_attack = special_attack
        self.defense = defense
        self.special_defense = special_defense
        self.speed = speed
        self.ability = ability
        self.moves = moves if moves is not None else []
