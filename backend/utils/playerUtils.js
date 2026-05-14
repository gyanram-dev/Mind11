export function findPlayerById(players, playerId) {
  return players.find((player) => player.id === playerId);
}

export function enrichPlayerProfile(player) {
  if (!player) return null;

  return {
    ...player,
    fullName: player.name,
    skillCount: player.skills?.length ?? 0,
    preferenceCount: player.preferences?.length ?? 0
  };
}
