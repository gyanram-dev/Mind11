import { useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayerCard } from '~/components/player-card/player-card';
import { recommendPlayers, type RecommendationPreferences } from '~/lib/api';
import type { Player as CardPlayer } from '~/data/players';
import { normalizePlayer } from '~/lib/playerNormalizer';
import { generateRecommendationReasoning } from '~/lib/recommendationReasoning';
import { useRecommendationAnalysisMessageRotation } from '~/lib/recommendationLoadingAnalysis';

type PlayerRole = CardPlayer['role'];

interface PreferenceState {
  aggressive: boolean;
  powerHitter: boolean;
  finisher: boolean;
  spinner: boolean;
  fastBowler: boolean;
  role: PlayerRole | 'Any';
}

const roles: Array<PlayerRole | 'Any'> = ['Any', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

const preferenceOptions: Array<{
  key: keyof Omit<PreferenceState, 'role'>;
  label: string;
  tone: string;
}> = [
  { key: 'aggressive', label: 'Aggressive', tone: '#EF4444' },
  { key: 'powerHitter', label: 'Power Hitter', tone: '#FFC93C' },
  { key: 'finisher', label: 'Finisher', tone: '#00D1FF' },
  { key: 'spinner', label: 'Spinner', tone: '#5A3DFF' },
  { key: 'fastBowler', label: 'Fast Bowler', tone: '#3D7BFF' },
];

const initialPreferences: PreferenceState = {
  aggressive: false,
  powerHitter: false,
  finisher: false,
  spinner: false,
  fastBowler: false,
  role: 'Any',
};

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.992 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.52, ease: easeOut } },
} as const;

const cardGridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
} as const;

const cardRevealVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.975, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 150, damping: 24 },
  },
} as const;

const loadingSkeletonContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
} as const;

const loadingSkeletonItemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.48, ease: easeOut } },
} as const;

