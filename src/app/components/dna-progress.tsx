"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDNA, type DNALevel, LEVEL_THRESHOLDS } from "../context/dna-context";
import { useState, useEffect } from "react";

/* ============================================
   DNA PROGRESS BAR
   Visual "DNA Strand" progress indicator
   ============================================ */

const LEVEL_CONFIG: Record<
    DNALevel,
    { label: string; color: string; glowColor: string; emoji: string }
> = {
    ghost: {
        label: "Ghost",
        color: "#4a4a4a",
        glowColor: "rgba(74, 74, 74, 0.4)",
        emoji: "👻",
    },
    spark: {
        label: "Spark",
        color: "#00ff41",
        glowColor: "rgba(0, 255, 65, 0.4)",
        emoji: "✨",
    },
    pulse: {
        label: "Pulse",
        color: "#00d4ff",
        glowColor: "rgba(0, 212, 255, 0.4)",
        emoji: "⚡",
    },
    axiom: {
        label: "Axiom",
        color: "#a855f7",
        glowColor: "rgba(168, 85, 247, 0.4)",
        emoji: "💎",
    },
};

const MILESTONES: { xp: number; level: DNALevel }[] = [
    { xp: 0, level: "ghost" },
    { xp: 10, level: "spark" },
    { xp: 30, level: "pulse" },
    { xp: 70, level: "axiom" },
];

export function DNAProgress() {
    const { state, levelProgress, xpToNextLevel } = useDNA();
    const config = LEVEL_CONFIG[state.level];
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [prevLevel, setPrevLevel] = useState<DNALevel>(state.level);

    // Detect level-up
    useEffect(() => {
        if (state.level !== prevLevel && state.level !== "ghost") {
            setShowLevelUp(true);
            const timer = setTimeout(() => setShowLevelUp(false), 2500);
            setPrevLevel(state.level);
            return () => clearTimeout(timer);
        }
        setPrevLevel(state.level);
    }, [state.level, prevLevel]);

    // Max XP for the full bar visualization
    const maxXP = LEVEL_THRESHOLDS.axiom + 30; // Show a bit beyond Axiom
    const fillPercent = Math.min(100, (state.xp / maxXP) * 100);

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Level-up celebration */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="text-center mb-4"
                    >
                        <motion.span
                            className="text-2xl font-bold"
                            style={{ color: config.color }}
                            animate={{
                                textShadow: [
                                    `0 0 10px ${config.glowColor}`,
                                    `0 0 30px ${config.glowColor}`,
                                    `0 0 10px ${config.glowColor}`,
                                ],
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {config.emoji} LEVEL UP! {config.label.toUpperCase()} {config.emoji}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* XP display */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <motion.span
                        className="text-2xl font-bold font-mono"
                        style={{ color: config.color }}
                        key={state.xp}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {state.xp}
                    </motion.span>
                    <span className="text-gray-500 text-sm">XP</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">
                        {config.emoji} {config.label}
                    </span>
                    {xpToNextLevel !== null && (
                        <span className="text-xs text-gray-700 font-mono">
                            ({xpToNextLevel} to next)
                        </span>
                    )}
                </div>
            </div>

            {/* Progress bar track */}
            <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                {/* Animated fill */}
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background:
                            state.level === "axiom"
                                ? "linear-gradient(90deg, #a855f7, #00d4ff, #00ff41, #fbbf24, #a855f7)"
                                : `linear-gradient(90deg, ${config.color}88, ${config.color})`,
                        boxShadow: `0 0 12px ${config.glowColor}`,
                        backgroundSize: state.level === "axiom" ? "200% 100%" : "100% 100%",
                    }}
                    initial={{ width: "0%" }}
                    animate={{
                        width: `${fillPercent}%`,
                        backgroundPosition:
                            state.level === "axiom" ? ["0% 0%", "200% 0%"] : undefined,
                    }}
                    transition={{
                        width: { type: "spring", stiffness: 100, damping: 15 },
                        backgroundPosition: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                />

                {/* Milestone markers */}
                {MILESTONES.slice(1).map((m) => {
                    const pos = (m.xp / maxXP) * 100;
                    const reached = state.xp >= m.xp;
                    return (
                        <div
                            key={m.level}
                            className="absolute top-0 bottom-0 w-px"
                            style={{
                                left: `${pos}%`,
                                backgroundColor: reached
                                    ? LEVEL_CONFIG[m.level].color
                                    : "#333",
                            }}
                        >
                            <div
                                className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono"
                                style={{
                                    color: reached ? LEVEL_CONFIG[m.level].color : "#555",
                                }}
                            >
                                {m.xp}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stamp count */}
            <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-700 font-mono">
                    {state.stamps.length} stamps connected
                </span>
                <span className="text-[10px] text-gray-700 font-mono">
                    {state.level === "axiom"
                        ? "MAX LEVEL"
                        : `${Math.round(levelProgress)}% to ${state.level === "ghost"
                            ? "Spark"
                            : state.level === "spark"
                                ? "Pulse"
                                : "Axiom"
                        }`}
                </span>
            </div>
        </div>
    );
}
