import { Link } from 'react-router';
import { TEAMS } from '~/data/players';
import styles from './teams-grid.module.css';

export function TeamsGrid() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionTitle}>ALL IPL TEAMS</div>
          <div className={styles.sectionSub}>Play with players from all IPL teams</div>
        </div>
        <Link to="/players" className={styles.exploreBtn}>
          EXPLORE PLAYERS
        </Link>
      </div>
      <div className={styles.teamsRow}>
        {TEAMS.map((team) => (
          <Link key={team.id} to={`/players?team=${team.shortName}`} className={styles.teamCard}>
            <div
              className={styles.teamLogo}
              style={{
                '--team-color': team.color,
              } as React.CSSProperties}
            >
              <img src={team.logoImg} alt={team.name} className={styles.teamLogoImg} />
            </div>
            <span className={styles.teamShortName}>{team.shortName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}