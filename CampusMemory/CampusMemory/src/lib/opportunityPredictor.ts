/**
 * Missed Opportunity Predictor Module
 * 
 * This module provides AI-driven matching logic to identify events that students
 * might miss based on their interests, department, and past participation.
 * 
 * Match Calculation Weighting:
 * - 40% Student interests/categories
 * - 30% Department/branch alignment
 * - 30% Past participation patterns
 */

export interface Event {
  id?: string;
  name: string;
  category?: string;
  department?: string;
  tags?: string[];
  registration_deadline?: string;
  type?: string;
}

export interface Student {
  id?: string;
  name?: string;
  branch?: string;
  department?: string;
  interests?: string[];
  pastEvents?: string[];
  program?: string;
}

export interface MatchResult {
  percentage: number;
  matchingFactors: {
    interests: number;
    department: number;
    pastParticipation: number;
  };
  primaryInterest: string;
}

/**
 * Calculate match percentage between an event and a student
 * @param event - Event object
 * @param student - Student profile
 * @returns Match result with percentage and breakdown
 */
export function calculateMatch(event: Event, student: Student): MatchResult {
  let interestScore = 0;
  let departmentScore = 0;
  let pastParticipationScore = 0;
  let primaryInterest = event.category || event.type || "this category";

  // 1. Interest/Category Matching (40% weight)
  if (student.interests && student.interests.length > 0) {
    const eventCategories = [
      event.category?.toLowerCase(),
      event.type?.toLowerCase(),
      ...(event.tags || []).map(t => t.toLowerCase())
    ].filter((cat): cat is string => typeof cat === 'string');

    const studentInterests = student.interests.map(i => i.toLowerCase());
    
    const matchingInterests = eventCategories.filter(cat => 
      studentInterests.some(interest => 
        cat.includes(interest) || interest.includes(cat)
      )
    );

    if (matchingInterests.length > 0) {
      interestScore = Math.min(100, (matchingInterests.length / eventCategories.length) * 100);
      primaryInterest = matchingInterests[0] || primaryInterest;
    }
  } else {
    // Default interest score if no student interests defined
    interestScore = 50;
  }

  // 2. Department/Branch Matching (30% weight)
  const studentDept = (student.branch || student.department || student.program || "").toLowerCase();
  const eventDept = (event.department || "").toLowerCase();
  
  if (studentDept && eventDept) {
    if (studentDept.includes(eventDept) || eventDept.includes(studentDept)) {
      departmentScore = 100;
    } else if (eventDept.includes("all") || eventDept.includes("general")) {
      departmentScore = 80;
    } else {
      departmentScore = 30; // Some events are still valuable cross-department
    }
  } else {
    // If no department specified, assume it's open to all
    departmentScore = 75;
  }

  // 3. Past Participation Patterns (30% weight)
  if (student.pastEvents && student.pastEvents.length > 0) {
    // Check if student has attended similar events
    const similarPastEvents = student.pastEvents.filter(pastEventId => {
      // This is a simplified check - in a real system, you'd fetch past event details
      // and compare categories/types
      return pastEventId.toLowerCase().includes(event.category?.toLowerCase() || "");
    });

    if (similarPastEvents.length > 0) {
      pastParticipationScore = Math.min(100, (similarPastEvents.length * 25));
    } else if (student.pastEvents.length > 0) {
      // Student is active but hasn't attended this type before - moderate score
      pastParticipationScore = 60;
    } else {
      // No past participation data
      pastParticipationScore = 50;
    }
  } else {
    // New student or no tracking - give benefit of doubt
    pastParticipationScore = 50;
  }

  // Calculate weighted total
  const totalPercentage = Math.round(
    (interestScore * 0.4) + 
    (departmentScore * 0.3) + 
    (pastParticipationScore * 0.3)
  );

  return {
    percentage: totalPercentage,
    matchingFactors: {
      interests: Math.round(interestScore),
      department: Math.round(departmentScore),
      pastParticipation: Math.round(pastParticipationScore)
    },
    primaryInterest
  };
}

/**
 * Check if an event's registration is closing soon (24-48 hours)
 * @param event - Event object
 * @returns true if closing in 24-48 hours
 */
export function isClosingSoon(event: Event): boolean {
  if (!event.registration_deadline) {
    return false;
  }

  const now = new Date();
  const deadline = new Date(event.registration_deadline);
  const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilDeadline >= 24 && hoursUntilDeadline <= 48;
}

/**
 * Check if we should show AI recommendation for this event
 * @param event - Event object
 * @param student - Student profile
 * @returns true if match >= 70% and closing soon
 */
export function shouldShowRecommendation(event: Event, student: Student): boolean {
  const match = calculateMatch(event, student);
  const closingSoon = isClosingSoon(event);
  
  return match.percentage >= 70 && closingSoon;
}

/**
 * Get formatted alert message for an event
 * @param event - Event object
 * @param student - Student profile
 * @returns Formatted alert message
 */
export function getAlertMessage(event: Event, student: Student): string {
  const match = calculateMatch(event, student);
  return `Based on your interest in ${match.primaryInterest}, this event matches your profile by ${match.percentage}%. Registration closes soon.`;
}

/**
 * Manage dismissed alerts (session-based or localStorage)
 */
export class AlertManager {
  private static STORAGE_KEY = 'dismissedAlerts';
  private dismissedAlerts: Set<string>;

  constructor() {
    this.dismissedAlerts = this.loadDismissedAlerts();
  }

  private loadDismissedAlerts(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    
    try {
      const stored = localStorage.getItem(AlertManager.STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }

  private saveDismissedAlerts(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        AlertManager.STORAGE_KEY,
        JSON.stringify([...this.dismissedAlerts])
      );
    } catch (error) {
      console.error('Failed to save dismissed alerts:', error);
    }
  }

  isDismissed(eventId: string): boolean {
    return this.dismissedAlerts.has(eventId);
  }

  dismiss(eventId: string): void {
    this.dismissedAlerts.add(eventId);
    this.saveDismissedAlerts();
  }

  clearAll(): void {
    this.dismissedAlerts.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AlertManager.STORAGE_KEY);
    }
  }

  clearExpired(): void {
    // In a real implementation, you'd check event deadlines
    // For now, just clear all after 7 days
    const lastClear = localStorage.getItem('lastAlertClear');
    const now = Date.now();
    
    if (!lastClear || (now - parseInt(lastClear)) > 7 * 24 * 60 * 60 * 1000) {
      this.clearAll();
      localStorage.setItem('lastAlertClear', now.toString());
    }
  }
}
