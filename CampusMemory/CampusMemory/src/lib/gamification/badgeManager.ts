/**
 * Badge Manager Module
 * 
 * Manages badge awarding, tracking, and display for the gamification system.
 * 
 * Badge Tiers:
 * - Bronze Badge: 50 points
 * - Silver Badge: 150 points
 * - Gold Badge: 300 points
 * - Platinum Badge: 500 points
 * - Diamond Badge: 1000 points
 */

export enum BadgeType {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  requiredPoints: number;
  icon: string;
  color: string;
  gradient: string;
  earnedDate?: string;
}

export interface StudentBadges {
  studentId: string;
  badges: Badge[];
  currentBadge: Badge | null;
  nextBadge: Badge | null;
  progressToNext: number; // Percentage 0-100
}

// Badge definitions
const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, 'earnedDate'>> = {
  [BadgeType.BRONZE]: {
    type: BadgeType.BRONZE,
    name: 'Bronze Explorer',
    description: 'Awarded for earning 50 points',
    requiredPoints: 50,
    icon: '🥉',
    color: '#CD7F32',
    gradient: 'from-amber-600 to-orange-700'
  },
  [BadgeType.SILVER]: {
    type: BadgeType.SILVER,
    name: 'Silver Achiever',
    description: 'Awarded for earning 150 points',
    requiredPoints: 150,
    icon: '🥈',
    color: '#C0C0C0',
    gradient: 'from-gray-300 to-gray-500'
  },
  [BadgeType.GOLD]: {
    type: BadgeType.GOLD,
    name: 'Gold Champion',
    description: 'Awarded for earning 300 points',
    requiredPoints: 300,
    icon: '🥇',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  [BadgeType.PLATINUM]: {
    type: BadgeType.PLATINUM,
    name: 'Platinum Legend',
    description: 'Awarded for earning 500 points',
    requiredPoints: 500,
    icon: '💎',
    color: '#E5E4E2',
    gradient: 'from-cyan-300 to-blue-500'
  },
  [BadgeType.DIAMOND]: {
    type: BadgeType.DIAMOND,
    name: 'Diamond Elite',
    description: 'Awarded for earning 1000 points',
    requiredPoints: 1000,
    icon: '👑',
    color: '#B9F2FF',
    gradient: 'from-purple-400 to-pink-600'
  }
};

/**
 * Get all badge definitions sorted by required points
 */
export function getAllBadges(): Badge[] {
  return Object.values(BADGE_DEFINITIONS).sort(
    (a, b) => a.requiredPoints - b.requiredPoints
  );
}

/**
 * Get badge for a specific tier
 */
export function getBadge(type: BadgeType): Badge {
  return { ...BADGE_DEFINITIONS[type] };
}

/**
 * Determine which badges a student has earned based on their points
 * @param totalPoints - Student's total points
 * @returns Array of earned badges with earnedDate
 */
export function getEarnedBadges(totalPoints: number): Badge[] {
  const allBadges = getAllBadges();
  const earned: Badge[] = [];

  for (const badge of allBadges) {
    if (totalPoints >= badge.requiredPoints) {
      earned.push({
        ...badge,
        earnedDate: new Date().toISOString() // In production, this should come from stored data
      });
    }
  }

  return earned;
}

/**
 * Get the current (highest) badge for a student
 * @param totalPoints - Student's total points
 * @returns Current badge or null if no badges earned
 */
export function getCurrentBadge(totalPoints: number): Badge | null {
  const earnedBadges = getEarnedBadges(totalPoints);
  return earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;
}

/**
 * Get the next badge a student can earn
 * @param totalPoints - Student's total points
 * @returns Next badge or null if all badges earned
 */
export function getNextBadge(totalPoints: number): Badge | null {
  const allBadges = getAllBadges();
  
  for (const badge of allBadges) {
    if (totalPoints < badge.requiredPoints) {
      return badge;
    }
  }

  return null; // All badges earned!
}

/**
 * Calculate progress percentage to next badge
 * @param totalPoints - Student's total points
 * @returns Progress percentage (0-100)
 */
export function getProgressToNextBadge(totalPoints: number): number {
  const currentBadge = getCurrentBadge(totalPoints);
  const nextBadge = getNextBadge(totalPoints);

  if (!nextBadge) {
    return 100; // All badges earned
  }

  const previousThreshold = currentBadge?.requiredPoints || 0;
  const pointsInCurrentTier = totalPoints - previousThreshold;
  const pointsNeededForNext = nextBadge.requiredPoints - previousThreshold;

  const progress = (pointsInCurrentTier / pointsNeededForNext) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Get comprehensive badge information for a student
 * @param studentId - Student's unique ID
 * @param totalPoints - Student's total points
 * @returns Complete badge status
 */
export function getStudentBadgeStatus(studentId: string, totalPoints: number): StudentBadges {
  const earnedBadges = getEarnedBadges(totalPoints);
  const currentBadge = getCurrentBadge(totalPoints);
  const nextBadge = getNextBadge(totalPoints);
  const progressToNext = getProgressToNextBadge(totalPoints);

  // Load saved badge earned dates from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`studentBadges_${studentId}`);
    if (saved) {
      const savedBadges: StudentBadges = JSON.parse(saved);
      
      // Merge earned dates with current badges
      earnedBadges.forEach(badge => {
        const savedBadge = savedBadges.badges.find(b => b.type === badge.type);
        if (savedBadge?.earnedDate) {
          badge.earnedDate = savedBadge.earnedDate;
        }
      });
    }
  }

  const badgeStatus: StudentBadges = {
    studentId,
    badges: earnedBadges,
    currentBadge,
    nextBadge,
    progressToNext
  };

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`studentBadges_${studentId}`, JSON.stringify(badgeStatus));
  }

  return badgeStatus;
}

