class Move:
    def __init__(self, name, type, damage, cat, pp=None, priority=0):
        self.name = name
        self.type = type
        self.damage = damage
        self.cat = cat
        self.pp = pp if pp is not None else 10
        self.priority = priority