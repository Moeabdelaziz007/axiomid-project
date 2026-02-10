"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

/* ============================================
   TYPES & CONSTANTS
   ============================================ */
export type DNALevel = "ghost" | "spark" | "pulse" | "axiom";

export interface DNAStamp {
    id: string;
    name: string;
    xp: number;
    connectedAt: number; // timestamp
    verified: boolean;
}

export interface DNAState {
    xp: number;
    level: DNALevel;
    stamps: DNAStamp[];
    behaviorScore: number;
    createdAt: number;
    lastUpdated: number;
}

const LEVEL_THRESHOLDS: Record<DNALevel, number> = {
    ghost: 0,
    spark: 10,
    pulse: 30,
    axiom: 70,
};

const STORAGE_KEY = "axiomid_dna";

/* ============================================
   HELPER FUNCTIONS
   ============================================ */
function calculateLevel(xp: number): DNALevel {
    if (xp >= LEVEL_THRESHOLDS.axiom) return "axiom";
    if (xp >= LEVEL_THRESHOLDS.pulse) return "pulse";
    if (xp >= LEVEL_THRESHOLDS.spark) return "spark";
    return "ghost";
}

function getNextLevelXP(level: DNALevel): number | null {
    switch (level) {
        case "ghost":
            return LEVEL_THRESHOLDS.spark;
        case "spark":
            return LEVEL_THRESHOLDS.pulse;
        case "pulse":
            return LEVEL_THRESHOLDS.axiom;
        case "axiom":
            return null; // max level
    }
}

function getLevelProgress(xp: number, level: DNALevel): number {
    const nextXP = getNextLevelXP(level);
    if (nextXP === null) return 100; // max level = 100%

    const currentThreshold = LEVEL_THRESHOLDS[level];
    const range = nextXP - currentThreshold;
    const progress = xp - currentThreshold;
    return Math.min(100, Math.max(0, (progress / range) * 100));
}

function createDefaultState(): DNAState {
    return {
        xp: 0,
        level: "ghost",
        stamps: [],
        behaviorScore: 0,
        createdAt: Date.now(),
        lastUpdated: Date.now(),
    };
}

/* ============================================
   CONTEXT DEFINITION
   ============================================ */
interface DNAContextValue {
    state: DNAState;
    // Computed values
    levelProgress: number;
    nextLevelXP: number | null;
    xpToNextLevel: number | null;
    // Actions
    addStamp: (id: string, name: string, xp: number) => void;
    removeStamp: (id: string) => void;
    updateBehaviorScore: (score: number) => void;
    resetDNA: () => void;
    hasStamp: (id: string) => boolean;
}

const DNAContext = createContext<DNAContextValue | null>(null);

/* ============================================
   PROVIDER COMPONENT
   ============================================ */
export function DNAProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DNAState>(createDefaultState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as DNAState;
                // Recalculate level in case thresholds changed
                parsed.level = calculateLevel(parsed.xp);
                setState(parsed);
            }
        } catch (e) {
            console.warn("[AxiomID] Failed to hydrate DNA state:", e);
        }
        setIsHydrated(true);
    }, []);

    // Persist to localStorage on state changes (after hydration)
    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn("[AxiomID] Failed to persist DNA state:", e);
        }
    }, [state, isHydrated]);

    // --- Actions ---
    const addStamp = useCallback(
        (id: string, name: string, xp: number) => {
            setState((prev) => {
                // Prevent duplicate stamps
                if (prev.stamps.some((s) => s.id === id)) return prev;

                const newStamp: DNAStamp = {
                    id,
                    name,
                    xp,
                    connectedAt: Date.now(),
                    verified: true,
                };

                const newXP = prev.xp + xp;
                const newLevel = calculateLevel(newXP);

                return {
                    ...prev,
                    xp: newXP,
                    level: newLevel,
                    stamps: [...prev.stamps, newStamp],
                    lastUpdated: Date.now(),
                };
            });
        },
        []
    );

    const removeStamp = useCallback((id: string) => {
        setState((prev) => {
            const stamp = prev.stamps.find((s) => s.id === id);
            if (!stamp) return prev;

            const newXP = Math.max(0, prev.xp - stamp.xp);
            return {
                ...prev,
                xp: newXP,
                level: calculateLevel(newXP),
                stamps: prev.stamps.filter((s) => s.id !== id),
                lastUpdated: Date.now(),
            };
        });
    }, []);

    const updateBehaviorScore = useCallback((score: number) => {
        setState((prev) => ({
            ...prev,
            behaviorScore: Math.round(Math.min(100, Math.max(0, score))),
            lastUpdated: Date.now(),
        }));
    }, []);

    const resetDNA = useCallback(() => {
        const fresh = createDefaultState();
        setState(fresh);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const hasStamp = useCallback(
        (id: string) => state.stamps.some((s) => s.id === id),
        [state.stamps]
    );

    // --- Computed values ---
    const levelProgress = getLevelProgress(state.xp, state.level);
    const nextLevelXP = getNextLevelXP(state.level);
    const xpToNextLevel = nextLevelXP !== null ? nextLevelXP - state.xp : null;

    const value: DNAContextValue = {
        state,
        levelProgress,
        nextLevelXP,
        xpToNextLevel,
        addStamp,
        removeStamp,
        updateBehaviorScore,
        resetDNA,
        hasStamp,
    };

    // Prevent flash of default state
    if (!isHydrated) {
        return null;
    }

    return <DNAContext.Provider value={value}>{children}</DNAContext.Provider>;
}

/* ============================================
   HOOK
   ============================================ */
export function useDNA(): DNAContextValue {
    const ctx = useContext(DNAContext);
    if (!ctx) {
        throw new Error("useDNA must be used within a <DNAProvider>");
    }
    return ctx;
}

export { LEVEL_THRESHOLDS, calculateLevel, getNextLevelXP, getLevelProgress };
