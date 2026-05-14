import { NavLink, Link } from 'react-router';
import { IconPlayerPlay } from '@tabler/icons-react';
import styles from './navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/ipl-logo.png" alt="IPL Mindreader" className={styles.logoImg} />
        <div className={styles.logoText}>
          <div className={styles.logoTitle}>
            <span className={styles.logoIpl}>IPL</span>
            <span className={styles.logoMind}>MindReader</span>
          </div>
          <span className={styles.logoSub}>AI THAT KNOWS CRICKET</span>
        </div>
      </Link>

      <div className={styles.navLinks}>
        <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          HOME
        </NavLink>
        <NavLink to="/play" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          PLAY
        </NavLink>
        <NavLink to="/players" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          PLAYERS
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          LEADERBOARD
        </NavLink>
      </div>

      <div className={styles.navActions}>
        <button className={styles.signIn}>Sign In</button>
        <Link to="/play" className={styles.startBtn}>
          <IconPlayerPlay size={16} />
          START GAME
        </Link>
      </div>
    </nav>
  );
}