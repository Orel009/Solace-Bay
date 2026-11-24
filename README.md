# Solace Bay

An original top-down open-world crime game for the mobile browser, inspired by the classic 2D era of the genre. Everything here — code, map, characters, story and sound — is original; no assets or code from any commercial game are used.

**Play:** open `index.html` in a browser (works on phones, tablets and desktop). To host it, enable GitHub Pages for this repo (Settings → Pages → Deploy from branch → `main` / root).

## What is in the game

- A large coastal city: downtown, suburbs, harbor, beach, a military island, and an east district across two bridges with villas, a casino strip, a pier with a ferris wheel and an airport.
- Two story chapters (8 missions) plus 6 comedy side missions, with Hebrew and English subtitles.
- 16 vehicle types, including boats, a tank and a flyable light plane; fuel, damage, radio stations.
- Day/night cycle, weather, dynamic lighting.
- A six-star wanted system built on "heat": witnesses, line of sight, police profile (outfit and vehicle), helicopter.
- Shops you walk into (guns, clothing, convenience stores, mall, bank, casino) and can rob.
- Climbable rooftops, jumping, hidden tokens and secret places.
- Reactive pedestrians of several kinds, wildlife, taxi fares, random street events.

## Controls

| Touch | Keyboard | Action |
|---|---|---|
| Left joystick | WASD / arrows | Move, steer |
| Attack button | Space | Punch / shoot (gas pedal in classic driving) |
| Car button | E | Enter/exit vehicle, climb ladder, talk, use |
| Run button | Shift | Sprint (brake/reverse in a vehicle) |
| Jump button | C | Jump (horn in a vehicle: X) |
| Weapon button | Q | Choose weapon (handbrake in a vehicle) |
| Minimap | M | Open the full map and set a waypoint |

On a phone held upright, the menu offers "Rotate screen to landscape".

## Project layout

- `src/` — game source, split into ordered files (`01_core.js` … `08_main.js`) and `shell.html`.
- `build.py` — concatenates the sources into a single self-contained `index.html`.

```bash
python3 build.py
```

No dependencies and no build tools beyond Python 3.

## Status

Tested in a headless phone-sized browser, not yet on real devices. Saves are stored in the browser's local storage.
