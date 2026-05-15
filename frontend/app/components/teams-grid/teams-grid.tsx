import { Link } from 'react-router';
import { TEAMS } from '~/data/players';
import styles from './teams-grid.module.css';

export function TeamsGrid() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionTitle}>ALL IPL TEAMS</div>
          <div className={styles.sectionSub}>Play and challenge players from all teams</div>
        </div>
        <Link to="/players" className={styles.exploreBtn}>
          EXPLORE PLAYERS
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
      <div className={styles.teamsRow}>
        {TEAMS.map((team) => (
          <Link 
            key={team.id} 
            to={`/players?team=${team.shortName}`} 
            className={styles.teamCard}
            data-team={team.shortName}
            style={{ '--team-color': team.color } as React.CSSProperties}
          >
            <div className={styles.teamLogo}>
              <img src={team.logoImg} alt={team.name} className={styles.teamLogoImg} />
            </div>
            <span className={styles.teamShortName}>{team.shortName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}