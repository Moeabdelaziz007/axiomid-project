"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

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
   FLOATING LOGO COMPONENT
   ============================================ */
function FloatingLogo() {
  return (
    <motion.div
      className="float mb-8"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00ff41] to-[#00d4ff] opacity-20 blur-xl animate-pulse" />

        {/* Main logo container */}
        <div className="relative w-full h-full rounded-full bg-black border border-[#00ff41]/30 flex items-center justify-center overflow-hidden">
          {/* Inner gradient */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#00ff41]/10 to-[#00d4ff]/10" />

          {/* Fingerprint + Circuit SVG */}
          <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff41" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Fingerprint curves */}
            <path
              d="M50 15 Q70 25, 70 50 Q70 75, 50 85 Q30 75, 30 50 Q30 25, 50 15"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              filter="url(#logoGlow)"
            />
            <path
              d="M50 25 Q60 32, 60 50 Q60 68, 50 75 Q40 68, 40 50 Q40 32, 50 25"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              opacity="0.7"
            />
            <path
              d="M50 35 Q55 40, 55 50 Q55 60, 50 65 Q45 60, 45 50 Q45 40, 50 35"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Circuit nodes */}
            <circle cx="30" cy="50" r="3" fill="#00ff41" filter="url(#logoGlow)" />
            <circle cx="70" cy="50" r="3" fill="#00d4ff" filter="url(#logoGlow)" />
            <circle cx="50" cy="15" r="2" fill="#00ff41" opacity="0.8" />
            <circle cx="50" cy="85" r="2" fill="#00d4ff" opacity="0.8" />

            {/* Circuit lines */}
            <line x1="30" y1="50" x2="20" y2="50" stroke="#00ff41" strokeWidth="1" opacity="0.5" />
            <line x1="70" y1="50" x2="80" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Orbiting particle */}
        <motion.div
          className="absolute w-2 h-2 bg-[#00ff41] rounded-full"
          style={{ top: "50%", left: "50%" }}
          animate={{
            rotate: 360,
            x: [0, 50, 0, -50, 0],
            y: [-50, 0, 50, 0, -50],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
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
  { id: "instagram", name: "Instagram", icon: "📷", xp: 10, color: "#e4405f" },
  { id: "discord", name: "Discord", icon: "💬", xp: 10, color: "#5865f2" },
  { id: "github", name: "GitHub", icon: "🐙", xp: 20, color: "#ffffff" },
  { id: "linkedin", name: "LinkedIn", icon: "in", xp: 15, color: "#0a66c2" },
  { id: "wallet", name: "Wallet", icon: "💳", xp: 25, color: "#00ff41" },
];

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
export default function Home() {
  const [stage, setStage] = useState<"intro" | "question" | "badge" | "prove">("intro");
  const [showButton, setShowButton] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [badgeLevel, setBadgeLevel] = useState<BadgeLevel>("ghost");
  const [totalXP, setTotalXP] = useState(0);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setStage("question"), 1500);
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

  const handleIntegrationClick = (integration: typeof integrations[0]) => {
    if (connectedIntegrations.includes(integration.id)) return;

    const newXP = totalXP + integration.xp;
    setTotalXP(newXP);
    setConnectedIntegrations([...connectedIntegrations, integration.id]);

    // Update badge level based on XP
    if (newXP >= 70) setBadgeLevel("axiom");
    else if (newXP >= 30) setBadgeLevel("pulse");
    else if (newXP >= 10) setBadgeLevel("spark");
  };

  return (
    <div className={`bg-oled min-h-screen flex flex-col items-center justify-center px-4 relative z-10 ${isGlitching ? "glitch" : ""}`}>
      <AnimatePresence mode="wait">
        {/* INTRO STAGE */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <FloatingLogo />
          </motion.div>
        )}

        {/* QUESTION STAGE */}
        {stage === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-2xl"
          >
            <FloatingLogo />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#00ff41] text-sm font-mono tracking-[0.3em] mb-4 uppercase"
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

        {/* BADGE & PROVE STAGE */}
        {(stage === "badge" || stage === "prove") && (
          <motion.div
            key="badge-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center w-full max-w-2xl"
          >
            <Badge level={badgeLevel} size={160} />

            {/* XP Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 mb-6"
            >
              <span className="text-3xl font-bold gradient-text">{totalXP}</span>
              <span className="text-gray-500 text-lg ml-2">XP</span>
            </motion.div>

            {stage === "prove" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Terminal-style header */}
                <div className="terminal-box mb-8 p-4 text-left">
                  <div className="terminal-dots mb-3">
                    <div className="terminal-dot red" />
                    <div className="terminal-dot yellow" />
                    <div className="terminal-dot green" />
                  </div>
                  <p className="text-gray-400 font-mono text-sm">
                    <span className="text-[#00ff41]">$</span> Talk is cheap. <span className="text-white font-medium">Prove it.</span>
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
                    const isConnected = connectedIntegrations.includes(integration.id);
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
                            className={`integration-icon glass-card flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl w-full ${isConnected
                                ? "border-[#00ff41] bg-[#00ff41]/10"
                                : ""
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

                {/* Level indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-500 text-sm">
                    Current Level: <span className="text-white font-medium capitalize">{badgeLevel}</span>
                    {badgeLevel !== "axiom" && (
                      <span className="text-gray-600 ml-2">
                        • {badgeLevel === "ghost" ? "10" : badgeLevel === "spark" ? "30" : "70"} XP to next level
                      </span>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
