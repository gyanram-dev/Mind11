import type { Route } from './+types/players';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Navbar } from '~/components/navbar/navbar';
import { Particles } from '~/components/particles/particles';
import { PlayerCard } from '~/components/player-card/player-card';
import { PLAYERS, TEAMS } from '~/data/players';
import { IconSearch, IconX } from '@tabler/icons-react';
import styles from './players.module.css';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'IPL Mindreader – Player Vault' }];
}

const ROLES = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'] as const;

export default function Players() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || 'All');
  const [selectedRole, setSelectedRole] = useState('All');

  const filtered = PLAYERS.filter((p) => {
    const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = selectedTeam === 'All' || p.team === selectedTeam;
    const matchesRole = selectedRole === 'All' || p.role === selectedRole;
    return matchesSearch && matchesTeam && matchesRole;
  });

  return (
    <div className={styles.page}>
      <Particles />
      <Navbar />
      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>PLAYER VAULT</div>
          <h1 className={styles.title}>IPL PLAYER DATABASE</h1>
          <p className={styles.subtitle}>Explore the complete roster of IPL legends in our AI’s intelligence database</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <IconSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')}>
                <IconX size={14} />
              </button>
            )}
          </div>

          <div className={styles.roleFilters}>
            {ROLES.map((role) => (
              <button
                key={role}
                className={`${styles.filterBtn} ${selectedRole === role ? styles.active : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Team pills */}
        <div className={styles.teamPills}>
          <button
            className={`${styles.teamPill} ${selectedTeam === 'All' ? styles.teamPillActive : ''}`}
            onClick={() => setSelectedTeam('All')}
          >
            All Teams
          </button>
          {TEAMS.map((team) => (
            <button
              key={team.id}
              className={`${styles.teamPill} ${selectedTeam === team.shortName ? styles.teamPillActive : ''}`}
              onClick={() => setSelectedTeam(selectedTeam === team.shortName ? 'All' : team.shortName)}
              style={{
                '--pill-color': team.color,
              } as React.CSSProperties}
            >
              <span>{team.name}</span>
              {team.shortName}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className={styles.resultsCount}>
          <span className={styles.count}>{filtered.length}</span> players found
        </div>

        {/* Player Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((player) => (
              <div key={player.name} className={styles.gridItem}>
                <PlayerCard player={player} />
                <div className={styles.cardDetails}>
                  <div className={styles.detailStat}>
                    <span className={styles.detailLabel}>Matches</span>
                    <span className={styles.detailValue}>{player.matches}</span>
                  </div>
                  {player.runs > 0 && (
                    <div className={styles.detailStat}>
                      <span className={styles.detailLabel}>Runs</span>
                      <span className={styles.detailValue}>{player.runs.toLocaleString()}</span>
                    </div>
                  )}
                  {player.wickets > 0 && (
                    <div className={styles.detailStat}>
                      <span className={styles.detailLabel}>Wickets</span>
                      <span className={styles.detailValue}>{player.wickets}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <div>No players match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}
