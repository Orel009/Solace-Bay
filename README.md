# Solace Bay

An original top-down open-world crime game for the mobile browser, inspired by the classic 2D era of the genre. Everything here — code, map, characters, story and sound — is original; no assets or code from any commercial game are used.

**Play:** open `index.html` in a browser (works on phones, tablets and desktop). To host it, enable GitHub Pages for this repo (Settings → Pages → Deploy from branch → `main` / root).

## What is in the game

- Three connected areas: the Solace Bay mainland (downtown, suburbs, harbor, beach, military island), the east district (villas, casino strip, pier, airport) and the second city, **Meridian** (Glass Quarter, Sunset Vista, The Forge, its own airport), linked by bridges.
- Two story chapters (8 missions) plus 8 comedy side missions, with Hebrew and English subtitles.
- 28 vehicle types, including boats, a jet ski, a tank, a flyable light plane and helicopter, ambulances, fire trucks and cash trucks; each district has its own traffic mix and special cars. Steering, spinning wheels, fuel, visible damage, car fires with an escape window, radio stations.
- Flights between the two airports from the ticket desks.
- Homes to buy and save in (starting at Ray's place), businesses that earn income, and five spray/repair garages that clear your wanted level.
- Walk-in shops (guns, clothing, convenience stores, mall, bank, casino) with clear buy and rob buttons.
- A missions panel with GPS routing along the roads, shown on the minimap, the full map and the street.
- Day/night cycle, weather, dynamic lighting, layered synthesized audio (engines, voices, ambience, reverb).
- A six-star wanted system built on "heat": witnesses, line of sight, police profile (outfit and vehicle), helicopter.
- Busier streets day and night (night-life crowds, chatting groups), ambulances that come and revive the injured, 14 stunt ramps with cash bonuses, paramedic shifts and sirens in emergency vehicles.
- Sky Line: an elevated train loop across all three areas with 9 stations.
- Two-way citizen conversations chosen by context (time, weather, district, recent events), with no-repeat lines and varied reactions to police, gunfire and explosions.
- 13 weapons with distinct shapes (bat, knife, pistol, magnum, SMG, shotgun, rifle, sniper, flamethrower, molotovs, grenades, a rare bazooka, minigun), melee combos and kicks, police helicopters that can be shot down, cops who pull you out of cars, roadblocks, fire crews, and an emote button (fart, burp, whistle, laugh, dance, yell) that people react to.
- Reactive pedestrians and drivers (shoot at a car and the driver floors it or bails out), knockdowns instead of instant deaths, climbable rooftops, hidden tokens, joke spots around the map.

## Controls

| Touch | Keyboard | Action |
|---|---|---|
| Left joystick | WASD / arrows | Move, steer |
| Attack button | Space | Punch / shoot (gas pedal in classic driving) |
| Car button | E | Enter/exit vehicle, climb ladder, talk, use, buy |
| Run button | Shift | Sprint (brake/reverse in a vehicle) |
| Jump button | C | Jump (horn in a vehicle: X) |
| Emote button | F | Fart, burp, whistle, laugh, dance or yell |
| Weapon button | Q | Choose weapon (handbrake in a vehicle) |
| Minimap | M | Open the full map (drag to pan, tap to set a waypoint) |
| List button | — | Missions panel and GPS navigation |

On a phone held upright, the menu offers "Rotate screen to landscape".

## Project layout

- `src/` — game source, split into ordered files (`01_core.js` … `09_audio.js`) and `shell.html`.
- `build.py` — concatenates the sources into a single self-contained `index.html`.

```bash
python3 build.py
```

No dependencies and no build tools beyond Python 3.

## Status

Tested in a headless phone-sized browser, not yet on real devices. Saves are stored in the browser's local storage.
