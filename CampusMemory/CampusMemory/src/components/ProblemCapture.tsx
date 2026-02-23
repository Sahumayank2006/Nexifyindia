"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PartyPopper,
  Home,
  Building2,
  ClipboardList,
  GraduationCap,
  Send,
  Camera,
  Mic,
  X,
  ChevronRight,
  ThumbsUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { problems, problemCategories, type Problem } from "@/lib/data";

interface ProblemCaptureProps {
  collegeId?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Academic & Timetable": <BookOpen className="w-6 h-6" />,
  "Campus Events & Fests": <PartyPopper className="w-6 h-6" />,
  "Hostel & Accommodation": <Home className="w-6 h-6" />,
  "Infrastructure & Logistics": <Building2 className="w-6 h-6" />,
  "Administration & Policies": <ClipboardList className="w-6 h-6" />,
  "Senior-to-Junior Wisdom": <GraduationCap className="w-6 h-6" />,
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  reported: { color: "bg-blue-100 text-blue-700", icon: <AlertCircle className="w-4 h-4" />, label: "Reported" },
  analyzing: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-4 h-4" />, label: "Analyzing" },
  solving: { color: "bg-orange-100 text-orange-700", icon: <Clock className="w-4 h-4 animate-spin" />, label: "In Progress" },
  resolved: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-4 h-4" />, label: "Resolved" },
  prevented: { color: "bg-purple-100 text-purple-700", icon: <Shield className="w-4 h-4" />, label: "Prevented" },
};

const severityColors: Record<string, string> = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

function ProblemCard({ problem }: { problem: Problem }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[problem.status];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${severityColors[problem.severity]}`}
            />
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
              <span className="flex items-center gap-1">
                {status.icon}
                {status.label}
              </span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            {problem.upvotes}
          </span>
        </div>

        <h3 className="font-heading font-semibold text-gray-900 mb-2">
          {problem.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {problem.category}
          </span>
          <span>•</span>
          <span>{problem.reportedDate}</span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-600 text-sm mt-3 mb-3 leading-relaxed">
                {problem.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                <span>{problem.reportedBy}</span>
                {problem.resolvedDate && (
                  <span className="text-green-600">
                    Resolved: {problem.resolvedDate}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ReportForm({ onClose }: { onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sentiment, setSentiment] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -20, -50], opacity: [1, 1, 0], rotate: [0, -5, 10] }}
          transition={{ duration: 1.5 }}
          className="text-6xl mb-4"
        >
          ✈️
        </motion.div>
        <h3 className="font-heading text-2xl font-bold text-primary mb-2">
          Sent to Memory Vault!
        </h3>
        <p className="text-gray-500">
          Your experience is now part of campus wisdom. Thank you!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {problemCategories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                selectedCategory === cat.name
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 hover:border-primary/30"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <p className="mt-1 font-medium text-gray-700 text-xs leading-tight">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Problem Title
        </label>
        <input
          type="text"
          placeholder="Brief description of the issue..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description
        </label>
        <textarea
          placeholder="Share your experience in detail. Your words become campus wisdom..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          required
        />
      </div>

      {/* Sentiment Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did this make you feel?
        </label>
        <div className="flex gap-3">
          {[
            { emoji: "😊", label: "Positive", value: "positive" },
            { emoji: "😐", label: "Neutral", value: "neutral" },
            { emoji: "😠", label: "Frustrated", value: "negative" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSentiment(s.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                sentiment === s.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 hover:border-primary/30"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-sm text-gray-600">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
          title="Upload photo"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-university-blue text-white rounded-xl font-medium hover:shadow-lg transition-all ripple"
        >
          <Send className="w-4 h-4" />
          Submit to Memory
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        🔒 Anonymous by default. Your identity is always protected.
      </p>
    </form>
  );
}

export default function ProblemCapture({ collegeId }: ProblemCaptureProps = {}) {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const relevantProblems =
    collegeId && collegeId.trim().length > 0
      ? problems.filter((p) => p.college === collegeId)
      : problems;

  const categoriesWithCount = problemCategories.map((cat) => ({
    ...cat,
    count:
      collegeId && collegeId.trim().length > 0
        ? relevantProblems.filter((p) => p.category === cat.name).length
        : cat.count,
  }));

  const filteredProblems =
    activeCategory === "all"
      ? relevantProblems
      : relevantProblems.filter((p) => p.category === activeCategory);

  return (
    <section id="problems" className="py-20 px-4 bg-marble-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Problem Capture Portal
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your experience matters.{" "}
            <span className="text-gradient">Share it once, help forever.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every problem reported becomes a permanent part of campus wisdom.
            Help future batches avoid what you faced.
          </p>
        </motion.div>

        {/* Category Ribbon */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
            }`}
          >
            All Issues
          </button>
          {categoriesWithCount.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden md:inline">{cat.name}</span>
              <span className="text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Report button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron to-saffron-dark text-white rounded-xl font-heading font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AlertCircle className="w-5 h-5" />
            Report a Problem
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Problem Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProblemCard problem={problem} />
            </motion.div>
          ))}
        </motion.div>

        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-gray-500"
          >
            <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-white px-6 py-8 shadow-sm">
              <span className="text-3xl">🌱</span>
              <p className="font-heading text-lg text-gray-700">
                No shared experiences yet.
              </p>
              <p className="text-sm text-gray-500">
                Report the first problem to start building this college&apos;s memory.
              </p>
            </div>
          </motion.div>
        )}

        {/* Report Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    📝 Report a Problem
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <ReportForm onClose={() => setShowForm(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
