import fs from "fs";
import rawPlayers from "../data/rawPlayers.json" with { type: "json" };

function deriveRole(player) {

    const runs = Number(player.Runs || 0);
    const wickets = Number(player.Wickets || 0);

    if (runs > 1000 && wickets > 30) {
        return "All-Rounder";
    }

    if (wickets > 50) {
        return "Bowler";
    }

    return "Batter";
}

function isAggressive(player) {

    const strikeRate = Number(player.StrikeRate || 0);

    return strikeRate > 145;
}

function isPowerHitter(player) {

    const sixes = Number(player.Sixes || 0);

    return sixes > 80;
}

function isFinisher(player) {

    const strikeRate = Number(player.StrikeRate || 0);
    const sixes = Number(player.Sixes || 0);

    return strikeRate > 150 && sixes > 50;
}

function isFastBowler(player) {

    const wickets = Number(player.Wickets || 0);
    const economy = Number(player.Economy || 0);

    return wickets > 40 && economy > 7.5;
}

function isSpinner(player) {

    const wickets = Number(player.Wickets || 0);
    const economy = Number(player.Economy || 0);

    return wickets > 40 && economy <= 7.5;
}

function isAllRounder(player) {

    const runs = Number(player.Runs || 0);
    const wickets = Number(player.Wickets || 0);

    return runs > 1000 && wickets > 20;
}

function generatePlayer(player) {

    return {

        name: player.PlayerName,

        teams: player.Teams
            ? player.Teams.split(",").map(team => team.trim())
            : [],

        span: player.Span,

        matches: Number(player.Matches || 0),

        innings: Number(player.Innings || 0),

        runs: Number(player.Runs || 0),

        wickets: Number(player.Wickets || 0),

        strikeRate: Number(player.StrikeRate || 0),

        economy: Number(player.Economy || 0),

        battingAverage: Number(player.BattingAverage || 0),

        bowlingAverage: Number(player.BowlingAverage || 0),

        sixes: Number(player.Sixes || 0),

        fours: Number(player.Fours || 0),

        role: deriveRole(player),

        aggressive: isAggressive(player),

        power_hitter: isPowerHitter(player),

        finisher: isFinisher(player),

        fast_bowler: isFastBowler(player),

        spinner: isSpinner(player),

        all_rounder: isAllRounder(player)
    };
}

const enrichedPlayers = rawPlayers.map(generatePlayer);

fs.writeFileSync(
    "./data/enrichedPlayers.json",
    JSON.stringify(enrichedPlayers, null, 2)
);

console.log("Enriched dataset generated successfully.");