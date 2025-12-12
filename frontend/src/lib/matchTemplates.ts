// Match Page Templates Configuration
// Define templates for different games

export interface MatchTemplate {
  id: string;
  name: string;
  game: string;
  description: string;
  fields: TemplateField[];
  instructions: string;
  color: string;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export const MATCH_TEMPLATES: MatchTemplate[] = [
  {
    id: 'cod_mobile_1v1',
    name: 'COD Mobile 1v1',
    game: 'COD Mobile',
    description: 'Template for COD Mobile 1v1 matches on Shipment',
    color: 'from-orange-500 to-red-500',
    instructions: `
1. Join the private match using the room code and password below
2. Map: Shipment
3. Mode: 1v1 Solo
4. Check prohibited weapons list before selecting loadout
5. Record gameplay for dispute resolution
6. Report results immediately after match
    `,
    fields: [
      { key: 'room_code', label: 'Room Code', type: 'text', placeholder: 'ABCD1234', required: true },
      { key: 'room_password', label: 'Room Password', type: 'text', placeholder: 'password123', required: false },
      { key: 'room_link', label: 'Room Link', type: 'text', placeholder: 'https://...', required: false },
      { key: 'map', label: 'Map', type: 'text', placeholder: 'Shipment', required: false },
      { key: 'mode', label: 'Mode', type: 'text', placeholder: '1v1 Solo', required: false },
      { 
        key: 'prohibited_weapons', 
        label: 'Prohibited Weapons', 
        type: 'textarea', 
        placeholder: 'List prohibited weapons (e.g., RPG, Shotguns, Snipers)', 
        required: false 
      },
      { 
        key: 'allowed_weapons', 
        label: 'Allowed Weapons', 
        type: 'textarea', 
        placeholder: 'List allowed weapons (e.g., ARs, SMGs)', 
        required: false 
      },
      { 
        key: 'loadout_rules', 
        label: 'Loadout Rules', 
        type: 'textarea', 
        placeholder: 'Additional loadout restrictions (perks, equipment, etc.)', 
        required: false 
      },
    ]
  },
  {
    id: 'fifa',
    name: 'FIFA/FC 24',
    game: 'FIFA/FC 24',
    description: 'Template for FIFA matches',
    color: 'from-green-500 to-blue-500',
    instructions: `
1. Add opponent as friend on platform
2. Create friendly match at scheduled time
3. Use the settings specified below
4. Screenshot the final score
5. Report results with proof
    `,
    fields: [
      { key: 'platform', label: 'Platform', type: 'select', options: ['PlayStation', 'Xbox', 'PC'], required: true },
      { key: 'player1_psn_gamertag', label: 'Player 1 Username', type: 'text', placeholder: 'PSN/Xbox/Origin ID', required: true },
      { key: 'player2_psn_gamertag', label: 'Player 2 Username', type: 'text', placeholder: 'PSN/Xbox/Origin ID', required: true },
      { key: 'match_duration', label: 'Match Duration', type: 'select', options: ['4 minutes', '6 minutes', '10 minutes'], required: true },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Semi-Pro', 'Professional', 'World Class', 'Legendary'], required: true },
      { key: 'squad_type', label: 'Squad Type', type: 'select', options: ['Ultimate Team', 'Seasons', 'Kick-Off'], required: true },
    ]
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    game: 'Fortnite',
    description: 'Template for Fortnite custom matches',
    color: 'from-purple-500 to-pink-500',
    instructions: `
1. Join the custom match using the key below
2. Add opponents as Epic friends
3. Join server at exact scheduled time
4. Follow custom match rules
5. Screenshot final placement
    `,
    fields: [
      { key: 'custom_key', label: 'Custom Match Key', type: 'text', placeholder: '1234-5678-9012-3456', required: true },
      { key: 'server_region', label: 'Server Region', type: 'select', options: ['NA-East', 'NA-West', 'EU', 'Asia'], required: true },
      { key: 'game_mode', label: 'Game Mode', type: 'select', options: ['Solo', 'Duos', 'Trios', 'Squads'], required: true },
      { key: 'player1_epic_id', label: 'Player 1 Epic ID', type: 'text', placeholder: 'EpicUsername', required: true },
      { key: 'player2_epic_id', label: 'Player 2 Epic ID', type: 'text', placeholder: 'EpicUsername', required: true },
      { key: 'match_rules', label: 'Match Rules', type: 'textarea', placeholder: 'No building, storm settings, etc.', required: false },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    game: 'Valorant',
    description: 'Template for Valorant custom matches',
    color: 'from-red-500 to-rose-500',
    instructions: `
1. Add opponents on Riot ID
2. Join custom match lobby
3. Use specified server and settings
4. Record match for verification
5. Submit round-by-round scores
    `,
    fields: [
      { key: 'server', label: 'Server', type: 'select', options: ['North America', 'Europe', 'Asia Pacific', 'Latin America'], required: true },
      { key: 'map', label: 'Map', type: 'select', options: ['Ascent', 'Bind', 'Haven', 'Split', 'Icebox', 'Breeze', 'Fracture'], required: true },
      { key: 'match_type', label: 'Match Type', type: 'select', options: ['First to 13', 'First to 7', 'Best of 3'], required: true },
      { key: 'player1_riot_id', label: 'Player 1 Riot ID', type: 'text', placeholder: 'Username#TAG', required: true },
      { key: 'player2_riot_id', label: 'Player 2 Riot ID', type: 'text', placeholder: 'Username#TAG', required: true },
      { key: 'overtime_enabled', label: 'Overtime', type: 'select', options: ['Enabled', 'Disabled'], required: true },
    ]
  },
  {
    id: 'generic',
    name: 'Generic/Custom',
    game: 'Any Game',
    description: 'Flexible template for any game',
    color: 'from-gray-500 to-slate-500',
    instructions: `
1. Follow the match instructions below
2. Contact opponent to coordinate
3. Join at the scheduled time
4. Follow all match rules
5. Report results with proof
    `,
    fields: [
      { key: 'game_name', label: 'Game Name', type: 'text', placeholder: 'Enter game name', required: true },
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'PC, Console, Mobile', required: true },
      { key: 'player1_username', label: 'Player 1 Username', type: 'text', placeholder: 'In-game username', required: true },
      { key: 'player2_username', label: 'Player 2 Username', type: 'text', placeholder: 'In-game username', required: true },
      { key: 'lobby_details', label: 'Lobby/Room Details', type: 'textarea', placeholder: 'Room code, password, server, etc.', required: false },
      { key: 'match_settings', label: 'Match Settings', type: 'textarea', placeholder: 'Game mode, rules, restrictions', required: false },
      { key: 'additional_info', label: 'Additional Info', type: 'textarea', placeholder: 'Any other important information', required: false },
    ]
  }
];

export function getTemplate(templateId: string): MatchTemplate | undefined {
  return MATCH_TEMPLATES.find(t => t.id === templateId);
}

export function getTemplatesByGame(game: string): MatchTemplate[] {
  return MATCH_TEMPLATES.filter(t => 
    t.game.toLowerCase().includes(game.toLowerCase()) || 
    t.id === 'generic'
  );
}
