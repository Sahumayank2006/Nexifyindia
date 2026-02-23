"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  Target,
  Zap,
  BookOpen,
  Trophy,
  X,
  Sparkles,
  Shield,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import {
  campusAPI,
  type EventInfo,
  type EventRecommendation,
  type EventGuidance,
  type StudentProfile,
} from "@/lib/api";
import { images, getEventImage } from "@/lib/images";

interface EventsProps {
  currentStudent: any;
  onLogin: () => void;
}

export default function Events({ currentStudent, onLogin }: EventsProps) {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [recommendations, setRecommendations] = useState<EventRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
  const [guidance, setGuidance] = useState<EventGuidance | null>(null);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadEvents();
    if (currentStudent) {
      loadRecommendations();
    }
  }, [currentStudent]);

  const loadEvents = async () => {
    try {
      const response = await campusAPI.getAllEvents();
      setEvents(response.events);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    if (!currentStudent) return;

    try {
      const studentProfile: StudentProfile = {
        branch: currentStudent.branch || "CSE",
        year: currentStudent.year || 2,
        gender: currentStudent.gender || "Other",
        skill_level: currentStudent.skillLevel || "Intermediate",
      };

      const response = await campusAPI.getEventRecommendations(studentProfile, 8);
      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  };

  const handleEventClick = async (event: EventInfo) => {
    setSelectedEvent(event);
    
    if (currentStudent) {
      try {
        const studentProfile: StudentProfile = {
          branch: currentStudent.branch || "CSE",
          year: currentStudent.year || 2,
          gender: currentStudent.gender || "Other",
          skill_level: currentStudent.skillLevel || "Intermediate",
        };

        const response = await campusAPI.getEventGuidance(studentProfile, event.name);
        setGuidance(response.guidance);
      } catch (error) {
        console.error("Failed to load guidance:", error);
      }
    }
    
    setShowGuidanceModal(true);
  };

  const handleRegister = async () => {
    if (!currentStudent || !selectedEvent) {
      onLogin();
      return;
    }

    setRegistering(true);
    try {
      const studentProfile: StudentProfile = {
        branch: currentStudent.branch || "CSE",
        year: currentStudent.year || 2,
        gender: currentStudent.gender || "Other",
        skill_level: currentStudent.skillLevel || "Intermediate",
      };

      await campusAPI.registerForEvent(selectedEvent.id, studentProfile);
      
      alert(`Successfully registered for ${selectedEvent.name}!`);
      setShowGuidanceModal(false);
      loadEvents(); // Refresh event data
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const getRecommendationForEvent = (eventName: string) => {
    return recommendations.find(r => r.event_name === eventName);
  };

  const filteredEvents = filter === "all"
    ? events
    : events.filter(e => e.type === filter);

  const eventTypes = ["all", ...Array.from(new Set(events.map(e => e.type)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">Campus Events</h1>
          </div>
          <p className="text-xl text-gray-300">
            {currentStudent ? "ML-Powered Recommendations Just for You" : "Discover Amazing Events"}
          </p>
        </motion.div>

        {/* ML Recommendations Section */}
        {currentStudent && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header with ML Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={images.ml.aiNetwork}
                  alt="AI-Powered Recommendations"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                      <h2 className="text-4xl font-bold text-white">
                        AI Recommendations
                      </h2>
                      <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                    </div>
                    <p className="text-white/90 text-lg">
                      Based on 100,000+ student feedback records
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 4).map((rec, idx) => {
                  const event = events.find(e => e.name === rec.event_name);
                  if (!event) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleEventClick(event)}
                      className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all"
                    >
                      {/* Event Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={getEventImage(rec.event_type)}
                          alt={rec.event_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {(rec.recommendation_probability * 100).toFixed(0)}%
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {rec.event_name}
                          </h3>
                          <span className="text-sm text-white/70">
                            {rec.event_type}
                          </span>
                        </div>
                      
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-green-300" />
                          <span className="text-sm text-white">
                            {rec.predicted_satisfaction.toFixed(1)}/10 predicted satisfaction
                          </span>
                        </div>
                      
                      <div className="space-y-1">
                        {rec.why_recommended.slice(0, 2).map((reason, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-white/80">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === type
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => {
            const recommendation = getRecommendationForEvent(event.name);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleEventClick(event)}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all border border-white/20 relative group"
              >
                {/* Event Header Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getEventImage(event.type)}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {recommendation && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" />
                      {(recommendation.recommendation_probability * 100).toFixed(0)}%
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
                    <div className="flex items-center gap-2 text-purple-300">
                      <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">{event.type}</span>
                      <span>•</span>
                      <span className="text-sm">{event.level}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6"
>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{event.registrations}/{event.max_participants} registered</span>
                  </div>
                  {event.prizes && (
                    <div className="flex items-center gap-2 text-green-300">
                      <Trophy className="w-4 h-4" />
                      <span>{event.prizes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-sm font-semibold">
                      {event.organizer}
                    </span>
                    <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Event Details Modal */}
        <AnimatePresence>
          {showGuidanceModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowGuidanceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {selectedEvent.name}
                    </h2>
                    <div className="flex items-center gap-3 text-purple-300">
                      <span>{selectedEvent.type}</span>
                      <span>•</span>
                      <span>{selectedEvent.level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuidanceModal(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                {guidance && currentStudent && (
                  <div className="space-y-6 mb-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {guidance.total_past_attendees.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-300">Past Attendees</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {guidance.overall_satisfaction.toFixed(1)}/10
                        </div>
                        <div className="text-sm text-gray-300">Avg Satisfaction</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {guidance.recommendation_rate.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-300">Would Recommend</div>
                      </div>
                    </div>

                    {/* Common Issues */}
                    {guidance.common_issues.length > 0 && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                          <h3 className="text-xl font-bold text-white">Common Issues</h3>
                        </div>
                        <div className="space-y-2">
                          {guidance.common_issues.slice(0, 5).map((issue, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                              <div>
                                <span className="text-white font-semibold">{issue.issue}</span>
                                <span className="text-gray-300 text-sm ml-2">
                                  ({issue.percentage.toFixed(1)}% reported)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {guidance.recommendations.length > 0 && (
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Lightbulb className="w-6 h-6 text-blue-400" />
                          <h3 className="text-xl font-bold text-white">Recommendations</h3>
                        </div>
                        <div className="space-y-3">
                          {guidance.recommendations.slice(0, 5).map((rec, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  rec.priority === 'High' ? 'bg-red-500' :
                                  rec.priority === 'Medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                } text-white`}>
                                  {rec.priority}
                                </span>
                                <span className="text-purple-300 font-semibold">
                                  {rec.category}
                                </span>
                              </div>
                              <p className="text-white">{rec.advice}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success Tips */}
                    {guidance.success_tips.length > 0 && (
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Trophy className="w-6 h-6 text-green-400" />
                          <h3 className="text-xl font-bold text-white">Success Tips</h3>
                        </div>
                        <div className="space-y-2">
                          {guidance.success_tips.slice(0, 5).map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                              <span className="text-white">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Registration Button */}
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {registering ? "Registering..." : "Register Now"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
