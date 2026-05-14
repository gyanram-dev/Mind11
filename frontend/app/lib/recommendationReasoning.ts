import type { Player } from '~/data/players';

interface ReasoningContext {
  attributes: Player['attributes'];
  role: Player['role'];
  matches: number;
  runs: number;
  wickets: number;
  orangeCap: boolean;
  purpleCap: boolean;
  captainExperience: boolean;
}

type AttributeKey = 'aggressive' | 'powerHitter' | 'finisher' | 'spinner' | 'fastBowler';

interface ReasoningTemplate {
  priority: number;
  generate: (ctx: ReasoningContext, prefs: AttributeKey[]) => string;
}

const templates: ReasoningTemplate[] = [
  {
    priority: 1,
    generate: (ctx, prefs) => {
      if (prefs.includes('powerHitter') && ctx.attributes.powerHitter) {
        const efficiency = ctx.runs > 3000 ? 'exceptional' : ctx.runs > 1500 ? 'strong' : 'competitive';
        return `Power hitter profile detected with ${efficiency} six-hitting efficiency.`;
      }
      return '';
    },
  },
  {
    priority: 2,
    generate: (ctx, prefs) => {
      if (prefs.includes('aggressive') && ctx.attributes.aggressive) {
        return `Selected due to elite strike rate and explosive finishing ability.`;
      }
      return '';
    },
  },
  {
    priority: 3,
    generate: (ctx, prefs) => {
      if (prefs.includes('finisher') && ctx.attributes.finisher) {
        const experience = ctx.matches > 100 ? 'extensive match' : 'growing';
        return `Finisher attribute confirmed with ${experience} experience and high-pressure execution.`;
      }
      return '';
    },
  },
  {
    priority: 4,
    generate: (ctx, prefs) => {
      if (ctx.role === 'All-rounder' && ctx.wickets > 50 && ctx.runs > 1000) {
        return `High-impact all-rounder with ${ctx.wickets}+ wickets and ${ctx.runs}+ runs balance.`;
      }
      return '';
    },
  },
  {
    priority: 5,
    generate: (ctx, prefs) => {
      if (prefs.includes('fastBowler') && ctx.attributes.fastBowler) {
        const economy = ctx.matches > 50 ? 'proven' : 'developing';
        return `Fast bowler profile with ${economy} death-over consistency and wicket-taking ability.`;
      }
      return '';
    },
  },
  {
    priority: 6,
    generate: (ctx, prefs) => {
      if (prefs.includes('spinner') && ctx.attributes.spinner) {
        const wickets = ctx.wickets > 80 ? 'elite' : ctx.wickets > 30 ? 'consistent' : 'emerging';
        return `${wickets}-class spin option with strategic wicket-taking metrics.`;
      }
      return '';
    },
  },
  {
    priority: 7,
    generate: (ctx) => {
      if (ctx.captainExperience) {
        return `Leadership profile detected with captaincy experience and tactical awareness.`;
      }
      return '';
    },
  },
  {
    priority: 8,
    generate: (ctx) => {
      if (ctx.orangeCap) {
        return `Orange Cap holder — elite run-scoring consistency in tournament history.`;
      }
      return '';
    },
  },
  {
    priority: 9,
    generate: (ctx) => {
      if (ctx.purpleCap) {
        return `Purple Cap holder — top wicket-taker designation with economic spell metrics.`;
      }
      return '';
    },
  },
  {
    priority: 10,
    generate: (ctx) => {
      if (ctx.role === 'Batsman' && ctx.runs > 4000) {
        return `Elite run accumulator with ${ctx.matches}+ matches and proven consistency.`;
      }
      return '';
    },
  },
  {
    priority: 11,
    generate: (ctx) => {
      if (ctx.role === 'Batsman' && ctx.runs > 2000 && ctx.matches < 100) {
        return `Explosive batting potential with impressive strike rate metrics.`;
      }
      return '';
    },
  },
  {
    priority: 12,
    generate: (ctx) => {
      if (ctx.role === 'Bowler' && ctx.wickets > 100) {
        return `Veteran strike bowler with 100+ wickets and match-winning spells.`;
      }
      return '';
    },
  },
  {
    priority: 13,
    generate: (ctx) => {
      if (ctx.role === 'Wicket-keeper' && ctx.runs > 2500) {
        return `Wicket-keeper batsman with ${ctx.runs}+ runs and behind-stumps reliability.`;
      }
      return '';
    },
  },
  {
    priority: 14,
    generate: (ctx) => {
      if (ctx.matches > 150) {
        return `Experience-backed profile with ${ctx.matches}+ matches in high-pressure scenarios.`;
      }
      return '';
    },
  },
  {
    priority: 15,
    generate: (ctx) => {
      if (ctx.role === 'All-rounder' && ctx.wickets > 30 && ctx.runs > 500) {
        return `Balanced all-rounder profile with dual match-impact capabilities.`;
      }
      return '';
    },
  },
  {
    priority: 16,
    generate: (ctx) => {
      if (ctx.role === 'Bowler' && ctx.wickets > 50 && ctx.wickets < 100) {
        return `Reliable wicket-taking option with death-over specialization.`;
      }
      return '';
    },
  },
  {
    priority: 17,
    generate: (ctx) => {
      if (ctx.matches > 80 && ctx.matches < 150) {
        return `Seasoned campaigner with optimal blend of experience and peak performance window.`;
      }
      return '';
    },
  },
  {
    priority: 18,
    generate: (ctx) => {
      return `Recommended because of balanced profile and consistent tournament contributions.`;
    },
  },
];

function extractActivePreferences(attributes: Player['attributes']): AttributeKey[] {
  const prefs: AttributeKey[] = [];
  
  if (attributes.aggressive) prefs.push('aggressive');
  if (attributes.powerHitter) prefs.push('powerHitter');
  if (attributes.finisher) prefs.push('finisher');
  if (attributes.spinner) prefs.push('spinner');
  if (attributes.fastBowler) prefs.push('fastBowler');
  
  return prefs;
}

export function generateRecommendationReasoning(player: Player, prefs?: AttributeKey[]): string {
  const activePrefs = prefs || extractActivePreferences(player.attributes);
  
  const ctx: ReasoningContext = {
    attributes: player.attributes,
    role: player.role,
    matches: player.matches,
    runs: player.runs,
    wickets: player.wickets,
    orangeCap: player.orangeCap,
    purpleCap: player.purpleCap,
    captainExperience: player.captainExperience,
  };

  for (const template of templates) {
    const result = template.generate(ctx, activePrefs);
    if (result) {
      return result;
    }
  }

  return templates[templates.length - 1].generate(ctx, activePrefs);
}

export function generateReasoningWithScore(player: Player, score: number): string {
  const baseReasoning = generateRecommendationReasoning(player);
  
  if (score >= 95) {
    return `Perfect match (${score}% compatibility). ${baseReasoning}`;
  } else if (score >= 85) {
    return `High affinity (${score}% match). ${baseReasoning}`;
  } else if (score >= 70) {
    return baseReasoning;
  }
  
  return baseReasoning;
}

export type { AttributeKey, ReasoningContext };
export default generateRecommendationReasoning;