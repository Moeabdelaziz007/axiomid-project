export type Tier = 'Ghost' | 'Spark' | 'Pulse' | 'Axiom';

export const TIERS = {
  Ghost: 0,
  Spark: 100,
  Pulse: 500,
  Axiom: 1000,
};

export function calculateTier(xp: number): Tier {
  if (xp >= TIERS.Axiom) return 'Axiom';
  if (xp >= TIERS.Pulse) return 'Pulse';
  if (xp >= TIERS.Spark) return 'Spark';
  return 'Ghost';
}

export function getLevelProgress(xp: number, tier: Tier): number {
    let nextXP = 0;
    let currentThreshold = 0;

    switch (tier) {
      case 'Ghost':
        currentThreshold = TIERS.Ghost;
        nextXP = TIERS.Spark;
        break;
      case 'Spark':
        currentThreshold = TIERS.Spark;
        nextXP = TIERS.Pulse;
        break;
      case 'Pulse':
        currentThreshold = TIERS.Pulse;
        nextXP = TIERS.Axiom;
        break;
      case 'Axiom':
        return 100; // Max level
    }

    const range = nextXP - currentThreshold;
    const progress = xp - currentThreshold;
    return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function getNextLevelXP(tier: Tier): number | null {
    switch (tier) {
      case 'Ghost': return TIERS.Spark;
      case 'Spark': return TIERS.Pulse;
      case 'Pulse': return TIERS.Axiom;
      default: return null;
    }
}
