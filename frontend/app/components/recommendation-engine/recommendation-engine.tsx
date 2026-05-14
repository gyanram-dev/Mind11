import { useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayerCard } from '~/components/player-card/player-card';
import { recommendPlayers, type RecommendationPreferences } from '~/lib/api';
import type { Player as CardPlayer } from '~/data/players';
import { normalizePlayer } from '~/lib/playerNormalizer';

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
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: easeOut } },
} as const;

const cardGridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
} as const;

const cardRevealVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 170, damping: 22 },
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
                      ? `0 0 26px ${hexToRgba(option.tone, 0.25)}, inset 0 0 20px ${hexToRgba(option.tone, 0.08)}`
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                  }}
                  onClick={() => updateToggle(option.key)}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 330, damping: 24 }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  aria-pressed={selected}
                >
                  <span style={{ ...styles.toggleOrb, background: selected ? option.tone : 'rgba(255, 255, 255, 0.18)' }}>
                    {selected && (
                      <motion.span
                        style={{ ...styles.togglePulse, background: option.tone }}
                        layoutId={`preference-pulse-${option.key}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.15, 0.8] }}
                        transition={{ duration: 1.8 + index * 0.08, repeat: Infinity, ease: 'easeInOut' }}
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
            whileHover={loading ? undefined : { y: -4, scale: 1.015 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
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
              exit={{ opacity: 0, y: 18, transition: { duration: 0.25 } }}
            >
              {players.map((player) => (
                <motion.div key={player.name} variants={cardRevealVariants} style={styles.cardSlot}>
                  <PlayerCard player={player} glowColor={player.cardGlow} compact />
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
  return (
    <motion.div
      style={styles.loadingWrap}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      <div style={styles.scanner}>
        <motion.div
          style={styles.scannerRing}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={styles.scannerBeam}
          animate={{ y: ['0%', '220%', '0%'], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={styles.scannerCore}>AI</span>
      </div>

      <div style={styles.skeletonGrid}>
        {[0, 1, 2].map((item) => (
          <motion.div
            key={item}
            style={styles.skeletonCard}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: item * 0.12 }}
          >
            <div style={styles.skeletonTop} />
            <div style={styles.skeletonBody} />
            <div style={styles.skeletonLine} />
            <div style={{ ...styles.skeletonLine, width: '58%' }} />
          </motion.div>
        ))}
      </div>
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
    maxWidth: 1280,
    margin: '0 auto',
    padding: '24px',
    color: 'var(--color-text-primary)',
  },
  backgroundAura: {
    position: 'absolute',
    inset: '8% 4% auto',
    height: 360,
    background:
      'radial-gradient(ellipse at 50% 20%, rgba(0, 209, 255, 0.18), transparent 62%), radial-gradient(ellipse at 25% 50%, rgba(255, 201, 60, 0.11), transparent 58%), radial-gradient(ellipse at 75% 55%, rgba(90, 61, 255, 0.14), transparent 60%)',
    filter: 'blur(38px)',
    pointerEvents: 'none',
  },
  panel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.035)), linear-gradient(180deg, rgba(5, 11, 42, 0.86), rgba(2, 6, 23, 0.92))',
    boxShadow:
      '0 24px 80px rgba(0, 0, 0, 0.48), 0 0 70px rgba(61, 123, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    padding: 24,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 18,
    marginBottom: 22,
    flexWrap: 'wrap',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#00D1FF',
    fontFamily: 'var(--family-display)',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 3,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#00D1FF',
    boxShadow: '0 0 16px rgba(0, 209, 255, 0.9)',
  },
  title: {
    margin: '8px 0 0',
    fontFamily: 'var(--family-display)',
    fontSize: 'clamp(1.35rem, 3vw, 2.35rem)',
    lineHeight: 1,
    letterSpacing: 0,
    color: '#FFFFFF',
    textShadow: '0 0 28px rgba(61, 123, 255, 0.25)',
  },
  signalMeter: {
    minWidth: 138,
    borderRadius: 14,
    border: '1px solid rgba(255, 201, 60, 0.28)',
    background: 'rgba(255, 201, 60, 0.07)',
    padding: '10px 14px',
    boxShadow: 'inset 0 0 18px rgba(255, 201, 60, 0.05), 0 0 24px rgba(255, 201, 60, 0.08)',
  },
  signalLabel: {
    display: 'block',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--family-mono)',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  signalValue: {
    display: 'block',
    marginTop: 3,
    color: '#FFC93C',
    fontFamily: 'var(--family-display)',
    fontSize: 22,
    lineHeight: 1,
  },
  controlsLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: 16,
    alignItems: 'stretch',
  },
  preferenceMatrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
  },
  toggle: {
    position: 'relative',
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.025))',
    color: 'var(--color-text-primary)',
    padding: '11px 12px',
    cursor: 'pointer',
    overflow: 'hidden',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  toggleOrb: {
    position: 'relative',
    width: 14,
    height: 14,
    borderRadius: '50%',
    flex: '0 0 auto',
    boxShadow: '0 0 14px currentColor',
  },
  togglePulse: {
    position: 'absolute',
    inset: -5,
    borderRadius: '50%',
    opacity: 0.5,
  },
  toggleText: {
    fontFamily: 'var(--family-display)',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  rolePanel: {
    borderRadius: 14,
    border: '1px solid rgba(61, 123, 255, 0.2)',
    background: 'rgba(61, 123, 255, 0.055)',
    padding: 14,
    boxShadow: 'inset 0 0 24px rgba(61, 123, 255, 0.045)',
  },
  roleLabel: {
    display: 'block',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--family-display)',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 2,
    marginBottom: 10,
  },
  selectWrap: {
    position: 'relative',
  },
  select: {
    width: '100%',
    height: 44,
    appearance: 'none',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    background: 'rgba(2, 6, 23, 0.72)',
    color: '#FFFFFF',
    padding: '0 14px',
    fontFamily: 'var(--family-body)',
    fontSize: 13,
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
  },
  selectGlow: {
    position: 'absolute',
    right: 14,
    top: '50%',
    width: 8,
    height: 8,
    borderRight: '2px solid rgba(0, 209, 255, 0.8)',
    borderBottom: '2px solid rgba(0, 209, 255, 0.8)',
    transform: 'translateY(-70%) rotate(45deg)',
    pointerEvents: 'none',
  },
  cta: {
    position: 'relative',
    minHeight: 76,
    border: 0,
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #FFC93C 0%, #FFB800 44%, #00D1FF 130%)',
    color: '#020617',
    fontFamily: 'var(--family-display)',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: 'uppercase',
    boxShadow: '0 0 34px rgba(255, 201, 60, 0.28), 0 18px 38px rgba(0, 0, 0, 0.4)',
  },
  ctaPulse: {
    position: 'absolute',
    inset: -28,
    borderRadius: 28,
    background: 'radial-gradient(circle, rgba(255,255,255,0.65), transparent 62%)',
  },
  ctaShine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '44%',
    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.38), transparent 80%)',
    transform: 'skewX(-15deg)',
  },
  ctaCore: {
    position: 'relative',
    zIndex: 1,
  },
  resultsSurface: {
    position: 'relative',
    minHeight: 290,
    marginTop: 18,
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02)), rgba(2, 6, 23, 0.68)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 60px rgba(0, 0, 0, 0.35)',
    padding: 22,
    overflow: 'hidden',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 22,
    alignItems: 'center',
    justifyItems: 'center',
  },
  cardSlot: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: 250,
  },
  loadingWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: 22,
    alignItems: 'center',
    minHeight: 246,
  },
  scanner: {
    position: 'relative',
    width: 180,
    height: 180,
    borderRadius: '50%',
    margin: '0 auto',
    display: 'grid',
    placeItems: 'center',
    background: 'radial-gradient(circle, rgba(0, 209, 255, 0.14), rgba(61, 123, 255, 0.04) 45%, transparent 68%)',
    overflow: 'hidden',
  },
  scannerRing: {
    position: 'absolute',
    inset: 10,
    borderRadius: '50%',
    border: '1px solid rgba(0, 209, 255, 0.28)',
    borderTopColor: '#00D1FF',
    borderRightColor: 'rgba(255, 201, 60, 0.8)',
    boxShadow: '0 0 28px rgba(0, 209, 255, 0.18), inset 0 0 28px rgba(0, 209, 255, 0.08)',
  },
  scannerBeam: {
    position: 'absolute',
    left: '14%',
    right: '14%',
    top: -20,
    height: 3,
    background: 'linear-gradient(90deg, transparent, #00D1FF, #FFC93C, transparent)',
    boxShadow: '0 0 18px rgba(0, 209, 255, 0.9)',
  },
  scannerCore: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'var(--family-display)',
    fontSize: 28,
    fontWeight: 900,
    color: '#FFFFFF',
    textShadow: '0 0 22px rgba(0, 209, 255, 0.8)',
  },
  skeletonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 14,
  },
  skeletonCard: {
    minHeight: 220,
    borderRadius: 18,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background:
      'linear-gradient(105deg, rgba(255,255,255,0.04) 25%, rgba(0,209,255,0.18) 38%, rgba(255,201,60,0.11) 48%, rgba(255,255,255,0.04) 62%)',
    backgroundSize: '220% 100%',
    padding: 14,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 26px rgba(0, 209, 255, 0.08)',
  },
  skeletonTop: {
    width: 62,
    height: 10,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.16)',
  },
  skeletonBody: {
    height: 126,
    marginTop: 18,
    borderRadius: 14,
    background: 'linear-gradient(180deg, rgba(0, 209, 255, 0.16), rgba(255, 255, 255, 0.045))',
  },
  skeletonLine: {
    width: '78%',
    height: 9,
    marginTop: 14,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.15)',
  },
  idleState: {
    minHeight: 246,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 10,
  },
  idleCore: {
    width: 88,
    height: 88,
    borderRadius: '50%',
    border: '1px solid rgba(0, 209, 255, 0.25)',
    borderTopColor: '#00D1FF',
    borderBottomColor: '#FFC93C',
    boxShadow: '0 0 36px rgba(0, 209, 255, 0.16), inset 0 0 28px rgba(255, 201, 60, 0.06)',
  },
  errorPanel: {
    minHeight: 246,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 12,
    borderRadius: 18,
    border: '1px solid rgba(239, 68, 68, 0.32)',
    background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.14), rgba(255,255,255,0.025) 58%, transparent)',
    boxShadow: '0 0 34px rgba(239, 68, 68, 0.12), inset 0 0 28px rgba(239, 68, 68, 0.05)',
    padding: 24,
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
    minHeight: 246,
    display: 'grid',
    placeItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 10,
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid rgba(0, 209, 255, 0.22)',
    background: 'radial-gradient(ellipse at center, rgba(0, 209, 255, 0.1), rgba(255,255,255,0.02) 62%, transparent)',
    padding: 24,
  },
  emptyOrbit: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    border: '1px dashed rgba(0, 209, 255, 0.42)',
    borderTopColor: '#FFC93C',
    boxShadow: '0 0 30px rgba(0, 209, 255, 0.13)',
  },
  stateTitle: {
    fontFamily: 'var(--family-display)',
    fontSize: 18,
    fontWeight: 900,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  stateCopy: {
    maxWidth: 460,
    margin: 0,
    color: 'var(--color-text-secondary)',
    fontSize: 14,
    lineHeight: 1.6,
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
