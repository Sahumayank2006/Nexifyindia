"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Rocket,
  Smartphone,
  Globe,
} from "lucide-react";

const phases = [
  {
    title: "Phase 1",
    subtitle: "Live Now",
    icon: <CheckCircle className="w-6 h-6 text-ivy-green" />,
    status: "active",
    color: "border-ivy-green bg-green-50",
    items: [
      "Problem reporting system",
      "Basic pattern detection",
      "College selection portal",
      "Senior wisdom feed",
      "Campus pulse dashboard",
    ],
  },
  {
    title: "Phase 2",
    subtitle: "Next Semester",
    icon: <Rocket className="w-6 h-6 text-saffron" />,
    status: "upcoming",
    color: "border-saffron bg-amber-50",
    items: [
      "AI prediction engine",
      "Mobile app (iOS & Android)",
      "Department integration",
      "Real-time notifications",
      "Chatbot assistant",
    ],
  },
  {
    title: "Phase 3",
    subtitle: "Next Academic Year",
    icon: <Globe className="w-6 h-6 text-primary" />,
    status: "future",
    color: "border-primary bg-blue-50",
    items: [
      "Inter-campus wisdom sharing",
      "AR campus navigation",
      "AI-powered virtual assistant",
      "VR campus tour",
      "Predictive scheduling",
    ],
  },
];

export default function Roadmap() {
  return (
    <section className="py-20 px-4 bg-marble-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            🚀 Development Roadmap
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Building the future of{" "}
            <span className="text-gradient">campus intelligence</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our journey from a problem-reporting tool to a complete
            AI-powered institutional learning platform.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-ivy-green via-saffron to-primary" />

          {phases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative border-2 ${phase.color} rounded-3xl p-6`}
            >
              {/* Phase icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white rounded-full p-2 shadow-sm">
                  {phase.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-gray-500">{phase.subtitle}</p>
                </div>
              </div>

              {/* Items */}
              <ul className="space-y-3">
                {phase.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    {phase.status === "active" ? (
                      <CheckCircle className="w-4 h-4 text-ivy-green mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>

              {/* Arrow on mobile */}
              {index < phases.length - 1 && (
                <div className="flex justify-center mt-4 md:hidden">
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
