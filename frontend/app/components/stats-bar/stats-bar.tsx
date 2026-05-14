import styles from './stats-bar.module.css';
import { IconUsers, IconTarget, IconDeviceGamepad2, IconTrophy } from '@tabler/icons-react';

const STATS = [
  { icon: IconUsers, value: '842+', label: 'IPL Players', color: '#a855f7' },
  { icon: IconTarget, value: '91%', label: 'Accuracy Rate', color: '#00d4ff' },
  { icon: IconDeviceGamepad2, value: '3.4K+', label: 'Games Today', color: '#22c55e' },
  { icon: IconTrophy, value: '1', label: 'Goal – Guess Right!', color: '#fbbf24' },
];

export function StatsBar() {
  return (
    <div className={styles.statsBar}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className={styles.statItem}>
          <div className={styles.statIcon} style={{ color: stat.color }}>
            <stat.icon size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue} style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
          {i < STATS.length - 1 && <div className={styles.divider} />}
        </div>
      ))}
    </div>
  );
}
