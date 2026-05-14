import { useEffect, useState } from 'react';

/** Curated tactical-analysis copy shown during recommendation fetch. */
export const RECOMMENDATION_AI_ANALYSIS_MESSAGES = [
  'Analyzing strike-rate vectors…',
  'Evaluating death-over efficiency…',
  'Computing batting aggression profiles…',
  'Cross-referencing IPL historical data…',
  'Running neural tactical simulations…',
  'Matching role compatibility…',
  'Calculating all-rounder impact…',
  'Scanning spin dominance metrics…',
  'Optimizing squad synergy…',
  'Predicting match-winning potential…',
] as const;

export type RecommendationAnalysisMessage = (typeof RECOMMENDATION_AI_ANALYSIS_MESSAGES)[number];

const DEFAULT_ROTATION_MS = 3200;

/**
 * Advances through analysis messages on an interval while loading.
 * Pacing is tuned for crossfade exits (AnimatePresence) without strobe-like changes.
 */
export function useRecommendationAnalysisMessageRotation(options?: {
  /** Milliseconds between message advances. */
  intervalMs?: number;
  /** When false, timer pauses (e.g. not loading). */
  active: boolean;
}): { message: RecommendationAnalysisMessage; index: number } {
  const intervalMs = options?.intervalMs ?? DEFAULT_ROTATION_MS;
  const active = options?.active;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % RECOMMENDATION_AI_ANALYSIS_MESSAGES.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  useEffect(() => {
    if (active) {
      setIndex(0);
    }
  }, [active]);

  return {
    message: RECOMMENDATION_AI_ANALYSIS_MESSAGES[index],
    index,
  };
}
