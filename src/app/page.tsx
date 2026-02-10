"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { DNAProvider, useDNA, type DNALevel } from "./context/dna-context";
import { DNAProgress } from "./components/dna-progress";
import { useBehavior } from "./hooks/use-behavior";

type BadgeLevel = "ghost" | "spark" | "pulse" | "axiom";

/* ============================================
   TYPEWRITER TEXT COMPONENT
   ============================================ */
interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

function TypewriterText({ text, speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const delay = setTimeout(onComplete, 300);
      return () => clearTimeout(delay);
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      <span className="typewriter-cursor" />
    </span>
  );
}

/* ============================================
   AXI MASCOT — THE JUMPING AVATAR
   Inspired by OpenClaw's lobster but unique
   to AxiomID: a cute fingerprint guardian
   ============================================ */
function AxiMascot({ size = "large", mood = "happy" }: { size?: "small" | "large"; mood?: "happy" | "curious" | "excited" }) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);

  // Random idle animations
  useEffect(() => {
    const idleLoop = async () => {
      while (true) {
        // Bob up and down (default idle)
        await controls.start({
          y: [0, -12, 0],
          rotate: [0, -2, 0, 2, 0],
          transition: { duration: 3, ease: "easeInOut" },
        });
        // Random pause
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 2000));
        // Occasional playful bounce
        if (Math.random() > 0.6) {
          await controls.start({
            y: [0, -25, 0, -10, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
            transition: { duration: 0.8, ease: "easeOut" },
          });
        }
      }
    };
    idleLoop();
  }, [controls]);

  // Jump on click
  const handleClick = useCallback(async () => {
    setJumpCount((prev) => prev + 1);
    await controls.start({
      y: [0, -40, 0, -20, 0, -8, 0],
      scale: [1, 1.1, 0.9, 1.05, 0.98, 1.02, 1],
      rotate: [0, -5, 5, -3, 3, 0],
      transition: { duration: 0.9, ease: "easeOut" },
    });
  }, [controls]);

  // Hover reaction
  const handleHoverStart = useCallback(async () => {
    setIsHovered(true);
    await controls.start({
      scale: 1.08,
      y: -8,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    });
  }, [controls]);

  const handleHoverEnd = useCallback(async () => {
    setIsHovered(false);
    await controls.start({
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    });
  }, [controls]);

  const dimensions = size === "large" ? "w-32 h-32 md:w-44 md:h-44" : "w-16 h-16 md:w-20 md:h-20";

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      animate={controls}
      onClick={handleClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      initial={{ opacity: 0, scale: 0, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
    >
      {/* Glow shadow under mascot */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00ff41]/20 blur-xl"
        style={{ width: "80%", height: "20px" }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : [1, 0.8, 1],
          opacity: isHovered ? 0.5 : 0.3,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Orbiting sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i === 0 ? "#00ff41" : i === 1 ? "#00d4ff" : "#a855f7",
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * 2.094) + 0) * 60, Math.cos((i * 2.094) + 3.14) * 60, 0],
            y: [0, Math.sin((i * 2.094) + 0) * 60, Math.sin((i * 2.094) + 3.14) * 60, 0],
            opacity: [0.8, 0.4, 0.8],
            scale: [1, 0.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* The AXI SVG Character */}
      <div className={`relative ${dimensions}`}>
        <svg viewBox="0 0 200 220" className="w-full h-full" style={{ filter: "drop-shadow(0 0 20px rgba(0,255,65,0.4))" }}>
          <defs>
            <linearGradient id="axiBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff41" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            <radialGradient id="axiBodyFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a2a1a" />
              <stop offset="70%" stopColor="#061510" />
              <stop offset="100%" stopColor="#030d08" />
            </radialGradient>
            <radialGradient id="axiEyeGrad" cx="40%" cy="35%" r="50%">
              <stop offset="0%" stopColor="#33ff77" />
              <stop offset="100%" stopColor="#00cc33" />
            </radialGradient>
            <filter id="axiGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="axiSoftGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer aura glow */}
          <ellipse cx="100" cy="105" rx="75" ry="78" fill="none" stroke="#00ff41" strokeWidth="1" opacity="0.15" filter="url(#axiSoftGlow)" />

          {/* Body - round blob */}
          <ellipse cx="100" cy="105" rx="65" ry="68" fill="url(#axiBodyFill)" stroke="url(#axiBodyGrad)" strokeWidth="2" opacity="0.95" />

          {/* Fingerprint lines on body */}
          <g opacity="0.6" fill="none" stroke="url(#axiBodyGrad)" strokeWidth="1.2">
            <path d="M100 50 Q135 65, 135 105 Q135 145, 100 160 Q65 145, 65 105 Q65 65, 100 50" />
            <path d="M100 60 Q125 72, 125 105 Q125 138, 100 150 Q75 138, 75 105 Q75 72, 100 60" />
            <path d="M100 70 Q115 80, 115 105 Q115 130, 100 140 Q85 130, 85 105 Q85 80, 100 70" />
            <path d="M100 80 Q108 87, 108 105 Q108 123, 100 130 Q92 123, 92 105 Q92 87, 100 80" />
          </g>

          {/* Circuit pattern lines */}
          <g opacity="0.4" stroke="#00d4ff" strokeWidth="0.8" fill="none">
            <line x1="45" y1="100" x2="65" y2="100" />
            <line x1="135" y1="100" x2="155" y2="100" />
            <circle cx="45" cy="100" r="2" fill="#00d4ff" />
            <circle cx="155" cy="100" r="2" fill="#00d4ff" />
            <line x1="100" y1="40" x2="100" y2="50" />
            <circle cx="100" cy="38" r="2" fill="#00ff41" />
          </g>

          {/* Left arm - circuit style */}
          <g opacity="0.7">
            <path d="M42 115 Q30 130, 35 150 Q37 155, 40 152" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="d" values="M42 115 Q30 130, 35 150 Q37 155, 40 152;M42 115 Q28 128, 33 148 Q35 153, 38 150;M42 115 Q30 130, 35 150 Q37 155, 40 152" dur="3s" repeatCount="indefinite" />
            </path>
            <circle cx="40" cy="152" r="3" fill="#00ff41" opacity="0.5">
              <animate attributeName="cy" values="152;150;152" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Right arm - circuit style */}
          <g opacity="0.7">
            <path d="M158 115 Q170 130, 165 150 Q163 155, 160 152" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="d" values="M158 115 Q170 130, 165 150 Q163 155, 160 152;M158 115 Q172 128, 167 148 Q165 153, 162 150;M158 115 Q170 130, 165 150 Q163 155, 160 152" dur="3.5s" repeatCount="indefinite" />
            </path>
            <circle cx="160" cy="152" r="3" fill="#00d4ff" opacity="0.5">
              <animate attributeName="cy" values="152;150;152" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Left eye */}
          <ellipse cx="78" cy="98" rx="14" ry="15" fill="#0a1a0f" stroke="#00ff41" strokeWidth="1.5" filter="url(#axiGlow)" />
          <ellipse cx="78" cy="98" rx="10" ry="11" fill="url(#axiEyeGrad)" />
          <ellipse cx="75" cy="95" rx="4" ry="5" fill="#003311" />
          <circle cx="73" cy="92" r="2.5" fill="white" opacity={isHovered ? "0.9" : "0.7"}>
            {isHovered && <animate attributeName="r" values="2.5;3;2.5" dur="0.5s" repeatCount="1" />}
          </circle>
          <circle cx="80" cy="99" r="1" fill="white" opacity="0.4" />

          {/* Right eye */}
          <ellipse cx="122" cy="98" rx="14" ry="15" fill="#0a1a0f" stroke="#00ff41" strokeWidth="1.5" filter="url(#axiGlow)" />
          <ellipse cx="122" cy="98" rx="10" ry="11" fill="url(#axiEyeGrad)" />
          <ellipse cx="119" cy="95" rx="4" ry="5" fill="#003311" />
          <circle cx="117" cy="92" r="2.5" fill="white" opacity={isHovered ? "0.9" : "0.7"}>
            {isHovered && <animate attributeName="r" values="2.5;3;2.5" dur="0.5s" repeatCount="1" />}
          </circle>
          <circle cx="124" cy="99" r="1" fill="white" opacity="0.4" />

          {/* Smile */}
          <path d="M90 118 Q100 128, 110 118" fill="none" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" filter="url(#axiGlow)" opacity="0.8" />

          {/* Cheek blush */}
          <circle cx="62" cy="115" r="6" fill="#00ff41" opacity="0.08" />
          <circle cx="138" cy="115" r="6" fill="#00d4ff" opacity="0.08" />
        </svg>
      </div>

      {/* Click counter easter egg */}
      <AnimatePresence>
        {jumpCount > 0 && jumpCount % 5 === 0 && (
          <motion.span
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#00ff41] font-mono whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1 }}
          >
            {jumpCount >= 20 ? "🤖 I'm alive!" : jumpCount >= 10 ? "⚡ More!" : "✨ Whee!"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================
   DYNAMIC BADGE COMPONENT
   ============================================ */
interface BadgeProps {
  level: BadgeLevel;
  size?: number;
}

function Badge({ level, size = 120 }: BadgeProps) {
  const badgeConfig = {
    ghost: { color: "#4a4a4a", glow: "rgba(74, 74, 74, 0.3)", name: "Ghost" },
    spark: { color: "#00ff41", glow: "rgba(0, 255, 65, 0.5)", name: "Spark" },
    pulse: { color: "#00d4ff", glow: "rgba(0, 212, 255, 0.5)", name: "Pulse" },
    axiom: { color: "url(#holographic)", glow: "rgba(168, 85, 247, 0.5)", name: "Axiom" },
  };

  const config = badgeConfig[level];

  return (
    <motion.div
      className="float"
      style={{ color: level === "axiom" ? "#a855f7" : config.color }}
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 1, bounce: 0.4 }}
    >
      <div className="badge-breathe">
        <svg width={size} height={size} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="holographic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7">
                <animate attributeName="stop-color" values="#a855f7;#00d4ff;#00ff41;#fbbf24;#a855f7" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#00d4ff">
                <animate attributeName="stop-color" values="#00d4ff;#00ff41;#fbbf24;#a855f7;#00d4ff" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#00ff41">
                <animate attributeName="stop-color" values="#00ff41;#fbbf24;#a855f7;#00d4ff;#00ff41" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle cx="60" cy="60" r="55" fill="none" stroke={config.color} strokeWidth="1" opacity={0.3} />
          {/* Main ring */}
          <circle cx="60" cy="60" r="48" fill="none" stroke={config.color} strokeWidth="2" filter="url(#glow)" opacity={level === "ghost" ? 0.5 : 1} />
          {/* Inner detail ring */}
          <circle cx="60" cy="60" r="38" fill="none" stroke={config.color} strokeWidth="1" opacity={0.4} />

          {/* Pulse heartbeat line for Pulse level */}
          {level === "pulse" && (
            <path d="M25 60 L40 60 L45 45 L50 75 L55 50 L60 70 L65 55 L70 60 L95 60" fill="none" stroke={config.color} strokeWidth="2" filter="url(#glow)" />
          )}

          {/* Center dot */}
          {level !== "pulse" && (
            <circle cx="60" cy="60" r="5" fill={config.color} opacity={0.6} />
          )}

          {/* Badge name */}
          <text x="60" y="100" textAnchor="middle" fill={config.color} fontSize="11" fontFamily="system-ui" fontWeight="500" letterSpacing="2">
            {config.name.toUpperCase()}
          </text>
        </svg>
      </div>
    </motion.div>
  );
}

/* ============================================
   3D TILT CARD COMPONENT
   ============================================ */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   INTEGRATION ICONS DATA
   ============================================ */
const integrations = [
  { id: "twitter", name: "X (Twitter)", icon: "𝕏", xp: 10, color: "#1da1f2" },
  { id: "facebook", name: "Facebook", icon: "f", xp: 10, color: "#1877f2" },
  { id: "instagram", name: "Instagram", icon: "📷", xp: 10, color: "##e4405f" },
  { id: "discord", name: "Discord", icon: "💬", xp: 10, color: "#5865f2" },
  { id: "github", name: "GitHub", icon: "🐙", xp: 20, color: "#ffffff" },
  { id: "linkedin", name: "LinkedIn", icon: "in", xp: 15, color: "#0a66c2" },
  { id: "wallet", name: "Wallet", icon: "💳", xp: 25, color: "#00ff41" },
];

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
export default function Home() {
  return (
    <DNAProvider>
      <HomeContent />
    </DNAProvider>
  );
}

function HomeContent() {
  const { state, addStamp, hasStamp, updateBehaviorScore } = useDNA();
  const behavior = useBehavior();
  const [stage, setStage] = useState<"intro" | "question" | "badge" | "prove">("intro");
  const [showButton, setShowButton] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Feed behavior score into DNA engine
  useEffect(() => {
    if (behavior.isReady) {
      updateBehaviorScore(behavior.score);
    }
  }, [behavior.score, behavior.isReady, updateBehaviorScore]);

  useEffect(() => {
    const timer = setTimeout(() => setStage("question"), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleYesClick = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setStage("badge");
      setTimeout(() => setStage("prove"), 2500);
    }, 300);
  };

  const handleIntegrationClick = async (integration: (typeof integrations)[0]) => {
    if (hasStamp(integration.id)) return;

    // Validate with server API (includes rate limit + bot check)
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stampId: integration.id,
          behaviorScore: behavior.score,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.warn("[AxiomID] Stamp rejected:", err.message);
        return;
      }

      // Server approved — add stamp to DNA
      addStamp(integration.id, integration.name, integration.xp);
    } catch (e) {
      console.error("[AxiomID] API error:", e);
      // Fallback: add stamp locally if API is unreachable
      addStamp(integration.id, integration.name, integration.xp);
    }
  };

  return (
    <div className={`bg-oled min-h-screen flex flex-col items-center justify-center px-4 relative z-10 ${isGlitching ? "glitch" : ""}`}>
      <AnimatePresence mode="wait">
        {/* ======================================
            INTRO STAGE — AXI bouncing entrance
            ====================================== */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center flex flex-col items-center"
          >
            <AxiMascot size="large" mood="curious" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 text-xs font-mono mt-4"
            >
              click me! ↑
            </motion.p>
          </motion.div>
        )}

        {/* ======================================
            QUESTION STAGE — AXI + typewriter
            ====================================== */}
        {stage === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-2xl flex flex-col items-center"
          >
            <AxiMascot size="large" mood="happy" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#00ff41] text-sm font-mono tracking-[0.3em] mb-4 uppercase mt-6"
            >
              {">"} axiomid.protocol.init
            </motion.p>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-relaxed tracking-tight">
              <TypewriterText
                text="In a world of noise, silence is rare."
                speed={35}
                onComplete={() => setTimeout(() => setShowButton(true), 400)}
              />
            </h1>

            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <p className="text-xl md:text-2xl text-gray-400 font-light">
                    Are you <span className="text-white font-normal">human</span>?
                  </p>
                  <button
                    onClick={handleYesClick}
                    className="pulse-button relative px-14 py-4 border-2 border-[#00ff41] text-[#00ff41] rounded-full text-xl font-medium hover:bg-[#00ff41] hover:text-black transition-all duration-300 tracking-wider"
                  >
                    YES
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ======================================
            BADGE & PROVE STAGE
            ====================================== */}
        {(stage === "badge" || stage === "prove") && (
          <motion.div
            key="badge-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center w-full max-w-2xl flex flex-col items-center"
          >
            {/* Mini AXI mascot next to badge */}
            <div className="flex items-center gap-6 mb-2">
              <AxiMascot size="small" mood={state.level === "axiom" ? "excited" : state.level === "pulse" ? "happy" : "curious"} />
              <Badge level={state.level} size={140} />
            </div>

            {/* DNA Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 mb-6 w-full max-w-md"
            >
              <DNAProgress />
            </motion.div>

            {stage === "prove" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                {/* Terminal-style header */}
                <div className="terminal-box mb-8 p-4 text-left">
                  <div className="terminal-dots mb-3">
                    <div className="terminal-dot red" />
                    <div className="terminal-dot yellow" />
                    <div className="terminal-dot green" />
                  </div>
                  <p className="text-gray-400 font-mono text-sm">
                    <span className="text-[#00ff41]">$</span> Talk is cheap.{" "}
                    <span className="text-white font-medium">Prove it.</span>
                  </p>
                </div>

                {/* Integration grid */}
                <motion.div
                  className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {integrations.map((integration, index) => {
                    const isConnected = hasStamp(integration.id);
                    return (
                      <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.08 }}
                      >
                        <TiltCard>
                          <button
                            onClick={() => handleIntegrationClick(integration)}
                            disabled={isConnected}
                            className={`integration-icon glass-card flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl w-full ${isConnected ? "border-[#00ff41] bg-[#00ff41]/10" : ""
                              }`}
                          >
                            <span className="text-2xl md:text-3xl">{integration.icon}</span>
                            <span className="text-xs text-gray-400 truncate w-full">{integration.name}</span>
                            <span className={`text-xs font-medium ${isConnected ? "text-[#00ff41]" : "text-[#00ff41]/70"}`}>
                              {isConnected ? "✓ Connected" : `+${integration.xp} XP`}
                            </span>
                          </button>
                        </TiltCard>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Behavior score indicator (dev mode) */}
                {behavior.isReady && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="mt-6 text-center"
                  >
                    <p className="text-gray-700 text-[10px] font-mono">
                      🛡️ Guardian: behavior={behavior.score}/100 • {behavior.score > 40 ? "✓ Human" : "⚠ Bot?"}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
