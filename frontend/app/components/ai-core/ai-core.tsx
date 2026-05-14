import styles from './ai-core.module.css';

export function AiCore() {
  return (
    <div className={styles.sceneWrapper}>
      {/* Layer 1: Thin orbit arcs — centered on helmet */}
      <div className={styles.hudArc1} style={{ '--arc-angle': '0deg' } as React.CSSProperties} />
      <div className={styles.hudArc2} style={{ '--arc-angle': '25deg' } as React.CSSProperties} />
      <div className={styles.hudArc3} style={{ '--arc-angle': '-20deg' } as React.CSSProperties} />
      <div className={styles.hudArc4} style={{ '--arc-angle': '10deg' } as React.CSSProperties} />

      {/* Layer 2: Subtle particles — centered on helmet */}
      <div className={styles.particleField}>
        {[
          { x: '80px', y: '-120px', d: '0s', s: 2 },
          { x: '-90px', y: '-80px', d: '1.5s', s: 1.5 },
          { x: '100px', y: '60px', d: '0.8s', s: 2 },
          { x: '-80px', y: '90px', d: '2s', s: 1.5 },
          { x: '140px', y: '0px', d: '0.4s', s: 2 },
          { x: '-130px', y: '30px', d: '1.2s', s: 2.5 },
          { x: '30px', y: '-140px', d: '1.8s', s: 1.5 },
          { x: '-40px', y: '130px', d: '0.6s', s: 2 },
        ].map((p, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: p.x,
              top: p.y,
              '--delay': p.d,
              '--size': `${p.s}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Layer 3: Platform rings */}
      <div className={styles.platformGroup}>
        <div className={styles.platformBase} />
        <div className={styles.platformRing1} />
        <div className={styles.platformRing2} />
        <div className={styles.platformRing3} />
      </div>

      {/* Layer 4: Helmet */}
      <div className={styles.helmetGroup}>
        <div className={styles.helmetRimGlow} />
        <img src="/Helmet.png" alt="IPL Helmet" className={styles.helmetImg} />
        <div className={styles.helmetShine} />
      </div>

      {/* Layer 5: Faint ambient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
    </div>
  );
}