import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTier, getLevelProgress, getNextLevelXP, TIERS } from './tiers.ts';

const expect = (actual: any) => ({
    toBe: (expected: any) => assert.equal(actual, expected),
    toBeNull: () => assert.equal(actual, null),
});

describe('Tiers Logic', () => {
    describe('calculateTier', () => {
        test('should return "Ghost" for XP below Spark threshold', () => {
            expect(calculateTier(0)).toBe('Ghost');
            expect(calculateTier(50)).toBe('Ghost');
            expect(calculateTier(99)).toBe('Ghost');
        });

        test('should return "Spark" for XP between Spark and Pulse thresholds', () => {
            expect(calculateTier(100)).toBe('Spark');
            expect(calculateTier(250)).toBe('Spark');
            expect(calculateTier(499)).toBe('Spark');
        });

        test('should return "Pulse" for XP between Pulse and Axiom thresholds', () => {
            expect(calculateTier(500)).toBe('Pulse');
            expect(calculateTier(750)).toBe('Pulse');
            expect(calculateTier(999)).toBe('Pulse');
        });

        test('should return "Axiom" for XP at or above Axiom threshold', () => {
            expect(calculateTier(1000)).toBe('Axiom');
            expect(calculateTier(1500)).toBe('Axiom');
        });

        test('should handle negative XP by returning "Ghost"', () => {
            expect(calculateTier(-10)).toBe('Ghost');
            expect(calculateTier(-1000)).toBe('Ghost');
        });
    });

    describe('getNextLevelXP', () => {
        test('should return Spark threshold for Ghost tier', () => {
            expect(getNextLevelXP('Ghost')).toBe(TIERS.Spark);
        });

        test('should return Pulse threshold for Spark tier', () => {
            expect(getNextLevelXP('Spark')).toBe(TIERS.Pulse);
        });

        test('should return Axiom threshold for Pulse tier', () => {
            expect(getNextLevelXP('Pulse')).toBe(TIERS.Axiom);
        });

        test('should return null for Axiom tier', () => {
            expect(getNextLevelXP('Axiom')).toBeNull();
        });
    });

    describe('getLevelProgress', () => {
        test('should calculate correct progress for Ghost tier (0-100)', () => {
            expect(getLevelProgress(0, 'Ghost')).toBe(0);
            expect(getLevelProgress(50, 'Ghost')).toBe(50);
            expect(getLevelProgress(100, 'Ghost')).toBe(100);
        });

        test('should calculate correct progress for Spark tier (100-500)', () => {
            expect(getLevelProgress(100, 'Spark')).toBe(0);
            expect(getLevelProgress(300, 'Spark')).toBe(50);
            expect(getLevelProgress(500, 'Spark')).toBe(100);
        });

        test('should calculate correct progress for Pulse tier (500-1000)', () => {
            expect(getLevelProgress(500, 'Pulse')).toBe(0);
            expect(getLevelProgress(750, 'Pulse')).toBe(50);
            expect(getLevelProgress(1000, 'Pulse')).toBe(100);
        });

        test('should return 100 for Axiom tier', () => {
            expect(getLevelProgress(1000, 'Axiom')).toBe(100);
            expect(getLevelProgress(1500, 'Axiom')).toBe(100);
        });

        test('should clamp progress between 0 and 100', () => {
            // Below threshold
            expect(getLevelProgress(50, 'Spark')).toBe(0);
            // Above next threshold
            expect(getLevelProgress(600, 'Spark')).toBe(100);
        });
    });
});
