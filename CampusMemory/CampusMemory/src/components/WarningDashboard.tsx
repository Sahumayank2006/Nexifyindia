"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";
import { alerts, type Alert } from "@/lib/data";

const riskColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
  },
};

function AlertCard({ alert, index }: { alert: Alert; index: number }) {
  const colors = riskColors[alert.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden card-hover`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                alert.riskLevel === "red"
                  ? "bg-red-500 animate-pulse"
                  : alert.riskLevel === "yellow"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
              {alert.riskLevel === "red"
                ? "HIGH RISK"
                : alert.riskLevel === "yellow"
                ? "MODERATE"
                : "LOW RISK"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <BarChart3 className="w-4 h-4" />
            <span>{alert.confidence}% confident</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className={`font-heading text-lg font-bold mb-2 ${colors.text}`}>
          {alert.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {alert.description}
        </p>

        {/* Countdown & Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {alert.daysUntil}
            </p>
            <p className="text-xs text-gray-500">Days Until</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto text-gray-400 mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {alert.historicalOccurrences}
            </p>
            <p className="text-xs text-gray-500">Past Events</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <AlertTriangle className="w-4 h-4 mx-auto text-gray-400 mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {alert.predictedDate.split("-").slice(1).join("/")}
            </p>
            <p className="text-xs text-gray-500">Predicted</p>
          </div>
        </div>

        {/* Preventive Actions */}
        <div className="bg-white/60 rounded-xl p-4">
          <h4 className="font-heading text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Preventive Actions
          </h4>
          <ul className="space-y-2">
            {alert.preventiveActions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckCircle className="w-4 h-4 text-ivy-green mt-0.5 shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function WarningDashboard() {
  return (
    <section id="warnings" className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-full mb-4">
            <Zap className="w-3 h-3 inline mr-1" />
            Future Warning Dashboard
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Predicting problems{" "}
            <span className="text-gradient">before they happen</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            AI-powered predictions based on years of campus patterns. See
            what&apos;s coming and prevent it before it affects anyone.
          </p>
        </motion.div>

        {/* Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { level: "red", label: "High Risk", count: alerts.filter((a) => a.riskLevel === "red").length, color: "text-red-600 bg-red-50 border-red-200" },
            { level: "yellow", label: "Moderate", count: alerts.filter((a) => a.riskLevel === "yellow").length, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
            { level: "green", label: "Low Risk", count: alerts.filter((a) => a.riskLevel === "green").length, color: "text-green-600 bg-green-50 border-green-200" },
          ].map((item) => (
            <div
              key={item.level}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${item.color}`}
            >
              <span className="text-2xl font-bold">{item.count}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </div>

        {/* Time Travel CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-university-blue text-white rounded-2xl font-heading font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
            🕰️ Explore Time Travel Feature
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-400 mt-3">
            See how similar past events unfolded and compare with today
          </p>
        </motion.div>
      </div>
    </section>
  );
}
