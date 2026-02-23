"use client";

import { motion } from "framer-motion";
import {
  ThumbsUp,
  Quote,
  GraduationCap,
  Lightbulb,
  BookOpen,
  Briefcase,
  Coffee,
  Star,
} from "lucide-react";
import { wisdomTips, type WisdomTip } from "@/lib/data";

const categoryIcons: Record<string, React.ReactNode> = {
  "Course selection advice": <BookOpen className="w-4 h-4" />,
  "Campus survival hacks": <Coffee className="w-4 h-4" />,
  "Internship guidance": <Briefcase className="w-4 h-4" />,
  "Exam preparation tips": <Lightbulb className="w-4 h-4" />,
  "Professor recommendations": <Star className="w-4 h-4" />,
};

function WisdomCard({ tip, index }: { tip: WisdomTip; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 card-hover relative"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-saffron/20 absolute top-4 right-4" />

      {/* Category */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-xs rounded-full font-medium">
          {categoryIcons[tip.category] || <GraduationCap className="w-3 h-3" />}
          {tip.category}
        </span>
        <span className="text-xs text-gray-400">{tip.department}</span>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        &ldquo;{tip.content}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-university-blue flex items-center justify-center text-white text-xs font-bold">
            &apos;{tip.batch.slice(-2)}
          </div>
          <span className="text-xs text-gray-500">Batch of {tip.batch}</span>
        </div>
        <div className="flex items-center gap-1 text-saffron">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{tip.upvotes}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WisdomFeed() {
  return (
    <section id="wisdom" className="py-20 px-4 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron-dark text-sm font-medium rounded-full mb-4">
            🎓 Senior-to-Junior Wisdom
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            5 seniors faced this.{" "}
            <span className="text-gradient">Here&apos;s their collective wisdom.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Anonymous tips from those who&apos;ve walked the corridors before you.
            Campus survival knowledge, passed down through generations.
          </p>
        </motion.div>

        {/* Wisdom Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisdomTips.map((tip, index) => (
            <WisdomCard key={tip.id} tip={tip} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            &ldquo;Your experience matters. Share it once, help forever.&rdquo;
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron to-saffron-dark text-white rounded-xl font-heading font-semibold shadow-lg hover:shadow-xl transition-all">
            <Lightbulb className="w-5 h-5" />
            Share Your Wisdom
          </button>
        </motion.div>
      </div>
    </section>
  );
}
