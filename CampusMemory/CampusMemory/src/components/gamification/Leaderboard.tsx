'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Users, Crown, Star } from 'lucide-react';
import { getAllStudentPoints, getTopStudents, getStudentRank } from '@/lib/gamification/pointsManager';
import { getStudentBadgeStatus, formatBadgeName, getBadgeIcon } from '@/lib/gamification/badgeManager';

interface LeaderboardProps {
  currentStudentId?: string;
  limit?: number;
  showFullLeaderboard?: boolean;
}

export default function Leaderboard({ 
  currentStudentId = 'student-001', 
  limit = 10,
  showFullLeaderboard = false 
}: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [currentStudentRank, setCurrentStudentRank] = useState<number>(0);
  const [showAll, setShowAll] = useState(showFullLeaderboard);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [limit, showAll]);

  const loadLeaderboard = () => {
    const students = showAll ? getAllStudentPoints() : getTopStudents(limit);
    
    // Enrich with badge information
    const enrichedData = students.map(student => {
      const badgeStatus = getStudentBadgeStatus(student.studentId, student.totalPoints);
      return {
        ...student,
        badgeStatus
      };
    });

    setLeaderboardData(enrichedData);
    
    // Get current student's rank
    const rank = getStudentRank(currentStudentId);
    setCurrentStudentRank(rank);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400/20 via-yellow-500/20 to-amber-600/20';
      case 2:
        return 'from-gray-300/20 via-gray-400/20 to-gray-500/20';
      case 3:
        return 'from-amber-500/20 via-orange-500/20 to-orange-600/20';
      default:
        return 'from-cyan-500/10 via-purple-500/10 to-pink-500/10';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Campus Leaderboard
          </h2>
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
        
        <p className="text-gray-400 text-lg">
          Compete with peers and earn your place among campus legends!
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20 backdrop-blur-xl"
          >
            <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{leaderboardData.length}</div>
            <div className="text-sm text-gray-400">Total Participants</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20 backdrop-blur-xl"
          >
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {currentStudentRank > 0 ? `#${currentStudentRank}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Your Rank</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-500/20 backdrop-blur-xl"
          >
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {leaderboardData[0]?.totalPoints || 0}
            </div>
            <div className="text-sm text-gray-400">Top Score</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/10">
          <div className="col-span-1 text-gray-300 font-semibold text-center">Rank</div>
          <div className="col-span-5 text-gray-300 font-semibold">Student</div>
          <div className="col-span-2 text-gray-300 font-semibold text-center">Badge</div>
          <div className="col-span-2 text-gray-300 font-semibold text-center">Events</div>
          <div className="col-span-2 text-gray-300 font-semibold text-center">Points</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {leaderboardData.map((student, index) => {
              const rank = index + 1;
              const isCurrentStudent = student.studentId === currentStudentId;

              return (
                <motion.div
                  key={student.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    grid grid-cols-12 gap-4 p-4 border-b border-white/5
                    transition-all duration-300 cursor-pointer
                    ${isCurrentStudent 
                      ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-l-4 border-l-cyan-400' 
                      : `bg-gradient-to-r ${getRankGradient(rank)} hover:bg-white/5`
                    }
                    ${hoveredIndex === index ? 'transform scale-[1.02]' : ''}
                  `}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Student Name */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {student.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center gap-2">
                        {student.studentName}
                        {isCurrentStudent && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">ID: {student.studentId}</div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="col-span-2 flex items-center justify-center">
                    {student.badgeStatus.currentBadge ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getBadgeIcon(student.badgeStatus.currentBadge)}
                        </span>
                        <span className={`text-sm font-semibold bg-gradient-to-r ${student.badgeStatus.currentBadge.gradient} bg-clip-text text-transparent`}>
                          {student.badgeStatus.currentBadge.type.toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No Badge</span>
                    )}
                  </div>

                  {/* Events Count */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">
                        {student.eventHistory.length}
                      </div>
                      <div className="text-xs text-gray-400">Events</div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {student.totalPoints}
                      </div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {leaderboardData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No participants yet</p>
              <p className="text-sm">Be the first to participate in events and climb the leaderboard!</p>
            </div>
          )}
        </div>

        {/* Show More Button */}
        {!showFullLeaderboard && leaderboardData.length >= limit && (
          <div className="p-4 text-center border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              {showAll ? 'Show Less' : 'Show Full Leaderboard'}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadLeaderboard}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-all backdrop-blur-xl"
        >
          🔄 Refresh Leaderboard
        </motion.button>
      </motion.div>
    </div>
  );
}