const analysisMessageVariants = {
  initial: { opacity: 0, y: 10, filter: 'blur(5px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
} as const;

export function RecommendationEngine() {
  const [preferences, setPreferences] = useState<PreferenceState>(initialPreferences);
  const [players, setPlayers] = useState<CardPlayer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCount = useMemo(
    () => preferenceOptions.filter((option) => preferences[option.key]).length + (preferences.role === 'Any' ? 0 : 1),
    [preferences]
  );

  function updateToggle(key: keyof Omit<PreferenceState, 'role'>) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  function updateRole(role: PlayerRole | 'Any') {
    setPreferences((current) => ({ ...current, role }));
  }

  async function requestRecommendations() {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await recommendPlayers(buildRecommendationPayload(preferences));
      setPlayers(response.map(normalizePlayer));
    } catch (requestError) {
      setPlayers([]);
      setError(requestError instanceof Error ? requestError.message : 'AI recommendation engine failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      style={styles.shell}
      variants={panelVariants}
      initial="hidden"
      animate="show"
      aria-label="AI recommendation engine"
    >
      <motion.div
        style={styles.backgroundAura}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div style={styles.panel}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              <motion.span
                style={styles.liveDot}
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              AI SELECTION CORE
            </div>
            <h2 style={styles.title}>Recommendation Engine</h2>
          </div>

          <div style={styles.signalMeter} aria-label={`${activeCount} active preference filters`}>
            <span style={styles.signalLabel}>MATCH VECTORS</span>
            <strong style={styles.signalValue}>{activeCount.toString().padStart(2, '0')}</strong>
          </div>
        </div>

        <div style={styles.controlsLayout}>
          <div style={styles.preferenceMatrix}>
            {preferenceOptions.map((option, index) => {
              const selected = preferences[option.key];

              return (
                <motion.button
                  key={option.key}
                  type="button"
                  style={{
                    ...styles.toggle,
                    borderColor: selected ? option.tone : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: selected
                      ? `0 0 18px ${hexToRgba(option.tone, 0.18)}, inset 0 0 14px ${hexToRgba(option.tone, 0.06)}`
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                  }}
                  onClick={() => updateToggle(option.key)}
                  whileHover={{ y: -2, scale: 1.006 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  aria-pressed={selected}
                >
                  <span style={{ ...styles.toggleOrb, background: selected ? option.tone : 'rgba(255, 255, 255, 0.18)' }}>
                    {selected && (
                      <motion.span
                        style={{ ...styles.togglePulse, background: option.tone }}
                        layoutId={`preference-pulse-${option.key}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.35, 1], opacity: [0.62, 0.12, 0.62] }}
                        transition={{ duration: 2.2 + index * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </span>
                  <span style={styles.toggleText}>{option.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div style={styles.rolePanel}>
            <label htmlFor="recommendation-role" style={styles.roleLabel}>
              ROLE PROFILE
            </label>
            <div style={styles.selectWrap}>
              <select
                id="recommendation-role"
                value={preferences.role}
                onChange={(event) => updateRole(event.target.value as PlayerRole | 'Any')}
                style={styles.select}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <span style={styles.selectGlow} aria-hidden="true" />
            </div>
          </div>

          <motion.button
            type="button"
            style={{
              ...styles.cta,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.86 : 1,
            }}
            onClick={requestRecommendations}
            disabled={loading}
            whileHover={loading ? undefined : { y: -2, scale: 1.006 }}
            whileTap={loading ? undefined : { scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <motion.span
              style={styles.ctaPulse}
              animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.08, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              style={styles.ctaShine}
              animate={{ x: ['-120%', '180%'] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
            />
            <span style={styles.ctaCore}>{loading ? 'Scanning Intelligence' : 'Generate AI Picks'}</span>
          </motion.button>
        </div>
      </div>

      <div style={styles.resultsSurface}>
        <AnimatePresence mode="wait">
          {loading && <LoadingState key="loading" />}

          {!loading && error && (
            <ErrorState key="error" message={error} onRetry={requestRecommendations} />
          )}

          {!loading && !error && hasSearched && players.length === 0 && <EmptyState key="empty" />}

          {!loading && !error && players.length > 0 && (
            <motion.div
              key="players"
              style={styles.resultsGrid}
              variants={cardGridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10, transition: { duration: 0.22 } }}
            >
              {players.map((player, index) => (
                <motion.div key={player.name} variants={cardRevealVariants} style={styles.cardSlot}>
                  <div style={styles.cardWithReasoning}>
                    <PlayerCard player={player} glowColor={player.cardGlow} compact />
                    <motion.div
                      style={styles.reasoningPanel}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                    >
                      <div style={styles.reasoningLabel}>AI ANALYSIS</div>
                      <p style={styles.reasoningText}>
                        {generateRecommendationReasoning(player)}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && !error && !hasSearched && (
            <motion.div
              key="idle"
              style={styles.idleState}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              <motion.div
                style={styles.idleCore}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <div style={styles.stateTitle}>Awaiting preference lock</div>
              <p style={styles.stateCopy}>Tune the player vectors and launch the intelligence scan.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function LoadingState() {
  const { message, index } = useRecommendationAnalysisMessageRotation({ active: true, intervalMs: 3200 });

  return (
    <motion.div
      style={styles.loadingWrap}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      <div style={styles.intelligenceChamber}>
        <motion.div
          style={styles.chamberGlow}
          aria-hidden="true"
          animate={{ opacity: [0.35, 0.62, 0.4], scale: [1, 1.04, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={styles.chamberGlass}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.04 }}
        >
          <div style={styles.scanner}>
            <motion.div
              style={styles.scannerRingOuter}
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              style={styles.scannerRing}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              style={styles.scannerRingNeural}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              style={styles.neuralPulse}
              animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.38, 0.22] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />

            <motion.div
              style={styles.scannerBeam}
              animate={{
                top: ['8%', '88%', '8%'],
                opacity: [0.15, 0.95, 0.15],
                scaleX: [0.92, 1, 0.92],
              }}
              transition={{ duration: 2.85, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            />

            <motion.div
              style={styles.scanShimmer}
              animate={{ x: ['-40%', '140%'], opacity: [0, 0.55, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
              aria-hidden="true"
            />

            <motion.span
              style={styles.scannerCore}
              animate={{ scale: [1, 1.055, 1], textShadow: ['0 0 22px rgba(0, 209, 255, 0.75)', '0 0 34px rgba(0, 209, 255, 0.95)', '0 0 22px rgba(0, 209, 255, 0.75)'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              AI
            </motion.span>
          </div>

          <div style={styles.chamberFooter}>
            <div style={styles.chamberKicker}>
              <motion.span
                style={styles.chamberLiveDot}
                animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              LIVE NEURAL SCAN
            </div>

            <div
              style={styles.analysisMessageHost}
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={index}
                  style={styles.analysisMessage}
                  variants={analysisMessageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {message}
                </motion.p>
              </AnimatePresence>
            </div>

            <div style={styles.dataStreamRow} aria-hidden="true">
              {[0, 1, 2, 3].map((stream) => (
                <motion.span
                  key={stream}
                  style={{ ...styles.dataStreamBar, width: `${28 + stream * 12}%` }}
                  animate={{ opacity: [0.2, 0.85, 0.2], scaleX: [0.96, 1, 0.96] }}
                  transition={{
                    duration: 2.1 + stream * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: stream * 0.12,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={styles.skeletonGrid}
        variants={loadingSkeletonContainerVariants}
        initial="hidden"
        animate="show"
      >
        {[0, 1, 2].map((item) => (
          <motion.div
            key={item}
            style={styles.skeletonCard}
            variants={loadingSkeletonItemVariants}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 1.75, repeat: Infinity, ease: 'linear', delay: item * 0.14 }}
          >
            <div style={styles.skeletonTop} />
            <div style={styles.skeletonBody} />
            <div style={styles.skeletonLine} />
            <div style={{ ...styles.skeletonLine, width: '58%' }} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      style={styles.errorPanel}
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.38, ease: easeOut }}
    >
      <div style={styles.errorKicker}>NEURAL LINK INTERRUPTED</div>
      <div style={styles.stateTitle}>Recommendation scan failed</div>
      <p style={styles.stateCopy}>{message}</p>
      <motion.button
        type="button"
        style={styles.retryButton}
        onClick={onRetry}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        Retry Scan
      </motion.button>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      style={styles.emptyPanel}
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.38, ease: easeOut }}
    >
      <motion.div
        style={styles.emptyOrbit}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <div style={styles.stateTitle}>No player signature found</div>
      <p style={styles.stateCopy}>The AI core found no squad match for this preference constellation.</p>
    </motion.div>
  );
}

function buildRecommendationPayload(preferences: PreferenceState): RecommendationPreferences {
  const attributes = preferenceOptions.reduce<Record<string, boolean>>((selected, option) => {
    if (preferences[option.key]) {
      selected[option.key] = true;
    }
    return selected;
  }, {});

  return {
    ...(preferences.role !== 'Any' ? { requiredRoles: [preferences.role] } : {}),
    ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const styles = {
  shell: {
    position: 'relative',
    width: '100%',
    maxWidth: 1180,
    margin: '0 auto',
    padding: '16px 24px 20px',
    color: 'var(--color-text-primary)',
  },
  backgroundAura: {
    position: 'absolute',
    inset: '4% 9% auto',
    height: 260,
    background:
      'radial-gradient(ellipse at 50% 20%, rgba(0, 209, 255, 0.12), transparent 64%), radial-gradient(ellipse at 26% 48%, rgba(255, 201, 60, 0.075), transparent 58%), radial-gradient(ellipse at 74% 50%, rgba(90, 61, 255, 0.095), transparent 62%)',
    filter: 'blur(34px)',
    pointerEvents: 'none',
  },
  panel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 18,
    border: '1px solid rgba(255, 255, 255, 0.115)',
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.082), rgba(255, 255, 255, 0.026)), linear-gradient(180deg, rgba(5, 11, 42, 0.84), rgba(2, 6, 23, 0.9))',
    boxShadow:
      '0 18px 58px rgba(0, 0, 0, 0.42), 0 0 44px rgba(61, 123, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.085)',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    padding: 18,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#00D1FF',
    fontFamily: 'var(--family-display)',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 2.6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#00D1FF',
    boxShadow: '0 0 12px rgba(0, 209, 255, 0.72)',
  },
  title: {
    margin: '6px 0 0',
    fontFamily: 'var(--family-display)',
    fontSize: 'clamp(1.18rem, 2.4vw, 1.85rem)',
    lineHeight: 1,
    letterSpacing: 0,
    color: '#FFFFFF',
    textShadow: '0 0 20px rgba(61, 123, 255, 0.18)',
  },
  signalMeter: {
    minWidth: 126,
    borderRadius: 12,
    border: '1px solid rgba(255, 201, 60, 0.22)',
    background: 'rgba(255, 201, 60, 0.052)',
    padding: '8px 12px',
    boxShadow: 'inset 0 0 16px rgba(255, 201, 60, 0.035), 0 0 18px rgba(255, 201, 60, 0.045)',
  },
  signalLabel: {
    display: 'block',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--family-mono)',
    fontSize: 8,
    letterSpacing: 1.4,
  },
  signalValue: {
    display: 'block',
    marginTop: 2,
    color: '#FFC93C',
    fontFamily: 'var(--family-display)',
    fontSize: 19,
    lineHeight: 1,
  },
  controlsLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: 12,
    alignItems: 'stretch',
  },
  preferenceMatrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
    gap: 8,
  },
  toggle: {
    position: 'relative',
    minHeight: 42,
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.066), rgba(255, 255, 255, 0.02))',
    color: 'var(--color-text-primary)',
    padding: '9px 10px',
    cursor: 'pointer',
    overflow: 'hidden',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
  },
  toggleOrb: {
    position: 'relative',
    width: 11,
    height: 11,
    borderRadius: '50%',
    flex: '0 0 auto',
    boxShadow: '0 0 10px currentColor',
  },
  togglePulse: {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    opacity: 0.5,
  },
  toggleText: {
    fontFamily: 'var(--family-display)',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  rolePanel: {
    borderRadius: 12,
    border: '1px solid rgba(61, 123, 255, 0.16)',
    background: 'rgba(61, 123, 255, 0.04)',
    padding: 12,
    boxShadow: 'inset 0 0 18px rgba(61, 123, 255, 0.032)',
  },
  roleLabel: {
    display: 'block',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--family-display)',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 2,
    marginBottom: 8,
  },
  selectWrap: {
    position: 'relative',
  },
  select: {
    width: '100%',
    height: 38,
    appearance: 'none',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(2, 6, 23, 0.66)',
    color: '#FFFFFF',
    padding: '0 12px',
    fontFamily: 'var(--family-body)',
    fontSize: 12,
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
  },
  selectGlow: {
    position: 'absolute',
    right: 12,
    top: '50%',
    width: 7,
    height: 7,
    borderRight: '2px solid rgba(0, 209, 255, 0.72)',
    borderBottom: '2px solid rgba(0, 209, 255, 0.72)',
    transform: 'translateY(-70%) rotate(45deg)',
    pointerEvents: 'none',
  },
  cta: {
    position: 'relative',
    minHeight: 64,
    border: 0,
    borderRadius: 13,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #FFC93C 0%, #FFB800 44%, #00D1FF 130%)',
    color: '#020617',
    fontFamily: 'var(--family-display)',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    boxShadow: '0 0 24px rgba(255, 201, 60, 0.2), 0 12px 28px rgba(0, 0, 0, 0.34)',
  },
  ctaPulse: {
    position: 'absolute',
    inset: -22,
    borderRadius: 24,
    background: 'radial-gradient(circle, rgba(255,255,255,0.46), transparent 64%)',
  },
  ctaShine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '38%',
    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.28), transparent 80%)',
    transform: 'skewX(-15deg)',
  },
  ctaCore: {
    position: 'relative',
    zIndex: 1,
  },
  resultsSurface: {
    position: 'relative',
    minHeight: 242,
    marginTop: 12,
    borderRadius: 18,
    border: '1px solid rgba(255, 255, 255, 0.085)',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.043), rgba(255, 255, 255, 0.016)), rgba(2, 6, 23, 0.62)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 14px 44px rgba(0, 0, 0, 0.3)',
    padding: '18px 20px',
    overflow: 'hidden',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(172px, 1fr))',
    gap: '18px 22px',
    alignItems: 'center',
    justifyItems: 'center',
  },
  cardSlot: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: 236,
  },
  cardWithReasoning: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    maxWidth: 188,
  },
  reasoningPanel: {
    position: 'relative',
    padding: '9px 11px',
    borderRadius: 10,
    border: '1px solid rgba(0, 209, 255, 0.14)',
    background: 'linear-gradient(135deg, rgba(0, 209, 255, 0.06), rgba(90, 61, 255, 0.045))',
    boxShadow: '0 0 14px rgba(0, 209, 255, 0.07), inset 0 0 10px rgba(0, 209, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  reasoningLabel: {
    fontFamily: 'var(--family-mono)',
    fontSize: 8,
    fontWeight: 800,
    letterSpacing: 1.8,
    color: '#00D1FF',
    marginBottom: 4,
    textShadow: '0 0 6px rgba(0, 209, 255, 0.45)',
  },
  reasoningText: {
    margin: 0,
    fontFamily: 'var(--family-body)',
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.45,
    color: 'rgba(255, 255, 255, 0.92)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  },
  loadingWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: 18,
    alignItems: 'stretch',
    minHeight: 216,
  },
  intelligenceChamber: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    minWidth: 0,
  },
  chamberGlow: {
    position: 'absolute',
    inset: '-4% -3% 9%',
    borderRadius: 20,
    background:
      'radial-gradient(ellipse 80% 70% at 50% 18%, rgba(0, 209, 255, 0.15), transparent 55%), radial-gradient(ellipse 70% 60% at 80% 70%, rgba(90, 61, 255, 0.1), transparent 58%), radial-gradient(ellipse 60% 50% at 18% 72%, rgba(255, 201, 60, 0.07), transparent 55%)',
    filter: 'blur(15px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  chamberGlass: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 314,
    margin: '0 auto',
    borderRadius: 18,
    border: '1px solid rgba(255, 255, 255, 0.095)',
    background:
      'linear-gradient(165deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.022)), linear-gradient(180deg, rgba(5, 14, 42, 0.68), rgba(2, 6, 23, 0.86))',
    boxShadow:
      '0 0 28px rgba(0, 209, 255, 0.07), 0 14px 38px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.075)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '16px 16px 15px',
    overflow: 'hidden',
  },
  scanner: {
    position: 'relative',
    width: 152,
    height: 152,
    borderRadius: '50%',
    margin: '0 auto',
    display: 'grid',
    placeItems: 'center',
    background:
      'radial-gradient(circle at 50% 42%, rgba(0, 209, 255, 0.15), rgba(61, 123, 255, 0.048) 42%, rgba(2, 6, 23, 0.32) 68%, transparent 72%)',
    boxShadow: 'inset 0 0 34px rgba(0, 209, 255, 0.052)',
    overflow: 'hidden',
  },
  scannerRingOuter: {
    position: 'absolute',
    inset: 2,
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(0, 209, 255, 0.55)',
    borderLeftColor: 'rgba(255, 201, 60, 0.35)',
    boxShadow: '0 0 22px rgba(0, 209, 255, 0.12), inset 0 0 20px rgba(0, 209, 255, 0.05)',
  },
  scannerRing: {
    position: 'absolute',
    inset: 13,
    borderRadius: '50%',
    border: '1px solid rgba(0, 209, 255, 0.26)',
    borderTopColor: '#00D1FF',
    borderRightColor: 'rgba(255, 201, 60, 0.75)',
    boxShadow: '0 0 20px rgba(0, 209, 255, 0.15), inset 0 0 20px rgba(0, 209, 255, 0.055)',
  },
  scannerRingNeural: {
    position: 'absolute',
    inset: 25,
    borderRadius: '50%',
    border: '1px dashed rgba(0, 209, 255, 0.35)',
    borderTopColor: 'rgba(255, 201, 60, 0.55)',
    boxShadow: 'inset 0 0 18px rgba(90, 61, 255, 0.12)',
  },
  neuralPulse: {
    position: 'absolute',
    inset: 36,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 209, 255, 0.35), rgba(90, 61, 255, 0.12) 55%, transparent 70%)',
    filter: 'blur(0.5px)',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  scannerBeam: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: '12%',
    height: 2,
    borderRadius: 999,
    background: 'linear-gradient(90deg, transparent 0%, rgba(0, 209, 255, 0.15) 20%, #00D1FF 50%, #FFC93C 72%, transparent 100%)',
    boxShadow: '0 0 16px rgba(0, 209, 255, 0.85), 0 0 28px rgba(255, 201, 60, 0.25)',
    transformOrigin: '50% 50%',
  },
  scanShimmer: {
    position: 'absolute',
    inset: 0,
    width: '42%',
    left: '-8%',
    background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 48%, rgba(0,209,255,0.22) 52%, transparent 68%)',
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    borderRadius: '50%',
  },
  scannerCore: {
    position: 'relative',
    zIndex: 2,
    fontFamily: 'var(--family-display)',
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: 1,
    color: '#FFFFFF',
    textShadow: '0 0 18px rgba(0, 209, 255, 0.66)',
  },
  chamberFooter: {
    marginTop: 13,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    textAlign: 'center',
  },
  chamberKicker: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--family-display)',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: 2.6,
    color: 'rgba(0, 209, 255, 0.95)',
    textShadow: '0 0 14px rgba(0, 209, 255, 0.45)',
  },
  chamberLiveDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#00D1FF',
    boxShadow: '0 0 12px rgba(0, 209, 255, 0.95)',
  },
  analysisMessageHost: {
    minHeight: 52,
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    padding: '0 4px',
  },
  analysisMessage: {
    margin: 0,
    maxWidth: 320,
    fontFamily: 'var(--family-body)',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.45,
    color: 'rgba(255, 255, 255, 0.94)',
    letterSpacing: 0.01,
  },
  dataStreamRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: '100%',
    maxWidth: 250,
    marginTop: 2,
  },
  dataStreamBar: {
    height: 3,
    alignSelf: 'center',
    borderRadius: 999,
    background: 'linear-gradient(90deg, transparent, rgba(0, 209, 255, 0.35), rgba(255, 201, 60, 0.45), transparent)',
    transformOrigin: 'center',
  },
  skeletonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
  },
  skeletonCard: {
    minHeight: 184,
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.095)',
    background:
      'linear-gradient(105deg, rgba(255,255,255,0.04) 25%, rgba(0,209,255,0.18) 38%, rgba(255,201,60,0.11) 48%, rgba(255,255,255,0.04) 62%)',
    backgroundSize: '220% 100%',
    padding: 12,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 18px rgba(0, 209, 255, 0.055)',
  },
  skeletonTop: {
    width: 62,
    height: 10,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.16)',
  },
  skeletonBody: {
    height: 104,
    marginTop: 14,
    borderRadius: 12,
    background: 'linear-gradient(180deg, rgba(0, 209, 255, 0.16), rgba(255, 255, 255, 0.045))',
  },
  skeletonLine: {
    width: '78%',
    height: 9,
    marginTop: 11,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.15)',
  },
  idleState: {
    minHeight: 210,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 10,
  },
  idleCore: {
    width: 74,
    height: 74,
    borderRadius: '50%',
    border: '1px solid rgba(0, 209, 255, 0.25)',
    borderTopColor: '#00D1FF',
    borderBottomColor: '#FFC93C',
    boxShadow: '0 0 26px rgba(0, 209, 255, 0.12), inset 0 0 22px rgba(255, 201, 60, 0.045)',
  },
  errorPanel: {
    minHeight: 210,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 12,
    borderRadius: 16,
    border: '1px solid rgba(239, 68, 68, 0.26)',
    background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.105), rgba(255,255,255,0.02) 58%, transparent)',
    boxShadow: '0 0 26px rgba(239, 68, 68, 0.085), inset 0 0 22px rgba(239, 68, 68, 0.04)',
    padding: 20,
  },
  errorKicker: {
    color: '#EF4444',
    fontFamily: 'var(--family-display)',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 2.4,
  },
  emptyPanel: {
    position: 'relative',
    minHeight: 210,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 10,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(0, 209, 255, 0.18)',
    background: 'radial-gradient(ellipse at center, rgba(0, 209, 255, 0.075), rgba(255,255,255,0.016) 62%, transparent)',
    padding: 20,
  },
  emptyOrbit: {
    width: 78,
    height: 78,
    borderRadius: '50%',
    border: '1px dashed rgba(0, 209, 255, 0.42)',
    borderTopColor: '#FFC93C',
    boxShadow: '0 0 22px rgba(0, 209, 255, 0.1)',
  },
  stateTitle: {
    fontFamily: 'var(--family-display)',
    fontSize: 16,
    fontWeight: 900,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  stateCopy: {
    maxWidth: 460,
    margin: 0,
    color: 'var(--color-text-secondary)',
    fontSize: 13,
    lineHeight: 1.55,
  },
  retryButton: {
    minHeight: 42,
    border: '1px solid rgba(239, 68, 68, 0.45)',
    borderRadius: 999,
    background: 'rgba(239, 68, 68, 0.11)',
    color: '#FFFFFF',
    padding: '0 20px',
    fontFamily: 'var(--family-display)',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 0 22px rgba(239, 68, 68, 0.14)',
  },
} satisfies Record<string, CSSProperties>;

export default RecommendationEngine;
