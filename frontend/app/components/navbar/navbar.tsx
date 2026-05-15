import { NavLink, Link } from 'react-router';
import { IconPlayerPlay } from '@tabler/icons-react';
import styles from './navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <div className={styles.brandIconWrapper}>
          <img src="/ipl-logo.png" alt="MIND11" className={styles.brandIcon} />
        </div>
        <div className={styles.logoText}>
          <div className={styles.logoTitle}>
            <span className={styles.brandText}>MIND</span>
            <span className={styles.brandAccent}>11</span>
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