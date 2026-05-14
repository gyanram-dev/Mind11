import { useState, useCallback } from 'react';
import styles from './orbiting-cards.module.css';
import { PlayerCard } from '~/components/player-card/player-card';
import { PlayerProfileModal } from '~/components/player-profile-modal/player-profile-modal';
import { PLAYERS } from '~/data/players';
import type { Player } from '~/data/players';

// Explicitly find each player by ID — never rely on array order
const dhoni   = PLAYERS.find((p) => p.id === 'ms-dhoni')!;
const kohli   = PLAYERS.find((p) => p.id === 'virat-kohli')!;
const rohit   = PLAYERS.find((p) => p.id === 'rohit-sharma')!;
const shreyas = PLAYERS.find((p) => p.id === 'shreyas-iyer')!;

const ORBIT_PLAYERS = [
  { player: kohli,   glowColor: '#ec1c24', angleDeg: 315 },  // top-right
  { player: dhoni,  glowColor: '#f9cd05', angleDeg: 45  },  // bottom-right
  { player: rohit,  glowColor: '#004ba0', angleDeg: 135 },  // bottom-left
  { player: shreyas, glowColor: '#a855f7', angleDeg: 225 },  // top-left
];

const ORBIT_RADIUS = 280; // px from center to card center

interface SelectedPlayer {
  player: Player;
  glowColor: string;
}

export function OrbitingCards() {
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);

  const handleCardClick = useCallback((player: Player, glowColor: string) => {
    setSelected({ player, glowColor });
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <>
      <div className={styles.orbitField}>
        {/* Visible orbit ring */}
        <div
          className={styles.orbitRing}
          style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
        />

        {/*
          Single rotating ring that carries all 4 cards.
          Pauses when a card is selected.
        */}
        <div className={`${styles.ringSpinner} ${selected ? styles.paused : ''}`}>
          {ORBIT_PLAYERS.map((item) => {
            const rad = (item.angleDeg * Math.PI) / 180;
            const x = Math.sin(rad) * ORBIT_RADIUS;
            const y = -Math.cos(rad) * ORBIT_RADIUS;

            return (
              <div
                key={item.player.id}
                className={styles.cardSlot}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                {/*
                  Counter-spin exactly cancels parent ring rotation.
                  Pauses in sync so card stays upright when frozen.
                */}
                <div className={`${styles.cardCounterSpin} ${selected ? styles.paused : ''}`}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={styles.cardClickZone}
                    onClick={() => handleCardClick(item.player, item.glowColor)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCardClick(item.player, item.glowColor)}
                    aria-label={`View ${item.player.name} profile`}
                  >
                    <PlayerCard player={item.player} glowColor={item.glowColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PlayerProfileModal
        player={selected?.player ?? null}
        glowColor={selected?.glowColor ?? ''}
        onClose={handleClose}
      />
    </>
  );
}
