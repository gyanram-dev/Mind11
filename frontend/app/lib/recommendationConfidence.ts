import type { Player } from '~/data/players';

/**
 * Calculates a premium AI confidence score based on player attributes and stats.
 * 
 * Logic:
 * - Base confidence is determined by experience (matches).
 * - Performance (runs, wickets) adds significant weight.
 * - Caps and captaincy boost the score to 'Elite' levels.
 * - Attributes match adds fine-grained confidence.
 * 
 * Example ranges:
 * Elite matches: 92–98%
 * Moderate matches: 75–88%
 * Weak matches: 60–72%
 */
export function calculateConfidence(player: Player): number {
  let score = 60; // Base score for any recommended player

  // 1. Experience Normalization (Max +10)
  const matchesScore = Math.min((player.matches || 0) / 100, 1) * 10;
  score += matchesScore;

  // 2. Performance Impact (Max +15)
  let performanceScore = 0;
  if (player.role === 'Batsman' || player.role === 'Wicket-keeper') {
    performanceScore = Math.min((player.runs || 0) / 3000, 1) * 15;
  } else if (player.role === 'Bowler') {
    performanceScore = Math.min((player.wickets || 0) / 100, 1) * 15;
  } else if (player.role === 'All-rounder') {
    const batScore = Math.min((player.runs || 0) / 2000, 1) * 7.5;
    const bowlScore = Math.min((player.wickets || 0) / 75, 1) * 7.5;
    performanceScore = batScore + bowlScore;
  }
  score += performanceScore;

  // 3. Premium Indicators (Max +8)
  if (player.orangeCap) score += 4;
  if (player.purpleCap) score += 4;
  if (player.captainExperience) score += 3;

  // 4. Attribute Synergies (Max +5)
  if (player.attributes) {
    const attributeCount = Object.values(player.attributes).filter(val => val === true).length;
    score += Math.min(attributeCount, 5);
  }

  // Normalize and clamp between 60 and 98 to feel realistic but premium
  return Math.round(Math.min(Math.max(score, 60), 98));
}
