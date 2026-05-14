import { recommendPlayers } from "./services/recommendationEngine.js";

const preferences = {

    aggressive: true,

    power_hitter: true,

    role: "Batter"
};

const recommendations = recommendPlayers(preferences);

console.log(recommendations);