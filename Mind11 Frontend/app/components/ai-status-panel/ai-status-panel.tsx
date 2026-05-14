import styles from './ai-status-panel.module.css';
import { IconBrain, IconDatabase, IconTarget, IconUsers, IconActivity } from '@tabler/icons-react';

const STATUS_ITEMS = [
  { label: 'Neural Scan Active', icon: IconBrain, color: '#00D1FF', delay: '0s', value: 78 },
  { label: 'IPL Database Synced', icon: IconDatabase, color: '#F5B100', delay: '0.2s', value: 100 },
  { label: 'Prediction Accuracy', icon: IconTarget, color: '#1677FF', delay: '0.4s', value: 91 },
  { label: 'Active Users Online', icon: IconUsers, color: '#7B61FF', delay: '0.6s', value: 85 },
  { label: 'Live Match Engine', icon: IconActivity, color: '#22C55E', delay: '0.8s', value: 100 },
];

export function AiStatusPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerDot} />
        <span>AI STATUS</span>
      </div>

      <div className={styles.statusList}>
        {STATUS_ITEMS.map((item) => (
          <div key={item.label} className={styles.statusItem} style={{ '--item-color': item.color, '--item-delay': item.delay } as React.CSSProperties}>
            <div className={styles.statusIcon}>
              <item.icon size={14} color={item.color} />
            </div>
            <div className={styles.statusContent}>
              <div className={styles.statusTop}>
                <span className={styles.statusLabel}>{item.label}</span>
                <span className={styles.statusValue} style={{ color: item.color }}>{item.value}%</span>
              </div>
              <div className={styles.scanBar}>
                <div className={styles.scanFill} style={{ width: `${item.value}%` }} />
              </div>
            </div>
            <div className={styles.statusDot} />
          </div>
        ))}
      </div>

      <div className={styles.panelFooter}>
        <div className={styles.activeIndicator}>
          <span className={styles.activeDot} />
          <span>ONLINE</span>
        </div>
        <span className={styles.version}>v3.14.AI</span>
      </div>
    </div>
  );
}