import utils
from classes.pokemon import Pokemon
from classes.move import Move

mud_shot = Move("mud shot", "ground", 55, "physical")
mudkip = Pokemon("mudkip", ['water', "ground"], 23, 51, 32, 45, 39, 37)
zubat = Pokemon("zubat", ["poison", "flying"], 18, 21, 17, 21, 21, 30)
electrike = Pokemon("electric", ["electric"], 13, 17, 25, 17, 20, 21)

base = utils.main_calc(mud_shot, mudkip, zubat)

mults = utils.multipliers(mudkip, mud_shot, base)

final = utils.type_check(mults, mudkip, mud_shot, zubat)
crit = utils.secondary_mults(final, mud_shot, critical=True)

print(f"Highest Damage: {final:.0f}")
print(f"Lowest Damage: {utils.low_roll(final):.0f}")
print(f"Crit Damage: {crit:.0f}")