import enrichedPlayers from "../data/enrichedPlayers.json" with { type: "json" };

function calculateScore(player, preferences) {

    let score = 0;

    // ROLE MATCH
    if (
        preferences.role &&
        player.role.toLowerCase() === preferences.role.toLowerCase()
    ) {
        score += 30;
    }

    // AGGRESSIVE BATTER SCORING
    if (preferences.aggressive) {

        score += player.strikeRate * 0.35;

        score += player.sixes * 0.3;

        if (player.aggressive) {
            score += 20;
        }
    }

    // POWER HITTER SCORING
    if (preferences.power_hitter) {

        score += (player.sixes / player.matches) * 25;

        score += player.strikeRate * 0.3;

        if (player.power_hitter) {
            score += 20;
        }
    }

    // FINISHER SCORING
    if (preferences.finisher) {

        score += player.strikeRate * 0.2;

        score += player.battingAverage * 0.5;

        if (player.finisher) {
            score += 20;
        }
    }

    // FAST BOWLER SCORING
    if (preferences.fast_bowler) {

        score += player.wickets * 0.7;

        score -= player.economy * 2;

        if (player.fast_bowler) {
            score += 20;
        }
    }

    // SPINNER SCORING
    if (preferences.spinner) {

        score += player.wickets * 0.6;

        score -= player.economy * 1.5;

        if (player.spinner) {
            score += 20;
        }
    }

    // ALL-ROUNDER BONUS
    if (player.all_rounder) {
        score += 15;
    }

    // EXPERIENCE BONUS
    score += player.matches * 0.05;

    // CONSISTENCY BONUS
    score += player.battingAverage * 0.2;

            // EXPERIENCE NORMALIZATION

        if (player.matches < 20) {
            score *= 0.55;
        }

        else if (player.matches < 50) {
            score *= 0.75;
        }
    return Number(score.toFixed(2));
}

function recommendPlayers(preferences) {

    const scoredPlayers = enrichedPlayers.map(player => {

        const score = calculateScore(player, preferences);

        return {
            ...player,
            recommendationScore: score
        };
    });

    scoredPlayers.sort(
        (a, b) => b.recommendationScore - a.recommendationScore
    );

    return scoredPlayers.slice(0, 10);
}

export { recommendPlayers };