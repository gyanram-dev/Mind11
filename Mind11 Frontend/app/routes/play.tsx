import type { Route } from './+types/play';
import { Navbar } from '~/components/navbar/navbar';
import { Particles } from '~/components/particles/particles';
import { useGame } from '~/hooks/use-game';
import { IconCheck, IconX, IconMinus, IconQuestionMark, IconBrain, IconRefresh } from '@tabler/icons-react';
import styles from './play.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'IPL Mindreader – Game Arena' },
    { name: 'description', content: 'Answer AI questions to let the IPL Mindreader guess your player.' },
  ];
}

export default function Play() {
  const { state, history, currentQuestion, answer, confirmGuess, reset } = useGame();

  return (
    <div className={styles.page}>
      <Particles />
      <Navbar />

      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />

      <div className={styles.arena}>
        {/* Confidence bar */}
        <div className={styles.confidenceBar}>
          <div className={styles.confLabel}>
            <span>Question {Math.min(state.currentQuestion + 1, 15)} of {Math.min(history.length + 1, 15)}</span>
            <span className={styles.confValue}>Confidence: {state.confidence}%</span>
          </div>
          <div className={styles.confTrack}>
            <div
              className={styles.confFill}
              style={{ width: `${state.confidence}%` }}
            />
          </div>
        </div>

        <div className={styles.mainLayout}>
          {/* LEFT: Chat Console */}
          <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <div className={styles.aiAvatar}>
                <IconBrain size={18} color="#00d4ff" />
              </div>
              <div>
                <div className={styles.chatTitle}>AI NEURAL CONSOLE</div>
                <div className={styles.chatSub}>{state.possiblePlayers.length} players in consideration</div>
              </div>
            </div>

            <div className={styles.chatLog}>
              {history.map((h, i) => (
                <div key={i} className={styles.chatEntry}>
                  <div className={styles.chatAiMsg}>
                    <div className={styles.msgAiIcon}>
                      <IconBrain size={14} color="#00d4ff" />
                    </div>
                    <div className={styles.msgBubble}>{h.question}</div>
                  </div>
                  <div className={styles.chatUserMsg}>
                    <div className={`${styles.userAnswer} ${styles[h.answer]}`}>
                      {h.answer === 'yes' && <><IconCheck size={14} /> Yes</>}
                      {h.answer === 'no' && <><IconX size={14} /> No</>}
                      {h.answer === 'maybe' && <><IconMinus size={14} /> Maybe</>}
                      {h.answer === 'dontknow' && <><IconQuestionMark size={14} /> Don’t Know</>}
                    </div>
                  </div>
                </div>
              ))}

              {state.phase === 'playing' && currentQuestion && (
                <div className={styles.chatAiMsg}>
                  <div className={styles.msgAiIcon}>
                    <IconBrain size={14} color="#00d4ff" />
                  </div>
                  <div className={`${styles.msgBubble} ${styles.activeBubble}`}>
                    {currentQuestion.text}
                    <div className={styles.typingDots}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Answer buttons */}
            {state.phase === 'playing' && (
              <>
                <div className={styles.chooseLabel}>Choose your answer</div>
                <div className={styles.answerButtons}>
                  <button className={`${styles.ansBtn} ${styles.yes}`} onClick={() => answer('yes')}>
                    <IconCheck size={16} /> Yes
                  </button>
                  <button className={`${styles.ansBtn} ${styles.no}`} onClick={() => answer('no')}>
                    <IconX size={16} /> No
                  </button>
                  <button className={`${styles.ansBtn} ${styles.maybe}`} onClick={() => answer('maybe')}>
                    <IconMinus size={16} /> Maybe
                  </button>
                  <button className={`${styles.ansBtn} ${styles.dontknow}`} onClick={() => answer('dontknow')}>
                    <IconQuestionMark size={16} /> Don’t Know
                  </button>
                </div>
                <div className={styles.tip}>
                  💡 Tip: Think of current or past IPL players.
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Prediction Panel */}
          <div className={styles.predictionPanel}>
            {/* Players count */}
            <div className={styles.predCard}>
              <div className={styles.predCardTitle}>POSSIBLE PLAYERS</div>
              <div className={styles.playerCount}>{state.possiblePlayers.length}</div>
              <div className={styles.predCardSub}>Players in consideration</div>
            </div>

            {/* Top 3 prospects */}
            <div className={styles.predCard}>
              <div className={styles.predCardTitle}>TOP PROSPECTS</div>
              <div className={styles.prospectList}>
                {state.topProspects.slice(0, 3).map((p) => (
                  <div key={p.player.id} className={styles.prospectItem}>
                    <div className={styles.prospectAvatar} style={{ background: `linear-gradient(135deg, ${p.player.teamColor}44, ${p.player.teamColor}22)`, borderColor: `${p.player.teamColor}44` }}>
                      <span>{p.player.name.charAt(0)}</span>
                    </div>
                    <div className={styles.prospectInfo}>
                      <div className={styles.prospectName}>{p.player.name}</div>
                      <div className={styles.prospectTeam}>{p.player.team}</div>
                      <div className={styles.prospectBar}>
                        <div className={styles.prospectFill} style={{ width: `${p.probability}%`, background: p.player.teamColor }} />
                      </div>
                    </div>
                    <div className={styles.prospectPct} style={{ color: p.player.teamColor }}>
                      {p.probability}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game stats */}
            <div className={styles.predCard}>
              <div className={styles.predCardTitle}>GAME STATS</div>
              <div className={styles.gameStats}>
                <div className={styles.gameStat}>
                  <span className={styles.gameStatIcon}>🎮</span>
                  <div className={styles.gameStatLabel}>Questions Asked</div>
                  <div className={styles.gameStatValue} style={{ color: '#a855f7' }}>{history.length}</div>
                </div>
                <div className={styles.gameStat}>
                  <span className={styles.gameStatIcon}>🎯</span>
                  <div className={styles.gameStatLabel}>Confidence</div>
                  <div className={styles.gameStatValue} style={{ color: '#22c55e' }}>{state.confidence}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL GUESS OVERLAY */}
      {state.phase === 'guessing' && state.finalGuess && (
        <div className={styles.overlay}>
          <div className={styles.guessCard}>
            <div className={styles.guessConfidence}>I’m {state.confidence}% confident...</div>
            <div className={styles.guessLabel}>You are thinking of</div>
            <div className={styles.guessName} style={{ color: state.finalGuess.teamColor }}>
              {state.finalGuess.name}
            </div>
            <div className={styles.guessTeam}>
              <span>{getTeamEmoji(state.finalGuess.team)}</span>
              <span>{state.finalGuess.team}</span>
            </div>
            <div className={styles.guessPlayerIcon}>
              <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="160">
                <ellipse cx="50" cy="35" rx="18" ry="20" fill={state.finalGuess.teamColor} opacity="0.8" />
                <path d="M20 140 Q30 80 50 75 Q70 80 80 140" fill={state.finalGuess.teamColor} opacity="0.6" />
              </svg>
            </div>
            <div className={styles.guessQuestion}>Was I Right?</div>
            <div className={styles.guessActions}>
              <button className={styles.guessYes} onClick={() => confirmGuess(true)}>
                <IconCheck size={18} /> Yes, Correct!
              </button>
              <button className={styles.guessNo} onClick={() => confirmGuess(false)}>
                <IconX size={18} /> No, Wrong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVEALED OVERLAY */}
      {state.phase === 'revealed' && (
        <div className={styles.overlay}>
          <div className={styles.revealedCard}>
            <div className={styles.revealEmoji}>🏆</div>
            <div className={styles.revealTitle}>Challenge Complete!</div>
            <div className={styles.revealSub}>
              {state.finalGuess ? `The answer was ${state.finalGuess.name}` : 'Thanks for playing!'}
            </div>
            <button className={styles.playAgainBtn} onClick={reset}>
              <IconRefresh size={18} /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTeamEmoji(team: string): string {
  const map: Record<string, string> = {
    MI: '🔵', CSK: '🟡', KKR: '🟣', RCB: '🔴',
    SRH: '🟠', RR: '🩷', GT: '⚡', LSG: '💙', PBKS: '❤️', DC: '🔷',
  };
  return map[team] || '🏏';
}
