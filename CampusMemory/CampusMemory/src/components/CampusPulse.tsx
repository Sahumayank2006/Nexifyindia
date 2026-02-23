"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Shield,
  Brain,
  Zap,
  Users,
  Clock,
  Award,
  Flame,
} from "lucide-react";
import { campusPulseData } from "@/lib/data";

function PulseMetric({
  icon,
  label,
  value,
  suffix,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-gray-100 p-5 card-hover"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-heading font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {suffix && (
          <span className="text-sm text-gray-400 mb-1">{suffix}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function CampusPulse() {
  const metrics = [
    {
      icon: <Activity className="w-5 h-5 text-white" />,
      label: "Campus Satisfaction",
      value: campusPulseData.satisfaction,
      suffix: "%",
      color: "bg-primary",
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      label: "Problems in Resolution",
      value: campusPulseData.problemsInResolution,
      suffix: "active",
      color: "bg-saffron",
    },
    {
      icon: <Brain className="w-5 h-5 text-white" />,
      label: "Wisdom Added This Week",
      value: campusPulseData.wisdomAddedThisWeek,
      suffix: "insights",
      color: "bg-university-blue",
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      label: "Prevention Streak",
      value: campusPulseData.preventionStreak,
      suffix: "days",
      color: "bg-ivy-green",
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      label: "Problems Prevented Today",
      value: campusPulseData.problemsPreventedToday,
      color: "bg-academic-crimson",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      label: "Hours Saved This Week",
      value: campusPulseData.hoursSavedThisWeek,
      suffix: "hrs",
      color: "bg-purple-600",
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      label: "Satisfaction Increase",
      value: campusPulseData.satisfactionIncrease,
      suffix: "%",
      color: "bg-teal-600",
    },
    {
      icon: <Flame className="w-5 h-5 text-white" />,
      label: "Repeat Issues Reduced",
      value: campusPulseData.repeatIssuesReduced,
      suffix: "%",
      color: "bg-orange-500",
    },
  ];

  return (
    <section id="pulse" className="py-20 px-4 bg-marble-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-ivy-green/10 text-ivy-green text-sm font-medium rounded-full mb-4">
            <Activity className="w-3 h-3 inline mr-1" />
            Campus Pulse — Live
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real-time{" "}
            <span className="text-gradient">campus health</span> metrics
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A live snapshot of how your campus is learning, growing, and
            preventing problems in real-time.
          </p>
        </motion.div>

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-600 font-medium">
              Live Dashboard — Updated every 30 seconds
            </span>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric, index) => (
            <PulseMetric key={index} {...metric} delay={index * 0.1} />
          ))}
        </div>

        {/* Most helpful batch banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-university-blue rounded-2xl p-8 text-center text-white"
        >
          <Award className="w-12 h-12 mx-auto mb-4 text-saffron" />
          <h3 className="font-heading text-2xl font-bold mb-2">
            Most Helpful Senior Batch
          </h3>
          <p className="text-6xl font-heading font-bold text-saffron mb-2">
            {campusPulseData.mostHelpfulBatch}
          </p>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Batch of {campusPulseData.mostHelpfulBatch} has contributed the most
            wisdom to Campus Memory. Their experiences continue to help hundreds
            of juniors every semester.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
