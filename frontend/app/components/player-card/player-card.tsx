import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { Player } from '~/data/players';
import { createAvatarUrl } from '~/lib/playerNormalizer';
import styles from './player-card.module.css';

interface PlayerCardProps {
  player: Player;
  glowColor?: string;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

export function PlayerCard({ player, glowColor, style, className, compact }: PlayerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const rawX = useSpring(0, { stiffness: 200, damping: 22 });
  const rawY = useSpring(0, { stiffness: 200, damping: 22 });
  const scale = useSpring(1, { stiffness: 250, damping: 24 });
  const lift = useSpring(0, { stiffness: 250, damping: 20 });

  const rotateX = useTransform(rawX, [-1, 1], [14, -14]);
  const rotateY = useTransform(rawY, [-1, 1], [-14, 14]);

  const glow = glowColor || player.cardGlow || 'rgba(0, 212, 255, 0.5)';
  const glowRgb = extractRgb(glow);
  const fallbackImageUrl = createAvatarUrl(player.name);
  const displayImageUrl = imgError || !player.imageUrl ? fallbackImageUrl : player.imageUrl;

  useEffect(() => {
    setImgError(false);
    setFallbackError(false);
  }, [player.imageUrl, player.name]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(y);
    rawY.set(x);
  }

  function handleMouseEnter() {
    setHovered(true);
    scale.set(1.07);
    lift.set(-14);
  }

  function handleMouseLeave() {
    setHovered(false);
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    lift.set(0);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${compact ? styles.compact : ''} ${className || ''}`}
      style={{
        '--glow-color': glow,
        '--glow-rgb': glowRgb,
        rotateX,
        rotateY,
        scale,
        y: lift,
        transformPerspective: 800,
        ...style,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className={styles.cardInner}
        style={{
          boxShadow: hovered
            ? `0 30px 80px rgba(0,0,0,0.7), 0 0 50px rgba(${glowRgb},0.6), 0 0 100px rgba(${glowRgb},0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(${glowRgb},0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
          transition: 'box-shadow 0.35s ease',
          borderColor: hovered ? `rgba(${glowRgb},0.4)` : 'rgba(255,255,255,0.12)',
        }}
      >
        {/* Top neon edge */}
        <div
          className={styles.glowEdge}
          style={{
            background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.35s',
            boxShadow: hovered ? `0 0 15px rgba(${glowRgb},0.5)` : 'none',
          }}
        />

        {/* Team badge */}
        <div className={styles.teamBadge} style={{ color: player.teamColor }}>
          <span className={styles.teamEmoji}>{getTeamEmoji(player.team)}</span>
          <span className={styles.teamName}>{player.team}</span>
        </div>

        {/* Player real photo */}
        <div className={styles.playerImageArea}>
          {!fallbackError ? (
            <img
              src={displayImageUrl}
              alt={player.name}
              className={styles.playerPhoto}
              onError={() => {
                if (!imgError && player.imageUrl) {
                  setImgError(true);
                  return;
                }

                setFallbackError(true);
              }}
            />
          ) : (
            <div className={styles.playerSilhouette}>
              <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="35" rx="18" ry="20" fill={glow} opacity="0.75" />
                <path d="M20 140 Q30 80 50 75 Q70 80 80 140" fill={glow} opacity="0.55" />
                <line x1="30" y1="100" x2="10" y2="125" stroke={glow} strokeWidth="8" strokeLinecap="round" opacity="0.5" />
                <line x1="70" y1="100" x2="85" y2="115" stroke={glow} strokeWidth="8" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          )}
          {/* Glow beneath image */}
          <div
            className={styles.imageGlow}
            style={{ background: `radial-gradient(ellipse at center, rgba(${glowRgb},0.3) 0%, transparent 70%)` }}
          />
        </div>

        {/* Card info */}
        <div className={styles.cardInfo}>
          <div className={styles.playerName}>{player.name}</div>
          <div className={styles.playerRole} style={{ color: glow }}>{player.role}</div>
          {!compact && (
            <div className={styles.playerStats}>
              {player.runs > 0 && <span>{player.runs.toLocaleString()} Runs</span>}
              {player.wickets > 0 && <span>{player.wickets} Wkts</span>}
            </div>
          )}
        </div>

        {/* Shine sweep */}
        <div className={styles.shine} />

        {/* Scan line */}
        {hovered && <div className={styles.scanLine} />}

        {/* Ripple clicks */}
        {ripples.map((rp) => (
          <span
            key={rp.id}
            className={styles.ripple}
            style={{
              left: rp.x,
              top: rp.y,
              background: `radial-gradient(circle, rgba(${glowRgb},0.5) 0%, transparent 70%)`,
            }}
          />
        ))}

        {hovered && <div className={styles.hoverBackdrop} />}
      </div>
    </motion.div>
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
