import express from "express";
import cors from "cors";

import { recommendPlayers } from "./services/recommendationEngine.js";

const app = express();

app.use(cors());

app.use(express.json());


// HEALTH CHECK

app.get("/", (req, res) => {

    res.json({
        message: "Mind11 Backend Running"
    });
});


// RECOMMENDATION API

app.post("/recommend", (req, res) => {

    try {

        const preferences = req.body;

        const recommendations = recommendPlayers(preferences);

        res.json({
            success: true,
            count: recommendations.length,
            players: recommendations
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Recommendation failed"
        });
    }
});


// SERVER START

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});