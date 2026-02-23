"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Medal, Crown, Star, Users } from "lucide-react";
import { achievements, type Achievement } from "@/lib/data";

const levelConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  bronze: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Medal className="w-6 h-6 text-amber-600" />,
  },
  silver: {
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: <Award className="w-6 h-6 text-gray-500" />,
  },
  gold: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: <Trophy className="w-6 h-6 text-yellow-600" />,
  },
  platinum: {
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: <Crown className="w-6 h-6 text-indigo-600" />,
  },
};

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const config = levelConfig[achievement.level];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      className={`${config.bg} border ${config.border} rounded-2xl p-5 text-center cursor-pointer transition-shadow hover:shadow-lg`}
    >
      {/* Badge Icon */}
      <div className="text-4xl mb-3">{achievement.icon}</div>

      {/* Level Badge */}
      <div className="flex justify-center mb-2">
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg} border ${config.border}`}
        >
          {config.icon}
          {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-heading font-bold text-gray-900 mb-1">
        {achievement.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3">{achievement.description}</p>

      {/* Earned by */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
        <Users className="w-3 h-3" />
        <span>{achievement.earnedBy} students</span>
      </div>
    </motion.div>
  );
}

export default function Gamification() {
  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: "Arjun K.", batch: "CSE '25", points: 2340, badge: "🥇" },
    { rank: 2, name: "Priya S.", batch: "ECE '24", points: 2180, badge: "🥈" },
    { rank: 3, name: "Rahul M.", batch: "ME '25", points: 1950, badge: "🥉" },
    { rank: 4, name: "Sneha P.", batch: "IT '24", points: 1820, badge: "4" },
    { rank: 5, name: "Vikram J.", batch: "Civil '23", points: 1750, badge: "5" },
  ];

  return (
    <section id="gamification" className="py-20 px-4 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-gold/10 text-saffron-dark text-sm font-medium rounded-full mb-4">
            🎮 Achievements & Leaderboards
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your contributions{" "}
            <span className="text-gradient">earn recognition</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every problem reported, every wisdom shared earns you badges and
            points. Rise through the ranks and become a Campus Memory legend.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-primary to-university-blue px-6 py-4">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-saffron" />
              Campus Leaderboard
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">
                    {user.badge}
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.batch}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
