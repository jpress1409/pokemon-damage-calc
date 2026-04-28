# Pokemon Damage Calculator Frontend

A modern, responsive web interface for calculating Pokemon battle damage with comprehensive features.

## Features

### 🎯 Manual Battle Setup
- Input Pokemon stats manually
- Select from sample Pokemon database
- Configure moves, types, and battle conditions
- Real-time damage calculations

### 📁 Team Builder
- Upload CSV or JSON team files
- Preview team members
- Automatic form population from uploaded teams
- Support for both your team and opponent team

### ⚔️ Damage Calculation
- Comprehensive damage calculation engine
- Type effectiveness analysis
- STAB (Same Type Attack Bonus) calculation
- Critical hit damage
- Battle condition modifiers (weather, screens, status effects)

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Type-specific color coding
- Intuitive form layouts

## File Structure

```
frontend/
├── index.html          # Main HTML page
├── styles.css          # Complete styling
├── script.js           # JavaScript functionality
├── server.py           # Simple HTTP server for testing
└── README.md           # This file
```

## Getting Started

### Option 1: Using the Built-in Server
```bash
cd frontend
python server.py
```
This will start a server at `http://localhost:3000` and open your browser automatically.

### Option 2: Using Any HTTP Server
```bash
cd frontend
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# Node.js (if you have http-server installed)
npx http-server -p 3000
```

Then open `http://localhost:3000` in your browser.

## API Integration

The frontend communicates with the Flask backend API running at `http://localhost:5000/api`. Make sure the backend is running before using the frontend.

### Required Backend Endpoints:
- `POST /api/calculate-damage` - Calculate damage between two Pokemon
- `POST /api/best-move` - Find the best move from a moveset

## Team File Formats

### CSV Format
```csv
name,level,type1,type2,hp,attack,defense,sp_attack,sp_defense,speed
Pikachu,50,electric,,35,55,40,50,50,90
Charizard,50,fire,flying,78,84,78,109,85,100
```

### JSON Format
```json
[
  {
    "name": "Pikachu",
    "level": 50,
    "types": ["electric"],
    "hp": 35,
    "attack": 55,
    "defense": 40,
    "sp_attack": 50,
    "sp_defense": 50,
    "speed": 90
  },
  {
    "name": "Charizard",
    "level": 50,
    "types": ["fire", "flying"],
    "hp": 78,
    "attack": 84,
    "defense": 78,
    "sp_attack": 109,
    "sp_defense": 85,
    "speed": 100
  }
]
```

## Sample Pokemon Database

The frontend includes a sample database of popular Pokemon with their base stats and common moves. You can select from these or input custom Pokemon manually.

### Included Pokemon:
- Pikachu
- Charizard
- Blastoise
- Venusaur
- Alakazam
- Machamp
- Gengar
- Dragonite
- Mewtwo
- Lucario

## Battle Conditions

The calculator supports various battle conditions:

- **Critical Hit**: 2x damage multiplier
- **Burn**: Halves physical attack stat
- **Weather**: Rain boosts water, nerfs fire; Sun boosts fire, nerfs water
- **Screens**: Reflect reduces physical damage, Light Screen reduces special damage
- **Field**: Various terrain effects

## Browser Compatibility

The frontend works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Mobile Responsive

The interface is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## Customization

You can easily customize:
- Color schemes in `styles.css`
- Sample Pokemon data in `script.js`
- API endpoints in `script.js`
- Form layouts in `index.html`

## Troubleshooting

### Common Issues:

1. **API Connection Error**: Make sure the Flask backend is running on port 5000
2. **CORS Issues**: The backend should allow cross-origin requests
3. **File Upload Issues**: Ensure CSV/JSON files have the correct format
4. **Server Not Starting**: Check if port 3000 is already in use

### Debug Mode:

Open browser developer tools (F12) to see:
- Network requests to the API
- JavaScript console errors
- Form data being sent

## Contributing

Feel free to extend the frontend with:
- More Pokemon in the database
- Additional battle conditions
- Export functionality for results
- Battle simulators
- Team analysis tools
