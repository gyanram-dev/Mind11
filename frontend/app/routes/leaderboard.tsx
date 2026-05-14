import type { Route } from './+types/leaderboard';
import { useState } from 'react';
import { Navbar } from '~/components/navbar/navbar';
import { Particles } from '~/components/particles/particles';
import { LEADERBOARD_DATA } from '~/data/questions';
import { IconTrophy, IconStar, IconFlame } from '@tabler/icons-react';
import styles from './leaderboard.module.css';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'IPL Mindreader – Leaderboard' }];
}

export default function Leaderboard() {
  const [view, setView] = useState<'week' | 'all'>('week');

  return (
    <div className={styles.page}>
      <Particles />
      <Navbar />
      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <IconTrophy size={28} color="#fbbf24" />
          </div>
          <div>
            <h1 className={styles.title}>GLOBAL LEADERBOARD</h1>
            <p className={styles.subtitle}>The world's top IPL Mindreader challengers</p>
          </div>
        </div>

        {/* Toggle */}
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${view === 'week' ? styles.active : ''}`}
            onClick={() => setView('week')}
          >
            This Week
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'all' ? styles.active : ''}`}
            onClick={() => setView('all')}
          >
            All Time
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className={styles.podium}>
          {LEADERBOARD_DATA.slice(0, 3).map((entry, i) => (
            <div
              key={entry.rank}
              className={`${styles.podiumCard} ${i === 0 ? styles.first : i === 1 ? styles.second : styles.third}`}
            >
              <div className={styles.podiumRank}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <div className={styles.podiumAvatar}>{entry.avatar}</div>
              <div className={styles.podiumName}>{entry.name}</div>
              <div className={styles.podiumPoints}>{entry.points.toLocaleString()} pts</div>
              <div className={styles.podiumWinrate}>{entry.winRate}% Win Rate</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th>RANK</th>
                <th>PLAYER</th>
                <th>POINTS</th>
                <th>WINS</th>
                <th>GAMES</th>
                <th>WIN RATE</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD_DATA.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`${styles.tableRow} ${'isYou' in entry && entry.isYou ? styles.youRow : ''}`}
                >
                  <td className={styles.rankCell}>
                    {entry.rank <= 3 ? (
                      <span className={styles.topRank}>{entry.rank}</span>
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </td>
                  <td className={styles.nameCell}>
                    <span className={styles.playerEmoji}>{entry.avatar}</span>
                    <span className={styles.playerName}>{entry.name}</span>
                    {'isYou' in entry && entry.isYou && <span className={styles.youBadge}>YOU</span>}
                  </td>
                  <td className={styles.pointsCell}>
                    <IconStar size={14} color="#fbbf24" />
                    {entry.points.toLocaleString()}
                  </td>
                  <td>{entry.wins}</td>
                  <td>{entry.games}</td>
                  <td>
                    <div className={styles.winRateCell}>
                      <span style={{ color: entry.winRate >= 80 ? '#22c55e' : entry.winRate >= 70 ? '#fbbf24' : '#ef4444' }}>
                        {entry.winRate}%
                      </span>
                      {entry.winRate >= 80 && <IconFlame size={14} color="#ef4444" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