/**
 * Check if a new badge was just earned
 * @param studentId - Student's unique ID
 * @param oldPoints - Previous point total
 * @param newPoints - New point total
 * @returns Newly earned badge or null
 */
export function checkNewBadgeEarned(
  studentId: string,
  oldPoints: number,
  newPoints: number
): Badge | null {
  const oldBadge = getCurrentBadge(oldPoints);
  const newBadge = getCurrentBadge(newPoints);

  // Check if a new badge was earned
  if (newBadge && (!oldBadge || newBadge.requiredPoints > oldBadge.requiredPoints)) {
    // Save the earned date
    const badgeToSave = { ...newBadge, earnedDate: new Date().toISOString() };
    
    if (typeof window !== 'undefined') {
      const status = getStudentBadgeStatus(studentId, newPoints);
      // Find and update the earned date for this specific badge
      const badgeIndex = status.badges.findIndex(b => b.type === newBadge.type);
      if (badgeIndex !== -1) {
        status.badges[badgeIndex] = badgeToSave;
        localStorage.setItem(`studentBadges_${studentId}`, JSON.stringify(status));
      }
    }

    return badgeToSave;
  }

  return null;
}

/**
 * Get points needed for next badge
 * @param totalPoints - Student's total points
 * @returns Points needed or 0 if all badges earned
 */
export function getPointsNeededForNextBadge(totalPoints: number): number {
  const nextBadge = getNextBadge(totalPoints);
  return nextBadge ? nextBadge.requiredPoints - totalPoints : 0;
}

/**
 * Get badge color class for Tailwind CSS
 * @param badge - Badge object
 * @returns Tailwind gradient class string
 */
export function getBadgeGradientClass(badge: Badge | null): string {
  if (!badge) return 'from-gray-400 to-gray-600';
  return badge.gradient;
}

/**
 * Get badge emoji icon
 * @param badge - Badge object
 * @returns Emoji string
 */
export function getBadgeIcon(badge: Badge | null): string {
  if (!badge) return '⭐';
  return badge.icon;
}

/**
 * Format badge display name
 * @param badge - Badge object
 * @param includeIcon - Whether to include the emoji icon
 * @returns Formatted badge name
 */
export function formatBadgeName(badge: Badge | null, includeIcon: boolean = true): string {
  if (!badge) return 'No Badge';
  return includeIcon ? `${badge.icon} ${badge.name}` : badge.name;
}

/**
 * Get all students with specific badge
 * @param badgeType - Badge type to filter by
 * @returns Array of student IDs with this badge
 */
export function getStudentsWithBadge(badgeType: BadgeType): string[] {
  if (typeof window === 'undefined') return [];

  const studentsWithBadge: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('studentBadges_')) {
      const data = localStorage.getItem(key);
      if (data) {
        const badgeStatus: StudentBadges = JSON.parse(data);
        if (badgeStatus.badges.some(b => b.type === badgeType)) {
          studentsWithBadge.push(badgeStatus.studentId);
        }
      }
    }
  }

  return studentsWithBadge;
}

/**
 * Get badge statistics
 */
export function getBadgeStatistics(): Record<BadgeType, number> {
  const stats: Record<BadgeType, number> = {
    [BadgeType.BRONZE]: 0,
    [BadgeType.SILVER]: 0,
    [BadgeType.GOLD]: 0,
    [BadgeType.PLATINUM]: 0,
    [BadgeType.DIAMOND]: 0
  };

  if (typeof window === 'undefined') return stats;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('studentBadges_')) {
      const data = localStorage.getItem(key);
      if (data) {
        const badgeStatus: StudentBadges = JSON.parse(data);
        badgeStatus.badges.forEach(badge => {
          stats[badge.type]++;
        });
      }
    }
  }

  return stats;
}

/**
 * Reset all badge data (admin function)
 */
export function resetAllBadges(): void {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('studentBadges_')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}
