"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ============================================
   BEHAVIORAL BIOMETRICS HOOK
   Ghost Tier Security — Anti-Bot Detection
   ============================================
   
   Analyzes mouse movement patterns and click
   timing to distinguish humans from bots.
   
   Humans: Irregular velocity, curved paths, jittery
   Bots:   Constant velocity, straight lines, precise
   
   Output: behaviorScore (0-100)
     - 0-40:  Likely bot (too perfect)
     - 40-85: Likely human (messy & organic)
     - 85+:   Suspicious (too jittery, could be spoof)
   ============================================ */

interface MouseSample {
    x: number;
    y: number;
    t: number;
    velocity: number;
}

interface BehaviorMetrics {
    velocityVariance: number;    // How varied mouse speeds are (humans are varied)
    directionChanges: number;    // How often direction changes (humans zigzag)
    avgClickInterval: number;    // Time between clicks in ms
    clickIntervalVariance: number; // Variance in click timing
    scrollJitter: number;       // How erratic scrolling is
    sampleCount: number;        // Total samples collected
}

const MAX_SAMPLES = 100;
const SAMPLE_INTERVAL = 50; // ms between mouse samples

function calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function computeBehaviorScore(metrics: BehaviorMetrics): number {
    if (metrics.sampleCount < 10) return 50; // Not enough data yet

    // Factor 1: Velocity variance (humans = high, bots = low)
    // Normalize: 0-5000 range
    const velScore = Math.min(100, (metrics.velocityVariance / 5000) * 100);

    // Factor 2: Direction changes (humans change direction often)
    // Normalize: expect 20-60% of samples to be direction changes
    const dirRatio = metrics.directionChanges / Math.max(1, metrics.sampleCount);
    const dirScore = Math.min(100, dirRatio * 300); // 33% changes = 100

    // Factor 3: Click timing variance (humans = irregular, bots = metronomic)
    const clickScore =
        metrics.avgClickInterval > 0
            ? Math.min(100, (metrics.clickIntervalVariance / 50000) * 100)
            : 50; // No clicks yet, neutral

    // Factor 4: Scroll jitter (humans scroll imprecisely)
    const scrollScore = Math.min(100, metrics.scrollJitter * 10);

    // Weighted average — velocity and direction are strongest signals
    const raw =
        velScore * 0.35 +
        dirScore * 0.30 +
        clickScore * 0.20 +
        scrollScore * 0.15;

    // Clamp to 0-100
    return Math.round(Math.min(100, Math.max(0, raw)));
}

export function useBehavior() {
    const mouseSamples = useRef<MouseSample[]>([]);
    const clickTimestamps = useRef<number[]>([]);
    const scrollDeltas = useRef<number[]>([]);
    const lastSampleTime = useRef(0);
    const lastDirection = useRef<{ dx: number; dy: number } | null>(null);
    const directionChanges = useRef(0);

    const [score, setScore] = useState(50);
    const [isReady, setIsReady] = useState(false);

    // Mouse move handler — samples at fixed intervals
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const now = Date.now();
        if (now - lastSampleTime.current < SAMPLE_INTERVAL) return;
        lastSampleTime.current = now;

        const samples = mouseSamples.current;
        const prevSample = samples[samples.length - 1];

        let velocity = 0;
        if (prevSample) {
            const dx = e.clientX - prevSample.x;
            const dy = e.clientY - prevSample.y;
            const dt = now - prevSample.t;
            velocity = Math.sqrt(dx * dx + dy * dy) / Math.max(1, dt);

            // Track direction changes
            const currentDir = { dx: Math.sign(dx), dy: Math.sign(dy) };
            if (
                lastDirection.current &&
                (currentDir.dx !== lastDirection.current.dx ||
                    currentDir.dy !== lastDirection.current.dy)
            ) {
                directionChanges.current++;
            }
            lastDirection.current = currentDir;
        }

        const sample: MouseSample = {
            x: e.clientX,
            y: e.clientY,
            t: now,
            velocity,
        };

        samples.push(sample);
        if (samples.length > MAX_SAMPLES) {
            samples.shift();
        }
    }, []);

    // Click handler
    const handleClick = useCallback(() => {
        clickTimestamps.current.push(Date.now());
        if (clickTimestamps.current.length > 20) {
            clickTimestamps.current.shift();
        }
    }, []);

    // Scroll handler
    const handleScroll = useCallback((e: WheelEvent) => {
        scrollDeltas.current.push(Math.abs(e.deltaY));
        if (scrollDeltas.current.length > 20) {
            scrollDeltas.current.shift();
        }
    }, []);

    // Periodic score computation
    useEffect(() => {
        const interval = setInterval(() => {
            const samples = mouseSamples.current;
            if (samples.length < 5) return;

            // Compute velocity variance
            const velocities = samples.map((s) => s.velocity).filter((v) => v > 0);
            const velocityVariance = calculateVariance(velocities);

            // Compute click interval stats
            const clicks = clickTimestamps.current;
            let avgClickInterval = 0;
            let clickIntervalVariance = 0;
            if (clicks.length >= 2) {
                const intervals: number[] = [];
                for (let i = 1; i < clicks.length; i++) {
                    intervals.push(clicks[i] - clicks[i - 1]);
                }
                avgClickInterval =
                    intervals.reduce((a, b) => a + b, 0) / intervals.length;
                clickIntervalVariance = calculateVariance(intervals);
            }

            // Compute scroll jitter
            const scrollJitter = calculateVariance(scrollDeltas.current);

            const metrics: BehaviorMetrics = {
                velocityVariance,
                directionChanges: directionChanges.current,
                avgClickInterval,
                clickIntervalVariance,
                scrollJitter,
                sampleCount: samples.length,
            };

            const newScore = computeBehaviorScore(metrics);
            setScore(newScore);

            if (samples.length >= 20 && !isReady) {
                setIsReady(true);
            }
        }, 2000); // Recompute every 2 seconds

        return () => clearInterval(interval);
    }, [isReady]);

    // Attach event listeners
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [handleMouseMove, handleClick, handleScroll]);

    return {
        /** Behavior score: 0-100. Humans typically score 40-85. */
        score,
        /** Whether enough data has been collected for a reliable score. */
        isReady,
        /** Raw sample count for debugging. */
        sampleCount: mouseSamples.current.length,
    };
}
