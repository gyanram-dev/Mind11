import { useState, useCallback } from 'react';
import { PLAYERS, QUESTIONS, filterPlayers, computeTopProspects, computeConfidence } from '~/data/game-engine';
import type { Answer } from '~/data/questions';
import type { GameState } from '~/data/game-engine';

const INITIAL_STATE: GameState = {
  currentQuestion: 0,
  answers: {},
  possiblePlayers: PLAYERS,
  confidence: 0,
  topProspects: [],
  isComplete: false,
  finalGuess: null,
  phase: 'playing',
};

export function useGame() {
  const [state, setState] = useState<GameState>({
    ...INITIAL_STATE,
    topProspects: computeTopProspects(PLAYERS, {}),
  });

  const [history, setHistory] = useState<Array<{ question: string; answer: Answer }>>([]);

  const answer = useCallback((answerValue: Answer) => {
    setState((prev) => {
      const question = QUESTIONS[prev.currentQuestion];
      if (!question) return prev;

      const newAnswers = { ...prev.answers, [question.id]: answerValue };
      const newPossible = filterPlayers(prev.possiblePlayers, question, answerValue);
      const newTopProspects = computeTopProspects(newPossible.length > 0 ? newPossible : PLAYERS, newAnswers);
      const nextQ = prev.currentQuestion + 1;
      const confidence = computeConfidence(PLAYERS.length, newPossible.length, nextQ);

      const shouldGuess = newPossible.length === 1 || confidence >= 85 || nextQ >= QUESTIONS.length;
      const finalGuess = shouldGuess ? (newPossible[0] || newTopProspects[0]?.player || null) : null;

      setHistory((h) => [...h, { question: question.text, answer: answerValue }]);

      return {
        ...prev,
        currentQuestion: nextQ,
        answers: newAnswers,
        possiblePlayers: newPossible.length > 0 ? newPossible : prev.possiblePlayers,
        confidence,
        topProspects: newTopProspects,
        isComplete: shouldGuess,
        finalGuess,
        phase: shouldGuess ? 'guessing' : 'playing',
      };
    });
  }, []);

  const confirmGuess = useCallback((wasRight: boolean) => {
    setState((prev) => ({ ...prev, phase: 'revealed' }));
  }, []);

  const reset = useCallback(() => {
    setState({ ...INITIAL_STATE, topProspects: computeTopProspects(PLAYERS, {}) });
    setHistory([]);
  }, []);

  const currentQuestion = QUESTIONS[state.currentQuestion] || null;

  return { state, history, currentQuestion, answer, confirmGuess, reset };
}
