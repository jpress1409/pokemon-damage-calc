import json
import pandas as pd

def load_pokemon_json(json_file):
    with open(json_file, "r") as f:
        data = json.load(f)
    return data

# Convert nested JSON to a DataFrame
def json_to_dataframe(pokemon_json):
    rows = []
    for game, categories in pokemon_json.items():
        for category, trainers in categories.items():  # e.g., "gym_leaders", "elite_four", "champion"
            for trainer_name, pokemons in trainers.items():
                for p in pokemons:
                    rows.append({
                        "Game": game,
                        "Category": category,
                        "Trainer": trainer_name,
                        "Pokemon Name": p.get("name"),
                        "Type": ", ".join(p.get("type", [])) if isinstance(p.get("type"), list) else p.get("type"),
                        "Level": p.get("level"),
                        "Attack": p.get("attack"),
                        "Special Attack": p.get("special_attack"),
                        "Defense": p.get("defense"),
                        "Special Defense": p.get("special_defense"),
                        "Speed": p.get("speed"),
                        "Ability": p.get("ability"),
                        "Moves": ", ".join(p.get("moves", []))
                    })
    df = pd.DataFrame(rows)
    return df

# Example usage
json_file = "brilliant_diamond_trainers.json"  # replace with your JSON file path
pokemon_data = load_pokemon_json(json_file)
df = json_to_dataframe(pokemon_data)

print(df.head())  # show first few rows