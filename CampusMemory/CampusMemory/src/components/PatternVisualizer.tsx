"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Layers,
  Eye,
} from "lucide-react";
import { patterns, monthlyData, departmentData, type Pattern } from "@/lib/data";

const COLORS = ["#1E40AF", "#F59E0B", "#10B981", "#DC2626", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

function PatternCard({ pattern, index }: { pattern: Pattern; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
    >
      {/* Severity indicator */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          pattern.severity === "high"
            ? "bg-red-500"
            : pattern.severity === "medium"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-heading font-semibold text-gray-900 pr-4">
            {pattern.title}
          </h3>
          <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {pattern.yearsActive}yr
          </span>
        </div>

        {/* Frequency bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Frequency</span>
            <span className="font-semibold text-primary">{pattern.frequency}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-saffron rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${pattern.frequency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Success rate */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Solution Success Rate</span>
            <span className="font-semibold text-ivy-green">{pattern.successRate}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-ivy-green rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${pattern.successRate}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Hover details */}
        <motion.div
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-3 border-t border-gray-50 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-3 h-3" />
              <span>Seasonal: {pattern.seasonalTrend}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Layers className="w-3 h-3" />
              <span>Depts: {pattern.affectedDepartments.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>Also seen at: {pattern.similarCampuses.join(", ")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PatternVisualizer() {
  const [activeChart, setActiveChart] = useState<"timeline" | "heatmap" | "department" | "distribution">("timeline");

  const chartTabs = [
    { id: "timeline" as const, label: "Annual Timeline", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "heatmap" as const, label: "Problem Heatmap", icon: <Layers className="w-4 h-4" /> },
    { id: "department" as const, label: "Department Spider Web", icon: <Eye className="w-4 h-4" /> },
    { id: "distribution" as const, label: "Category Distribution", icon: <Calendar className="w-4 h-4" /> },
  ];

  const categoryDistribution = [
    { name: "Academic", value: 156 },
    { name: "Events", value: 89 },
    { name: "Hostel", value: 234 },
    { name: "Infrastructure", value: 178 },
    { name: "Admin", value: 145 },
    { name: "Wisdom", value: 312 },
  ];

  const radarData = departmentData.map((d) => ({
    subject: d.department,
    issues: d.issues,
    resolution: d.resolution,
    satisfaction: d.satisfaction,
  }));

  return (
    <section id="patterns" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron-dark text-sm font-medium rounded-full mb-4">
            AI Pattern Visualizer
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Patterns that{" "}
            <span className="text-gradient">repeat across years</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our AI analyzes decades of campus experiences to reveal patterns that
            human eyes miss. See the invisible connections.
          </p>
        </motion.div>

        {/* Pattern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {patterns.map((pattern, index) => (
            <PatternCard key={pattern.id} pattern={pattern} index={index} />
          ))}
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Chart Tabs */}
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeChart === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart Content */}
          <div className="p-6 h-[400px]">
            {activeChart === "timeline" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="problems"
                    stroke="#DC2626"
                    fill="#DC262620"
                    strokeWidth={2}
                    name="Problems Reported"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    fill="#10B98120"
                    strokeWidth={2}
                    name="Resolved"
                  />
                  <Area
                    type="monotone"
                    dataKey="prevented"
                    stroke="#1E40AF"
                    fill="#1E40AF20"
                    strokeWidth={2}
                    name="Prevented"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChart === "heatmap" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="problems" fill="#1E40AF" radius={[4, 4, 0, 0]} name="Problems" />
                  <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                  <Bar dataKey="prevented" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Prevented" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeChart === "department" && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis stroke="#94a3b8" fontSize={10} />
                  <Radar name="Issues" dataKey="issues" stroke="#DC2626" fill="#DC262640" strokeWidth={2} />
                  <Radar name="Resolution %" dataKey="resolution" stroke="#10B981" fill="#10B98140" strokeWidth={2} />
                  <Radar name="Satisfaction %" dataKey="satisfaction" stroke="#1E40AF" fill="#1E40AF40" strokeWidth={2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {activeChart === "distribution" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
