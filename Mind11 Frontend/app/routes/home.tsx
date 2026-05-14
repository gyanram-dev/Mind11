import type { Route } from './+types/home';
import { Link } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Navbar } from '~/components/navbar/navbar';
import { AiCore } from '~/components/ai-core/ai-core';
import { OrbitingCards } from '~/components/orbiting-cards/orbiting-cards';
import { StatsBar } from '~/components/stats-bar/stats-bar';
import { TeamsGrid } from '~/components/teams-grid/teams-grid';
import { Particles } from '~/components/particles/particles';
import { IconArrowRight, IconPlayerPlay, IconBolt } from '@tabler/icons-react';
import styles from './home.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'IPL Mindreader – AI Cricket Intelligence' },
    { name: 'description', content: 'Think of any IPL player. Our AI reads your mind and predicts who you are thinking of.' },
  ];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
} as const;

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  // Parallax transforms for bg layers
  const bgShiftX = useTransform(springX, [-0.5, 0.5], ['-12px', '12px']);
  const bgShiftY = useTransform(springY, [-0.5, 0.5], ['-8px', '8px']);
  const coreMoveX = useTransform(springX, [-0.5, 0.5], ['-8px', '8px']);
  const coreMoveY = useTransform(springY, [-0.5, 0.5], ['-5px', '5px']);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className={styles.page}>
      <Particles />
      <Navbar />

      {/* Parallax deep background */}
      <motion.div className={styles.bgGradient} style={{ x: bgShiftX, y: bgShiftY }} />
      <motion.div className={styles.bgGrid} style={{ x: bgShiftX, y: bgShiftY }} />

      {/* Stadium light bloom */}
      <div className={styles.stadiumBloom} aria-hidden="true" />

      {/* Orbit lines for depth */}
      <div className={styles.orbitLines} aria-hidden="true">
        <div className={styles.orbitLine} />
        <div className={styles.orbitLine} />
        <div className={styles.orbitLine} />
        <div className={styles.orbitLine} />
      </div>

      {/* Animated radial bloom */}
      <motion.div
        className={styles.bgRadial}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light rays from center */}
      <div className={styles.lightRays} aria-hidden="true">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <div key={deg} className={styles.lightRay} style={{ '--ray-angle': `${deg}deg` } as React.CSSProperties} />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* Left: Headline */}
        <motion.div
          className={styles.heroLeft}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.badge} variants={fadeUp}>
            <IconBolt size={12} className={styles.badgeIcon} />
            IPL AI CHALLENGE
          </motion.div>

          <motion.h1 className={styles.headline} variants={fadeUp}>
            <span className={styles.headlineThink}>THINK OF ANY</span>
            <span className={styles.headlineIpl}>IPL PLAYER</span>
          </motion.h1>

          <motion.p className={styles.subtext} variants={fadeUp}>
            Our AI reads your mind and asks the right questions to guess the IPL superstar you are thinking of.
          </motion.p>

          <motion.div className={styles.ctaGroup} variants={fadeUp}>
            <PrimaryButton to="/play">START THE CHALLENGE <IconArrowRight size={18} /></PrimaryButton>
            <SecondaryButton to="/play">
              <div className={styles.playCircle}>
                <IconPlayerPlay size={14} fill="white" />
              </div>
              HOW IT WORKS
            </SecondaryButton>
          </motion.div>

          <motion.div className={styles.trustBadge} variants={fadeUp}>
            <div className={styles.avatarStack}>
              {['#ef4444', '#3b82f6', '#a855f7'].map((c, i) => (
                <div key={i} className={styles.avatar} style={{ background: `radial-gradient(circle, ${c}, ${c}88)`, zIndex: 3 - i }} />
              ))}
              <span className={styles.avatarPlus}>+</span>
            </div>
            <div>
              <div className={styles.trustCount}>50K+</div>
              <div className={styles.trustLabel}>Trusted by 50K+ cricket fans worldwide</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Center: AI Core with subtle parallax */}
        <motion.div className={styles.heroCenter} style={{ x: coreMoveX, y: coreMoveY }}>
          <div className={styles.coreContainer}>
            <AiCore />
            <OrbitingCards />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <motion.section
        className={styles.statsSection}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <StatsBar />
      </motion.section>

      {/* TEAMS SECTION */}
      <motion.section
        className={styles.teamsSection}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <TeamsGrid />
      </motion.section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerFeatures}>
          {['Real-time AI', 'Smart Questions', 'Dynamic Learning', 'High Accuracy', 'Fun & Engaging'].map((f) => (
            <div key={f} className={styles.footerFeature}>
              <span className={styles.footerDot} />
              {f}
            </div>
          ))}
        </div>
        <div className={styles.footerBrand}>
          <span className={styles.footerLogo}>IPL MINDREADER</span>
          <span className={styles.footerTagline}>AI THAT KNOWS CRICKET</span>
        </div>
      </footer>
    </div>
  );
}

// === Premium CTA Buttons ===

function PrimaryButton({ to, children }: { to: string; children: React.ReactNode }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 800);
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link to={to} className={styles.primaryBtn} onClick={handleClick}>
        <span className={styles.btnShine} />
        {children}
        {ripples.map((rp) => (
          <span
            key={rp.id}
            className={styles.btnRipple}
            style={{ left: rp.x, top: rp.y }}
          />
        ))}
      </Link>
    </motion.div>
  );
}

function SecondaryButton({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link to={to} className={styles.secondaryBtn}>
        {children}
      </Link>
    </motion.div>
  );
}
