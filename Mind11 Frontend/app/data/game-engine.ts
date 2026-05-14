import type { Player } from './players';
import { PLAYERS } from './players';
import type { Answer, Question } from './questions';
import { QUESTIONS } from './questions';

export interface GameState {
  currentQuestion: number;
  answers: Record<string, Answer>;
  possiblePlayers: Player[];
  confidence: number;
  topProspects: Array<{ player: Player; probability: number }>;
  isComplete: boolean;
  finalGuess: Player | null;
  phase: 'playing' | 'guessing' | 'revealed';
}

function matchesAnswer(player: Player, question: Question, answer: Answer): boolean {
  if (answer === 'dontknow') return true;

  let value: boolean;
  switch (question.attribute) {
    case 'isOverseas': value = player.isOverseas; break;
    case 'orangeCap': value = player.orangeCap; break;
    case 'purpleCap': value = player.purpleCap; break;
    case 'captainExperience': value = player.captainExperience; break;
    case 'role_batsman': value = player.role === 'Batsman'; break;
    case 'role_bowler': value = player.role === 'Bowler'; break;
    case 'role_keeper': value = player.role === 'Wicket-keeper'; break;
    case 'role_allrounder': value = player.role === 'All-rounder'; break;
    case 'batting_left': value = player.battingStyle === 'Left'; break;
    case 'team_mi': value = player.team === 'MI'; break;
    case 'team_csk': value = player.team === 'CSK'; break;
    case 'team_rcb': value = player.team === 'RCB'; break;
    case 'team_kkr': value = player.team === 'KKR'; break;
    case 'worldCup': value = !!(player.attributes['worldCup']); break;
    case 'runs_3k': value = player.runs > 3000; break;
    default: return true;
  }

  if (answer === 'yes') return value === true;
  if (answer === 'no') return value === false;
  if (answer === 'maybe') return true;
  return true;
}

export function computeTopProspects(
  players: Player[],
  answers: Record<string, Answer>
): Array<{ player: Player; probability: number }> {
  const total = players.length;
  if (total === 0) return [];

  const scored = players.map((player) => {
    let score = 100;
    Object.entries(answers).forEach(([qId, answer]) => {
      const question = QUESTIONS.find((q) => q.id === qId);
      if (!question) return;
      if (!matchesAnswer(player, question, answer)) score -= 30;
    });
    return { player, probability: Math.max(score, 5) };
  });

  scored.sort((a, b) => b.probability - a.probability);
  const topScore = scored[0]?.probability || 1;

  return scored
    .map((s) => ({ ...s, probability: Math.round((s.probability / topScore) * 100) }))
    .slice(0, 5);
}

export function filterPlayers(players: Player[], question: Question, answer: Answer): Player[] {
  if (answer === 'dontknow' || answer === 'maybe') return players;
  return players.filter((p) => matchesAnswer(p, question, answer));
}

export function computeConfidence(totalPlayers: number, remainingPlayers: number, questionsAsked: number): number {
  if (remainingPlayers <= 1) return 95;
  const reductionRatio = 1 - remainingPlayers / totalPlayers;
  const questionProgress = questionsAsked / 12;
  return Math.min(95, Math.round((reductionRatio * 60 + questionProgress * 40)));
}

export { PLAYERS, QUESTIONS };
export type { Answer };
