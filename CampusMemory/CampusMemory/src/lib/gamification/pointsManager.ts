/**
 * Points Manager Module
 * 
 * Manages point allocation, calculation, and updates for the gamification system.
 * 
 * Point Values by Event Type:
 * - Workshop: 10 points
 * - Hackathon: 20 points
 * - Seminar: 5 points
 * - Conference: 15 points
 * - Competition: 25 points
 * - Cultural Event: 8 points
 * - Sports Event: 10 points
 * - Tech Talk: 12 points
 */

interface EventType {
  type: string;
  points: number;
}

interface StudentPoints {
  studentId: string;
  studentName: string;
  totalPoints: number;
  eventHistory: Array<{
    eventId: string;
    eventName: string;
    eventType: string;
    points: number;
    date: string;
  }>;
}

// Event type to points mapping
const EVENT_POINTS: Record<string, number> = {
  workshop: 10,
  hackathon: 20,
  seminar: 5,
  conference: 15,
  competition: 25,
  cultural: 8,
  sports: 10,
  'tech talk': 12,
  webinar: 7,
  orientation: 5,
  networking: 10,
  default: 5 // Default points for unclassified events
};

/**
 * Get points for a specific event type
 * @param eventType - Type of the event
 * @returns Points value for the event type
 */
export function getPointsForEventType(eventType: string): number {
  const normalizedType = eventType.toLowerCase().trim();
  return EVENT_POINTS[normalizedType] || EVENT_POINTS.default;
}

/**
 * Calculate total points for a student
 * @param studentId - Student's unique ID
 * @returns Total points accumulated
 */
export function getStudentPoints(studentId: string): StudentPoints {
  if (typeof window === 'undefined') {
    return {
      studentId,
      studentName: '',
      totalPoints: 0,
      eventHistory: []
    };
  }

  const stored = localStorage.getItem(`studentPoints_${studentId}`);
  if (stored) {
    return JSON.parse(stored);
  }

  // Initialize new student points record
  return {
    studentId,
    studentName: '',
    totalPoints: 0,
    eventHistory: []
  };
}

/**
 * Add points to a student for participating in an event
 * @param studentId - Student's unique ID
 * @param studentName - Student's name
 * @param eventId - Event's unique ID
 * @param eventName - Event name
 * @param eventType - Event type
 * @returns Updated student points record
 */
export function addPointsForParticipation(
  studentId: string,
  studentName: string,
  eventId: string,
  eventName: string,
  eventType: string
): StudentPoints {
  const studentPoints = getStudentPoints(studentId);
  const points = getPointsForEventType(eventType);

  // Check if student already has points for this event (prevent duplicates)
  const alreadyParticipated = studentPoints.eventHistory.some(
    event => event.eventId === eventId
  );

  if (alreadyParticipated) {
    console.warn(`Student ${studentId} already has points for event ${eventId}`);
    return studentPoints;
  }

  // Add new event to history
  studentPoints.studentName = studentName;
  studentPoints.eventHistory.push({
    eventId,
    eventName,
    eventType,
    points,
    date: new Date().toISOString()
  });

  // Update total points
  studentPoints.totalPoints += points;

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`studentPoints_${studentId}`, JSON.stringify(studentPoints));
    updateLeaderboard(studentPoints);
  }

  return studentPoints;
}

/**
 * Remove points from a student (e.g., if attendance was marked incorrectly)
 * @param studentId - Student's unique ID
 * @param eventId - Event's unique ID
 * @returns Updated student points record
 */
export function removePointsForEvent(studentId: string, eventId: string): StudentPoints {
  const studentPoints = getStudentPoints(studentId);

  const eventIndex = studentPoints.eventHistory.findIndex(
    event => event.eventId === eventId
  );

  if (eventIndex === -1) {
    console.warn(`No points found for student ${studentId} and event ${eventId}`);
    return studentPoints;
  }

  // Remove points from total
  const removedEvent = studentPoints.eventHistory[eventIndex];
  studentPoints.totalPoints -= removedEvent.points;

  // Remove event from history
  studentPoints.eventHistory.splice(eventIndex, 1);

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`studentPoints_${studentId}`, JSON.stringify(studentPoints));
    updateLeaderboard(studentPoints);
  }

  return studentPoints;
}

/**
 * Get all students' points for leaderboard
 * @returns Array of all student points sorted by total points (descending)
 */
export function getAllStudentPoints(): StudentPoints[] {
  if (typeof window === 'undefined') return [];

  const allPoints: StudentPoints[] = [];
  
  // Iterate through localStorage to find all student points
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('studentPoints_')) {
      const data = localStorage.getItem(key);
      if (data) {
        allPoints.push(JSON.parse(data));
      }
    }
  }

  // Sort by total points (descending)
  return allPoints.sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Update centralized leaderboard data
 * @param studentPoints - Updated student points
 */
function updateLeaderboard(studentPoints: StudentPoints): void {
  const leaderboard = getAllStudentPoints();
  
  // Save centralized leaderboard for quick access
  if (typeof window !== 'undefined') {
    localStorage.setItem('campusLeaderboard', JSON.stringify(leaderboard));
  }
}

/**
 * Get student rank
 * @param studentId - Student's unique ID
 * @returns Rank (1-based) or 0 if not found
 */
export function getStudentRank(studentId: string): number {
  const leaderboard = getAllStudentPoints();
  const rank = leaderboard.findIndex(student => student.studentId === studentId);
  return rank === -1 ? 0 : rank + 1;
}

/**
 * Get top N students
 * @param limit - Number of top students to return
 * @returns Top N students by points
 */
export function getTopStudents(limit: number = 10): StudentPoints[] {
  const leaderboard = getAllStudentPoints();
  return leaderboard.slice(0, limit);
}

/**
 * Reset all points (admin function)
 */
export function resetAllPoints(): void {
  if (typeof window === 'undefined') return;

  // Remove all student points from localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('studentPoints_') || key === 'campusLeaderboard')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Export points data (for admin/analytics)
 */
export function exportPointsData(): string {
  const allPoints = getAllStudentPoints();
  return JSON.stringify(allPoints, null, 2);
}

/**
 * Get points statistics
 */
export function getPointsStatistics(): {
  totalStudents: number;
  totalPoints: number;
  averagePoints: number;
  highestPoints: number;
  lowestPoints: number;
} {
  const allPoints = getAllStudentPoints();
  
  if (allPoints.length === 0) {
    return {
      totalStudents: 0,
      totalPoints: 0,
      averagePoints: 0,
      highestPoints: 0,
      lowestPoints: 0
    };
  }

  const totalPoints = allPoints.reduce((sum, student) => sum + student.totalPoints, 0);
  
  return {
    totalStudents: allPoints.length,
    totalPoints,
    averagePoints: Math.round(totalPoints / allPoints.length),
    highestPoints: allPoints[0]?.totalPoints || 0,
    lowestPoints: allPoints[allPoints.length - 1]?.totalPoints || 0
  };
}
