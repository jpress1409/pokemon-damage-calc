import utils
from classes.pokemon import Pokemon
from classes.move import Move

water_gun = Move("water gun", "water", 40, "special")
mudkip = Pokemon("mudkip", ['water', "ground"], 23, 51, 32, 45, 39, 37)
zubat = Pokemon("zubat", ["poison", "flying"], 18, 21, 17, 21, 21, 30)

base = utils.main_calc(water_gun, mudkip, zubat)
mults = utils.multipliers(mudkip, water_gun, base)
final = utils.type_check(mults, mudkip, water_gun, zubat)
crit = utils.secondary_mults(final, water_gun, critical=True)

print(f"Highest Damage: {final:.0f}")
print(f"Lowest Damage: {utils.low_roll(final):.0f}")
print(f"Crit Damage: {crit:.0f}")