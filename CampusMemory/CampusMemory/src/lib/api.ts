// API Configuration for Campus Memory
// Connects Next.js frontend to Python FastAPI backend via Next.js proxy

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface StudentProfile {
  branch: string;
  year: number;
  gender: string;
  skill_level: string;
  age?: number;
  previous_participation?: string;
  team_size?: number;
  participated_alone?: number;
  achievement?: string;
}

export interface EventInfo {
  id: string;
  name: string;
  type: string;
  level: string;
  duration_days: number;
  description?: string;
  date?: string;
  location?: string;
  registrations?: number;
  max_participants?: number;
  prizes?: string;
  organizer?: string;
  contact?: string;
}

export interface EventRecommendation {
  event_name: string;
  event_type: string;
  recommendation_probability: number;
  confidence_level: string;
  predicted_satisfaction: number;
  ranking: number;
  match_score: number;
  why_recommended: string[];
}

export interface EventGuidance {
  event_name: string;
  event_type: string;
  total_past_attendees: number;
  overall_satisfaction: number;
  recommendation_rate: number;
  common_issues: Array<{
    issue: string;
    reported_by: number;
    percentage: number;
  }>;
  areas_of_concern: Array<{
    area: string;
    average_rating: number;
    severity: string;
  }>;
  strengths: Array<{
    area: string;
    average_rating: number;
  }>;
  recommendations: Array<{
    priority: string;
    category: string;
    advice: string;
  }>;
  success_tips: string[];
  expectations: any;
  preparation: any;
}

class CampusMemoryAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }

  // ML Endpoints
  async getEventRecommendations(
    student: StudentProfile,
    topN: number = 5
  ): Promise<{ recommendations: EventRecommendation[] }> {
    const response = await fetch(`${this.baseUrl}/api/ml/recommend-events?top_n=${topN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventGuidance(
    student: StudentProfile,
    eventName: string
  ): Promise<{ guidance: EventGuidance }> {
    const response = await fetch(
      `${this.baseUrl}/api/ml/event-guidance?event_name=${encodeURIComponent(eventName)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get event guidance: ${response.statusText}`);
    }

    return response.json();
  }

  async predictEventOutcome(
    student: StudentProfile,
    event: EventInfo
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/ml/predict-event-outcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student, event }),
    });

    if (!response.ok) {
      throw new Error(`Failed to predict outcome: ${response.statusText}`);
    }

    return response.json();
  }

  // Events Management
  async getAllEvents(): Promise<{ events: EventInfo[] }> {
    const response = await fetch(`${this.baseUrl}/api/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  async registerForEvent(
    eventId: string,
    student: StudentProfile
  ): Promise<{ event: EventInfo; guidance?: EventGuidance }> {
    const response = await fetch(`${this.baseUrl}/api/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error(`Failed to register for event: ${response.statusText}`);
    }

    return response.json();
  }

  // Campus Data Management
  async getProblems(collegeId: string, category?: string): Promise<any> {
    const url = category
      ? `${this.baseUrl}/api/colleges/${collegeId}/problems?category=${category}`
      : `${this.baseUrl}/api/colleges/${collegeId}/problems`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch problems');
    return response.json();
  }

  async createProblem(collegeId: string, problem: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/colleges/${collegeId}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    });

    if (!response.ok) throw new Error('Failed to create problem');
    return response.json();
  }

  async updateProblem(collegeId: string, problemId: string, problem: any): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/colleges/${collegeId}/problems/${problemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problem),
      }
    );

    if (!response.ok) throw new Error('Failed to update problem');
    return response.json();
  }

  async deleteProblem(collegeId: string, problemId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/colleges/${collegeId}/problems/${problemId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) throw new Error('Failed to delete problem');
    return response.json();
  }

  async getWisdom(collegeId: string, category?: string): Promise<any> {
    const url = category
      ? `${this.baseUrl}/api/colleges/${collegeId}/wisdom?category=${category}`
      : `${this.baseUrl}/api/colleges/${collegeId}/wisdom`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch wisdom');
    return response.json();
  }

  async createWisdom(collegeId: string, wisdom: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/colleges/${collegeId}/wisdom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wisdom),
    });

    if (!response.ok) throw new Error('Failed to create wisdom');
    return response.json();
  }

  async getAlerts(collegeId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/colleges/${collegeId}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  }

  async createAlert(collegeId: string, alert: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/colleges/${collegeId}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    });

    if (!response.ok) throw new Error('Failed to create alert');
    return response.json();
  }

  async getAnalytics(collegeId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/colleges/${collegeId}/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  }
}

// Export singleton instance
export const campusAPI = new CampusMemoryAPI();
