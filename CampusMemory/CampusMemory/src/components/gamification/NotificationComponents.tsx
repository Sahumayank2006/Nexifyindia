'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, X } from 'lucide-react';

interface AIRecommendedBadgeProps {
  matchPercentage: number;
  compact?: boolean;
}

export function AIRecommendedBadge({ matchPercentage, compact = false }: AIRecommendedBadgeProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full backdrop-blur-xl"
      >
        <Sparkles className="w-3 h-3 text-purple-400" />
        <span className="text-xs font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Pick
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-400/40 rounded-xl backdrop-blur-xl shadow-lg shadow-purple-500/20"
    >
      <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
      <div>
        <div className="text-sm font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          AI Recommended
        </div>
        <div className="text-xs text-gray-300">
          {matchPercentage}% Match
        </div>
      </div>
      <TrendingUp className="w-4 h-4 text-pink-400" />
    </motion.div>
  );
}

interface MissedOpportunityAlertProps {
  eventId: string;
  eventName: string;
  eventType: string;
  matchPercentage: number;
  hoursUntilDeadline: number;
  onDismiss: () => void;
  onViewEvent: () => void;
}

export function MissedOpportunityAlert({
  eventId,
  eventName,
  eventType,
  matchPercentage,
  hoursUntilDeadline,
  onDismiss,
  onViewEvent
}: MissedOpportunityAlertProps) {
  const getUrgencyColor = () => {
    if (hoursUntilDeadline <= 24) return 'from-red-500 to-orange-500';
    if (hoursUntilDeadline <= 36) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-green-500';
  };

  const getUrgencyText = () => {
    if (hoursUntilDeadline <= 24) return 'URGENT';
    if (hoursUntilDeadline <= 36) return 'Soon';
    return 'Upcoming';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="relative bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-5 shadow-2xl shadow-purple-500/30 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${getUrgencyColor()} rounded-xl`}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${getUrgencyColor()} text-white`}>
                  {getUrgencyText()}
                </span>
                <span className="text-xs text-gray-400">
                  {hoursUntilDeadline}h remaining
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mt-1">
                {eventName}
              </h4>
            </div>
          </div>

          {/* Dismiss Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </motion.button>
        </div>

        {/* Event Type */}
        <div className="text-sm text-gray-300 mb-3">
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
            {eventType}
          </span>
        </div>

        {/* AI Match */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">AI Match Score</span>
              <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {matchPercentage}%
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Alert Message */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-300">
            🎯 This event is highly recommended for you! Don't miss out on this opportunity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewEvent}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View Event Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
          >
            Maybe Later
          </motion.button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-3xl" />
    </motion.div>
  );
}

interface PointsEarnedNotificationProps {
  points: number;
  eventName: string;
  eventType: string;
  onClose: () => void;
}

export function PointsEarnedNotification({
  points,
  eventName,
  eventType,
  onClose
}: PointsEarnedNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 50 }}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-green-400/40 rounded-2xl p-5 shadow-2xl shadow-green-500/30 max-w-sm"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-start gap-4"
      >
        <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg mb-1">
            +{points} Points Earned! 🎉
          </h4>
          <p className="text-sm text-gray-300 mb-2">
            For participating in <span className="text-green-400 font-semibold">{eventName}</span>
          </p>
          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
            {eventType}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface BadgeEarnedNotificationProps {
  badgeName: string;
  badgeIcon: string;
  badgeGradient: string;
  onClose: () => void;
}

export function BadgeEarnedNotification({
  badgeName,
  badgeIcon,
  badgeGradient,
  onClose
}: BadgeEarnedNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 50 }}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 shadow-2xl shadow-yellow-500/30 max-w-sm"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className={`inline-block p-6 bg-gradient-to-br ${badgeGradient} rounded-full mb-4`}
        >
          <span className="text-6xl">{badgeIcon}</span>
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-2">
          New Badge Unlocked! 🎊
        </h3>
        <p className={`text-lg font-semibold bg-gradient-to-r ${badgeGradient} bg-clip-text text-transparent mb-4`}>
          {badgeName}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Keep participating in events to unlock more badges!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
        >
          Awesome!
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-white" />
      </motion.button>
    </motion.div>
  );
}
