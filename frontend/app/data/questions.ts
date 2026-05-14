export interface Question {
  id: string;
  text: string;
  attribute: string;
  type: 'boolean' | 'team' | 'role' | 'nationality' | 'batting';
}

export type Answer = 'yes' | 'no' | 'maybe' | 'dontknow';

export const QUESTIONS: Question[] = [
  { id: 'q1', text: 'Is your player an overseas (foreign) cricketer?', attribute: 'isOverseas', type: 'boolean' },
  { id: 'q2', text: 'Is your player primarily a batsman?', attribute: 'role_batsman', type: 'role' },
  { id: 'q3', text: 'Does your player bat left-handed?', attribute: 'batting_left', type: 'batting' },
  { id: 'q4', text: 'Is your player a wicket-keeper?', attribute: 'role_keeper', type: 'role' },
  { id: 'q5', text: 'Has your player ever won the Orange Cap?', attribute: 'orangeCap', type: 'boolean' },
  { id: 'q6', text: 'Has your player ever won the Purple Cap?', attribute: 'purpleCap', type: 'boolean' },
  { id: 'q7', text: 'Does your player have captaincy experience in IPL?', attribute: 'captainExperience', type: 'boolean' },
  { id: 'q8', text: 'Does your player play for MI (Mumbai Indians)?', attribute: 'team_mi', type: 'team' },
  { id: 'q9', text: 'Does your player play for CSK (Chennai Super Kings)?', attribute: 'team_csk', type: 'team' },
  { id: 'q10', text: 'Does your player play for RCB (Royal Challengers)?', attribute: 'team_rcb', type: 'team' },
  { id: 'q11', text: 'Does your player play for KKR (Kolkata Knight Riders)?', attribute: 'team_kkr', type: 'team' },
  { id: 'q12', text: 'Is your player an all-rounder?', attribute: 'role_allrounder', type: 'role' },
  { id: 'q13', text: 'Is your player primarily a bowler?', attribute: 'role_bowler', type: 'role' },
  { id: 'q14', text: 'Has your player appeared in a World Cup for their national team?', attribute: 'worldCup', type: 'boolean' },
  { id: 'q15', text: 'Does your player have more than 3000 IPL runs?', attribute: 'runs_3k', type: 'boolean' },
];

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'Arjun Sharma', avatar: '🏆', points: 2580, wins: 42, games: 50, winRate: 84 },
  { rank: 2, name: 'Rishabh Verma', avatar: '🥈', points: 2240, wins: 38, games: 46, winRate: 83 },
  { rank: 3, name: 'Priya Nair', avatar: '🥉', points: 1980, wins: 33, games: 41, winRate: 80 },
  { rank: 4, name: 'You', avatar: '⭐', points: 1450, wins: 22, games: 32, winRate: 69, isYou: true },
  { rank: 5, name: 'Karan Singh', avatar: '🎯', points: 1290, wins: 20, games: 28, winRate: 71 },
  { rank: 6, name: 'Ananya Patel', avatar: '🔥', points: 1180, wins: 18, games: 26, winRate: 69 },
  { rank: 7, name: 'Rohan Das', avatar: '⚡', points: 1050, wins: 16, games: 24, winRate: 67 },
  { rank: 8, name: 'Meera Joshi', avatar: '🌟', points: 920, wins: 14, games: 22, winRate: 64 },
  { rank: 9, name: 'Vikram Bose', avatar: '🎖️', points: 840, wins: 12, games: 20, winRate: 60 },
  { rank: 10, name: 'Sneha Rao', avatar: '💫', points: 750, wins: 10, games: 18, winRate: 56 },
];
