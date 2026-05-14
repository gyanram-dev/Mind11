import express from 'express';
import { loadRawPlayers, normalizePlayerProfiles } from '../services/preprocessService.js';
import { generateRecommendations } from '../services/recommendationEngine.js';
import { buildQuestionSet } from '../services/questionEngine.js';
import { scorePlayerActivity } from '../services/scoringEngine.js';
import { findPlayerById } from '../utils/playerUtils.js';

const router = express.Router();

router.get('/players', async (req, res) => {
  try {
    const players = await loadRawPlayers();
    res.json(normalizePlayerProfiles(players));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/players/:id/recommendations', async (req, res) => {
  try {
    const players = await loadRawPlayers();
    const player = findPlayerById(players, req.params.id);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ recommendations: generateRecommendations(player) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/questions', (req, res) => {
  res.json(buildQuestionSet());
});

router.post('/score', (req, res) => {
  const score = scorePlayerActivity(req.body);
  res.json({ score });
});

export default router;
