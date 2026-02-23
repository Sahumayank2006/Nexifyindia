"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CollegeSelector from "./CollegeSelector";
import type { College } from "@/lib/data";

interface HeroSectionProps {
  onCollegeSelect: (college: College) => void;
  selectedCollege: College | null;
}

// Floating icon component
function FloatingIcon({
  emoji,
  delay,
  x,
  y,
}: {
  emoji: string;
  delay: number;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      className="absolute text-3xl md:text-4xl select-none pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Animated counter
function AnimatedCounter({
  target,
  label,
  suffix = "",
}: {
  target: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-heading font-bold text-white"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <p className="text-sm text-white/70 mt-1">{label}</p>
    </div>
  );
}

// Particle component
function Particle({ index }: { index: number }) {
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const duration = Math.random() * 10 + 10;
  const delay = Math.random() * 5;

  return (
    <motion.div
      className="absolute rounded-full bg-saffron/30"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "-10px",
      }}
      animate={{
        y: [0, -800],
        opacity: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 100],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
  );
}

export default function HeroSection({
  onCollegeSelect,
  selectedCollege,
}: HeroSectionProps) {
  const floatingIcons = [
    { emoji: "📚", x: 8, y: 20 },
    { emoji: "💻", x: 85, y: 15 },
    { emoji: "☕", x: 15, y: 70 },
    { emoji: "🎪", x: 90, y: 65 },
    { emoji: "🎓", x: 5, y: 45 },
    { emoji: "📝", x: 92, y: 40 },
    { emoji: "🏏", x: 20, y: 85 },
    { emoji: "🎵", x: 78, y: 80 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-university-blue">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating campus icons */}
      {floatingIcons.map((icon, i) => (
        <FloatingIcon
          key={i}
          emoji={icon.emoji}
          delay={i * 0.5}
          x={icon.x}
          y={icon.y}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Neural network decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 md:w-32 md:h-32 border-2 border-saffron/30 rounded-full mx-auto"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-2 border-white/20 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl">🧠</span>
            </div>
          </div>
        </motion.div>

        {/* Main tagline */}
        <motion.h1
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="block">Humans forget.</span>
          <span className="block mt-2">
            Our campus{" "}
            <span className="text-saffron relative">
              won&apos;t.
              <motion.span
                className="absolute -bottom-2 left-0 h-1 bg-saffron rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1.5 }}
              />
            </span>
          </span>
        </motion.h1>

        {/* Subtagline */}
        <motion.p
          className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Every batch graduates. Their experiences shouldn&apos;t.
          <br />
          <span className="text-saffron-light font-medium">
            The first self-learning college platform for India.
          </span>
        </motion.p>

        {/* Animated counters */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <AnimatedCounter target={12} label="Years of Campus Wisdom" suffix="+" />
          <AnimatedCounter target={47} label="Problems Prevented Today" />
          <AnimatedCounter target={1234} label="Hours Saved This Week" />
          <AnimatedCounter target={500} label="Colleges Connected" suffix="+" />
        </motion.div>

        {/* College Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <CollegeSelector
            onSelect={onCollegeSelect}
            selected={selectedCollege}
          />
        </motion.div>

        {/* Welcome message for selected college */}
        {selectedCollege && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 glass rounded-2xl px-8 py-4"
          >
            <p className="text-white text-lg">
              Welcome to{" "}
              <span className="text-saffron font-bold">
                {selectedCollege.shortName}&apos;s
              </span>{" "}
              Living Memory
            </p>
            <p className="text-white/60 text-sm mt-1">
              {selectedCollege.activeUsers.toLocaleString()} active users •{" "}
              Memory Index: {selectedCollege.memoryIndex}%
            </p>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
