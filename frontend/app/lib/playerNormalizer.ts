import type { Player as ApiPlayer } from './api';
import type { Player as CardPlayer } from '~/data/players';

const IPL_HEADSHOT_BASE_URL = 'https://documents.iplt20.com/ipl/IPLHeadshot2024';
const AVATAR_BASE_URL = 'https://ui-avatars.com/api/';

const PLAYER_IMAGES: Record<string, string> = {
  'virat kohli': `${IPL_HEADSHOT_BASE_URL}/164.png`,
  'ms dhoni': `${IPL_HEADSHOT_BASE_URL}/1.png`,
  'm s dhoni': `${IPL_HEADSHOT_BASE_URL}/1.png`,
  'mahendra singh dhoni': `${IPL_HEADSHOT_BASE_URL}/1.png`,
  'rohit sharma': `${IPL_HEADSHOT_BASE_URL}/107.png`,
  'hardik pandya': `${IPL_HEADSHOT_BASE_URL}/2740.png`,
  'jasprit bumrah': `${IPL_HEADSHOT_BASE_URL}/1124.png`,
  'ravindra jadeja': `${IPL_HEADSHOT_BASE_URL}/9.png`,
  'andre russell': `${IPL_HEADSHOT_BASE_URL}/177.png`,
  'sunil narine': `${IPL_HEADSHOT_BASE_URL}/203.png`,
  'kl rahul': `${IPL_HEADSHOT_BASE_URL}/1125.png`,
  'k l rahul': `${IPL_HEADSHOT_BASE_URL}/1125.png`,
  'ab de villiers': `${IPL_HEADSHOT_BASE_URL}/233.png`,
  'ab devilliers': `${IPL_HEADSHOT_BASE_URL}/233.png`,
  'a b de villiers': `${IPL_HEADSHOT_BASE_URL}/233.png`,
  'suresh raina': `${IPL_HEADSHOT_BASE_URL}/14.png`,
  'kieron pollard': `${IPL_HEADSHOT_BASE_URL}/210.png`,
};

const TEAM_MAP: Record<string, {
  short: string;
  color: string;
  secondary: string;
}> = {
  'Chennai Super Kings': {
    short: 'CSK',
    color: '#FFC93C',
    secondary: '#1E3A8A',
  },

  'Mumbai Indians': {
    short: 'MI',
    color: '#3B82F6',
    secondary: '#0F172A',
  },

  'Royal Challengers Bangalore': {
    short: 'RCB',
    color: '#EF4444',
    secondary: '#111827',
  },

  'Royal Challengers Bengaluru': {
    short: 'RCB',
    color: '#EF4444',
    secondary: '#111827',
  },

  'Kolkata Knight Riders': {
    short: 'KKR',
    color: '#7C3AED',
    secondary: '#111827',
  },

  'Sunrisers Hyderabad': {
    short: 'SRH',
    color: '#F97316',
    secondary: '#111827',
  },

  'Rajasthan Royals': {
    short: 'RR',
    color: '#EC4899',
    secondary: '#111827',
  },

  'Delhi Capitals': {
    short: 'DC',
    color: '#2563EB',
    secondary: '#111827',
  },

  'Punjab Kings': {
    short: 'PBKS',
    color: '#DC2626',
    secondary: '#111827',
  },

  'Lucknow Super Giants': {
    short: 'LSG',
    color: '#06B6D4',
    secondary: '#111827',
  },

  'Gujarat Titans': {
    short: 'GT',
    color: '#0F172A',
    secondary: '#38BDF8',
  },
};

type RawRecommendedPlayer = Partial<Omit<ApiPlayer, 'attributes' | 'role' | 'wickets'>> & {
  attributes?: Record<string, boolean | string>;
  role?: ApiPlayer['role'] | string | null;
  wickets?: number | null;
  teams?: string[];
  aggressive?: boolean;
  power_hitter?: boolean;
  finisher?: boolean;
  spinner?: boolean;
  fast_bowler?: boolean;
};

export function normalizePlayer(player: RawRecommendedPlayer): CardPlayer {
  const playerName = player.name || 'Unknown Player';
  const primaryTeam = player.teams?.[0] || player.team || 'Unknown';

  const teamData = TEAM_MAP[primaryTeam] || {
    short: primaryTeam.length <= 5 && primaryTeam !== 'Unknown' ? primaryTeam : 'IPL',
    color: player.teamColor || '#00D1FF',
    secondary: player.teamSecondary || '#0F172A',
  };

  return {
    id: player.id || playerName.toLowerCase().replace(/\s+/g, '-'),

    name: playerName,

    team: teamData.short,

    teamColor: teamData.color,

    teamSecondary: teamData.secondary,

    role: normalizeRole(player.role),

    nationality: player.nationality || 'India',

    isOverseas: player.isOverseas || false,

    battingStyle: player.battingStyle || 'Right',

    bowlingStyle: player.bowlingStyle || 'Right-arm',

    orangeCap: player.orangeCap || false,

    purpleCap: player.purpleCap || false,

    captainExperience: player.captainExperience || false,

    matches: player.matches || 0,

    runs: player.runs || 0,

    wickets: player.wickets || 0,

    imageUrl: resolvePlayerImage(playerName),

    cardGlow: player.cardGlow || teamData.color,

    attributes: {
      ...(player.attributes || {}),
      aggressive: player.aggressive || false,
      powerHitter: player.power_hitter || false,
      finisher: player.finisher || false,
      spinner: player.spinner || false,
      fastBowler: player.fast_bowler || false,
    },
  };
}

export function resolvePlayerImage(playerName: string): string {
  return PLAYER_IMAGES[normalizePlayerName(playerName)] || createAvatarUrl(playerName);
}

export function createAvatarUrl(playerName: string): string {
  const safeName = playerName.trim() || 'AI Player';
  const params = new URLSearchParams({
    name: safeName,
    size: '512',
    background: '020617',
    color: '00D1FF',
    bold: 'true',
    format: 'png',
    rounded: 'true',
  });

  return `${AVATAR_BASE_URL}?${params.toString()}`;
}

function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeRole(role: RawRecommendedPlayer['role']): CardPlayer['role'] {
  if (role === 'Batsman' || role === 'Bowler' || role === 'All-rounder' || role === 'Wicket-keeper') {
    return role;
  }

  const normalizedRole = String(role || '').toLowerCase();

  if (normalizedRole.includes('wicket') || normalizedRole.includes('keeper') || normalizedRole.includes('wk')) {
    return 'Wicket-keeper';
  }

  if (normalizedRole.includes('bowl')) {
    return 'Bowler';
  }

  if (normalizedRole.includes('all')) {
    return 'All-rounder';
  }

  if (normalizedRole.includes('bat')) {
    return 'Batsman';
  }

  return 'All-rounder';
}
