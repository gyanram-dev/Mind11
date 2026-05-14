import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconStar, IconTrophy, IconTarget, IconShirt } from '@tabler/icons-react';
import type { Player } from '~/data/players';
import styles from './player-profile-modal.module.css';

interface PlayerProfileModalProps {
  player: Player | null;
  glowColor: string;
  onClose: () => void;
}

const ROLE_ICON_MAP: Record<string, string> = {
  Batsman: '🏏',
  Bowler: '⚡',
  'All-rounder': '🌟',
  'Wicket-keeper': '🧤',
};

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.statBlock}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={styles.badge} style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}

export function PlayerProfileModal({ player, glowColor, onClose }: PlayerProfileModalProps) {
  useEffect(() => {
    if (!player) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, onClose]);

  const glow = glowColor || player?.cardGlow || 'rgba(0,212,255,0.5)';
  const glowRgb = extractRgb(glow);

  return (
    <AnimatePresence>
      {player && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            style={{
              '--glow-color': glow,
              '--glow-rgb': glowRgb,
            } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow border accent */}
            <div className={styles.topAccent} style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />

            {/* Close button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close profile">
              <IconX size={18} />
            </button>

            {/* Header: image + identity */}
            <div className={styles.header}>
              <div className={styles.imageWrap} style={{ boxShadow: `0 0 40px rgba(${glowRgb},0.4)` }}>
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  className={styles.portrait}
                />
                <div
                  className={styles.imageGlow}
                  style={{ background: `radial-gradient(ellipse at bottom, rgba(${glowRgb},0.45) 0%, transparent 70%)` }}
                />
              </div>

              <div className={styles.identity}>
                <div className={styles.teamBadge} style={{ color: player.teamColor }}>
                  <span>{getTeamEmoji(player.team)}</span>
                  <span>{player.team}</span>
                </div>
                <h2 className={styles.playerName}>{player.name}</h2>
                <div className={styles.roleRow}>
                  <span>{ROLE_ICON_MAP[player.role] ?? '🏏'}</span>
                  <span className={styles.role} style={{ color: glow }}>{player.role}</span>
                </div>
                <div className={styles.meta}>
                  <span>🌍 {player.nationality}</span>
                  <span>🏏 {player.battingStyle}-hand bat</span>
                  {player.bowlingStyle !== 'None' && <span>⚡ {player.bowlingStyle}</span>}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className={styles.statsGrid}>
              <StatBlock label="Matches" value={player.matches} />
              <StatBlock label="Runs" value={player.runs.toLocaleString()} />
              <StatBlock label="Wickets" value={player.wickets} />
              <StatBlock label="Style" value={player.battingStyle} />
            </div>

            {/* Achievements */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <IconTrophy size={14} />
                <span>Achievements</span>
              </div>
              <div className={styles.badges}>
                {player.orangeCap && <Badge label="🧡 Orange Cap" color={glow} />}
                {player.purpleCap && <Badge label="💜 Purple Cap" color={glow} />}
                {player.captainExperience && <Badge label="⭐ Captain" color={glow} />}
                {player.isOverseas && <Badge label="🌍 Overseas" color={glow} />}
                {Object.keys(player.attributes).slice(0, 4).map((attr) => (
                  <Badge key={attr} label={formatAttr(attr)} color={glow} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getTeamEmoji(team: string): string {
  const map: Record<string, string> = {
    MI: '🔵', CSK: '🟡', KKR: '🟣', RCB: '🔴',
    SRH: '🟠', RR: '🩷', GT: '⚡', LSG: '💙', PBKS: '❤️', DC: '🔷',
  };
  return map[team] || '🏏';
}

function extractRgb(color: string): string {
  const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]},${match[2]},${match[3]}`;
  if (color === '#fbbf24' || color === '#f9cd05') return '249,205,5';
  if (color === '#ef4444' || color === '#ec1c24') return '236,28,36';
  if (color === '#3b82f6' || color === '#004ba0') return '0,75,160';
  if (color === '#a855f7') return '168,85,247';
  if (color === '#00b2c3') return '0,178,195';
  return '0,212,255';
}

function formatAttr(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
