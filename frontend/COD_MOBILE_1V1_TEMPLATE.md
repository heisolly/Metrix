# COD Mobile 1v1 Match Template

## Overview

Simplified template for COD Mobile 1v1 matches on Shipment map.

## Match Setup Fields

### Basic Room Info

1. **Room Code** (Required)
   - Example: `ABCD1234`
   - Used to join the private match

2. **Room Password** (Optional)
   - Example: `password123`
   - Additional security for the room

3. **Room Link** (Optional)
   - Example: `https://...`
   - Direct link to join the match

### Match Details

4. **Map** (Optional)
   - Default: Shipment
   - Pre-filled for admin

5. **Mode** (Optional)
   - Default: 1v1 Solo
   - Pre-filled for admin

### Loadout & Weapons

6. **Prohibited Weapons** (Optional)
   - List weapons that are NOT allowed
   - Example: "RPG, Shotguns, Snipers, LMGs"
   - Displayed to all players

7. **Allowed Weapons** (Optional)
   - List weapons that ARE allowed
   - Example: "ARs, SMGs, Pistols"
   - Displayed to all players

8. **Loadout Rules** (Optional)
   - Additional restrictions
   - Example: "No lethal equipment, No scorestreaks, Perks: Lightweight only"
   - Displayed to all players

## How It Works

### Admin Side (`/admin/matches/[id]/edit`)

1. Select "COD Mobile 1v1" template
2. Fill in:
   - Room Code (required)
   - Room Password (optional)
   - Room Link (optional)
3. Set weapon restrictions:
   - Prohibited Weapons
   - Allowed Weapons
   - Loadout Rules
4. Click "Save Match Setup"

### Player Side (`/dashboard/matches/[id]`)

Players will see:

- ✅ Room Code (with copy button)
- ✅ Room Password (with copy button)
- ✅ Room Link (with copy button)
- ✅ Map: Shipment
- ✅ Mode: 1v1 Solo
- ✅ **Prohibited Weapons** (clearly displayed)
- ✅ **Allowed Weapons** (clearly displayed)
- ✅ **Loadout Rules** (clearly displayed)
- ✅ Match instructions
- ✅ Live stats (kills, deaths, K/D)
- ✅ Timer countdown

### Spectator Side (`/dashboard/matches/[id]`)

Spectators will see:

- ✅ **Prohibited Weapons** (public info)
- ✅ **Allowed Weapons** (public info)
- ✅ **Loadout Rules** (public info)
- ✅ Live stats (kills, deaths, K/D)
- ✅ Timer countdown
- ❌ Room Code (hidden)
- ❌ Room Password (hidden)
- ❌ Room Link (hidden)

## Weapon Voting (Future Feature)

Currently, weapons are set by admin. Future enhancement could include:

- Players vote on prohibited weapons before match
- Community voting on loadout restrictions
- Popular weapon bans saved as presets

## Example Setup

```
Room Code: SHIP2024
Room Password: metrix123
Room Link: https://codm.gg/join/SHIP2024

Map: Shipment
Mode: 1v1 Solo

Prohibited Weapons:
- RPG
- All Shotguns
- All Snipers
- LMGs

Allowed Weapons:
- Assault Rifles
- SMGs
- Pistols

Loadout Rules:
- No lethal equipment
- No scorestreaks
- Perks: Lightweight, Ghost, Dead Silence only
- No operator skills
```

## Benefits

- ✅ Simple setup - only essential fields
- ✅ Clear weapon restrictions
- ✅ Fair gameplay - everyone knows the rules
- ✅ Easy to copy room details
- ✅ Spectators can watch without sensitive info
- ✅ Perfect for 1v1 tournaments
