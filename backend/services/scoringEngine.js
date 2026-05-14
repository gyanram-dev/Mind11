export function scorePlayerActivity(activityData = {}) {
  const baseScore = 50;
  const bonus = (activityData.correctAnswers || 0) * 5;
  const speedBonus = Math.max(0, 20 - (activityData.time || 0));

  return baseScore + bonus + speedBonus;
}
