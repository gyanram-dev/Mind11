export const playerRecommendationPrompt = (player) => `Generate personalized game recommendations for a player with the following profile:\n\nName: ${player.name}\nAge: ${player.age}\nSkills: ${player.skills.join(', ')}\nPreferences: ${player.preferences.join(', ')}\n\nProvide a concise list of 3 recommended game modes.`;

export const questionGenerationPrompt = () => `Create 5 engaging logic or reasoning questions suitable for a brain challenge game. Include each question and the correct answer.`;
