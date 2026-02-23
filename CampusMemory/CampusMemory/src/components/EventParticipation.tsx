"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  MapPin,
  Search,
  Filter,
  Star,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Zap,
  LineChart,
  X,
  BarChart3,
  PieChart,
  TrendingDown,
  DollarSign,
  Activity,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trophy,
} from "lucide-react";

interface EventFormData {
  eventType: string;
  eventName: string;
  skillLevel: string;
  teamSize: string;
  description: string;
}

interface PastEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  participants: number;
  satisfaction: number;
  image: string;
  problems: string[];
  solutions: string[];
  outcomes: string[];
  budget: string;
  recommendations: string[];
  roadmap: { phase: string; duration: string; tasks: string[] }[];
}

const pastEventsData: PastEvent[] = [
  {
    id: "1",
    name: "Tech Symposium 2025",
    type: "Technical",
    date: "January 2025",
    participants: 450,
    satisfaction: 4.5,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    problems: [
      "Registration chaos - long queues",
      "Poor audio system in auditorium",
      "Insufficient parking space",
      "Limited food stalls causing delays"
    ],
    solutions: [
      "Implemented QR code-based digital registration",
      "Upgraded sound system with backup",
      "Arranged overflow parking at nearby ground",
      "Pre-booking system for food with 3 extra stalls"
    ],
    outcomes: [
      "450 participants - exceeded target by 50%",
      "Generated ₹2.5L sponsorship revenue",
      "15 companies participated in job fair",
      "92% positive feedback rating"
    ],
    budget: "₹3.2 Lakhs",
    recommendations: [
      "Start promotion 3 weeks earlier",
      "Partner with local transport for parking",
      "Have technical team on standby",
      "Create mobile app for event navigation"
    ],
    roadmap: [
      {
        phase: "Planning Phase",
        duration: "Week 1-2",
        tasks: [
          "Form organizing committee with clear roles",
          "Book venue and confirm technical requirements",
          "Create event budget and sponsorship deck",
          "Design promotional materials and social media strategy"
        ]
      },
      {
        phase: "Promotion Phase",
        duration: "Week 3-4",
        tasks: [
          "Launch social media campaigns",
          "Reach out to potential sponsors and speakers",
          "Set up online registration portal",
          "Organize pre-event meetups to build buzz"
        ]
      },
      {
        phase: "Execution Phase",
        duration: "Week 5-6",
        tasks: [
          "Conduct dress rehearsal 2 days before",
          "Set up registration desk and signage",
          "Coordinate with vendors and technical team",
          "Execute event with backup plans ready"
        ]
      },
      {
        phase: "Post-Event Phase",
        duration: "Week 7",
        tasks: [
          "Collect feedback from participants",
          "Share photos and highlights on social media",
          "Send thank you notes to sponsors and speakers",
          "Document learnings and recommendations"
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Cultural Fest Euphoria",
    type: "Cultural",
    date: "December 2024",
    participants: 800,
    satisfaction: 4.7,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    problems: [
      "Stage lighting malfunctioned during performance",
      "Crowd management issues at entry",
      "Delays in event schedule by 2 hours"
    ],
    solutions: [
      "Backup lighting system installed",
      "Professional security team hired with barricades",
      "Buffer time added between events"
    ],
    outcomes: [
      "Highest footfall in college history - 800+",
      "Featured in local news channels",
      "Cultural exchange with 5 colleges",
      "Memorableexperiences with professional photography"
    ],
    budget: "₹5.5 Lakhs",
    recommendations: [
      "Book vendors 1 month in advance",
      "Create detailed minute-by-minute schedule",
      "Designate specific team for each activity",
      "Set up first-aid station prominently"
    ],
    roadmap: [
      {
        phase: "Pre-Planning",
        duration: "Month 1",
        tasks: [
          "Select theme and create mood boards",
          "Book performers and cultural groups",
          "Secure sponsorships from local businesses",
          "Form sub-committees for decor, food, security"
        ]
      },
      {
        phase: "Preparation",
        duration: "Month 2",
        tasks: [
          "Design stage setup and lighting plan",
          "Arrange accommodation for outstation participants",
          "Create detailed event schedule",
          "Start ticket sales and registrations"
        ]
      },
      {
        phase: "Final Week",
        duration: "Week before event",
        tasks: [
          "Conduct technical rehearsals",
          "Set up venue with decorations",
          "Brief security and volunteer teams",
          "Test all equipment and backup systems"
        ]
      },
      {
        phase: "Event Days",
        duration: "3 Days",
        tasks: [
          "Execute events as per schedule",
          "Manage crowd and ensure safety",
          "Live social media coverage",
          "Handle issues with contingency plans"
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Sports Championship 2024",
    type: "Sports",
    date: "November 2024",
    participants: 350,
    satisfaction: 4.3,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    problems: [
      "Scoreboard system crashed during finals",
      "Inadequate hydration stations",
      "Lack of physiotherapy support"
    ],
    solutions: [
      "Manual backup scoring system prepared",
      "Added 5 more water stations",
      "Tied up with local sports clinic"
    ],
    outcomes: [
      "350 athletes from 12 colleges",
      "2 state-level players discovered",
      "Inter-college sports network established"
    ],
    budget: "₹2.8 Lakhs",
    recommendations: [
      "Test all digital systems day before",
      "Medical team mandatory for sports events",
      "Live streaming for parents and alumni",
      "Post-event medical check-up camp"
    ],
    roadmap: [
      {
        phase: "Organization",
        duration: "Week 1-2",
        tasks: [
          "Form sports committee and select events",
          "Book sports facilities and equipment",
          "Tie-up with medical clinic for support",
          "Design tournament brackets and rules"
        ]
      },
      {
        phase: "Registration",
        duration: "Week 3",
        tasks: [
          "Open registrations for all colleges",
          "Collect participant medical certificates",
          "Arrange accommodation for outstation teams",
          "Confirm schedule with participating colleges"
        ]
      },
      {
        phase: "Preparation",
        duration: "Week 4",
        tasks: [
          "Prepare playing fields and courts",
          "Set up scoreboard and timing systems",
          "Arrange referees and umpires",
          "Stock up on sports first-aid supplies"
        ]
      },
      {
        phase: "Championship Days",
        duration: "2-3 Days",
        tasks: [
          "Conduct opening ceremony",
          "Execute matches as per schedule",
          "Provide hydration and medical support",
          "Hold awards ceremony and closing event"
        ]
      }
    ]
  },
  {
    id: "4",
    name: "Hackathon CodeStorm",
    type: "Technical",
    date: "October 2024",
    participants: 200,
    satisfaction: 4.6,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    problems: [
      "WiFi bandwidth insufficient for 200 users",
      "Power backup failed during competition",
      "Judging criteria unclear causing disputes"
    ],
    solutions: [
      "Leased enterprise-grade internet connection",
      "Industrial UPS with diesel generator backup",
      "Published detailed rubric and sample submissions"
    ],
    outcomes: [
      "3 winning teams got internship offers",
      "₹50,000 prize money distributed",
      "2 startups emerged from projects"
    ],
    budget: "₹1.8 Lakhs",
    recommendations: [
      "Infrastructure dry-run 24 hours before",
      "Industry mentors for participant guidance",
      "Create problem statements with industry partners",
      "Follow-up incubation support for winners"
    ],
    roadmap: [
      {
        phase: "Setup Phase",
        duration: "Week 1-2",
        tasks: [
          "Partner with tech companies for sponsorship",
          "Design hackathon problem statements",
          "Book venue with high-speed internet",
          "Arrange power backup and workstations"
        ]
      },
      {
        phase: "Outreach",
        duration: "Week 3",
        tasks: [
          "Promote on coding communities and colleges",
          "Open registrations with team formation",
          "Recruit judges and mentors",
          "Share problem statements and rules"
        ]
      },
      {
        phase: "Pre-Hackathon",
        duration: "Week 4",
        tasks: [
          "Test all technical infrastructure",
          "Arrange food and refreshments for 36 hours",
          "Set up help desk and mentor stations",
          "Prepare judging rubrics and certificates"
        ]
      },
      {
        phase: "Hackathon Weekend",
        duration: "36 Hours",
        tasks: [
          "Conduct opening ceremony and team check-in",
          "Provide mentor support throughout",
          "Organize demo presentations and judging",
          "Award prizes and networking session"
        ]
      }
    ]
  },
  {
    id: "5",
    name: "AI/ML Workshop Series",
    type: "Workshop",
    date: "September 2024",
    participants: 120,
    satisfaction: 4.8,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    problems: [
      "Limited hands-on lab equipment",
      "Wide skill gap among participants",
      "Time constraint for practical sessions"
    ],
    solutions: [
      "Cloud-based lab setup for all participants",
      "Split into beginner and advanced batches",
      "Extended workshop from 1 day to 2 days"
    ],
    outcomes: [
      "100% completion rate with certificates",
      "15 participants built their first ML model",
      "Created dedicated AI/ML student community"
    ],
    budget: "₹80,000",
    recommendations: [
      "Pre-workshop skill assessment survey",
      "Provide pre-reading materials 1 week before",
      "Hands-on projects over theoretical lectures",
      "Follow-up mentorship sessions for 2 weeks"
    ],
    roadmap: [
      {
        phase: "Preparation",
        duration: "Week 1-2",
        tasks: [
          "Design workshop curriculum and projects",
          "Set up cloud computing environment",
          "Create learning materials and datasets",
          "Recruit experienced instructors"
        ]
      },
      {
        phase: "Registration",
        duration: "Week 3",
        tasks: [
          "Publish workshop details and prerequisite",
          "Conduct skill assessment for grouping",
          "Share pre-workshop learning resources",
          "Finalize participant list and send confirmations"
        ]
      },
      {
        phase: "Workshop Days",
        duration: "2 Days",
        tasks: [
          "Setup workstations with required software",
          "Conduct theory sessions with live demos",
          "Hands-on projects with mentor support",
          "Q&A and troubleshooting sessions"
        ]
      },
      {
        phase: "Post-Workshop",
        duration: "Week 4-5",
        tasks: [
          "Share presentation slides and code",
          "Certificate distribution to participants",
          "Setup follow-up mentorship schedule",
          "Collect feedback and testimonials"
        ]
      }
    ]
  },
  {
    id: "6",
    name: "Industry Connect Seminar",
    type: "Seminar",
    date: "August 2024",
    participants: 300,
    satisfaction: 4.4,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    problems: [
      "Poor acoustics in the auditorium",
      "Limited Q&A time with speakers",
      "Lack of networking opportunities post-seminar"
    ],
    solutions: [
      "Professional sound system with wireless mics",
      "Dedicated 30-minute Q&A after each talk",
      "Organized networking lunch with speed-networking format"
    ],
    outcomes: [
      "5 industry experts shared career insights",
      "60+ students got direct contact with professionals",
      "10 internship opportunities announced"
    ],
    budget: "₹1.2 Lakhs",
    recommendations: [
      "Interactive panel discussions over individual talks",
      "Prepare audience questions in advance",
      "Professional videography for future use",
      "Create LinkedIn group for continued networking"
    ],
    roadmap: [
      {
        phase: "Planning",
        duration: "Week 1-3",
        tasks: [
          "Identify and invite industry speakers",
          "Book auditorium with good acoustics",
          "Plan seminar structure and timing",
          "Design promotional materials"
        ]
      },
      {
        phase: "Promotion",
        duration: "Week 4-5",
        tasks: [
          "Announce speaker lineup on social media",
          "Open registrations with limited seats",
          "Share speaker profiles and topics",
          "Send reminders to registered participants"
        ]
      },
      {
        phase: "Execution Day",
        duration: "1 Day",
        tasks: [
          "Setup registration desk and signage",
          "Test audio-visual equipment",
          "Conduct sessions with Q&A segments",
          "Networking lunch and photo sessions"
        ]
      },
      {
        phase: "Follow-up",
        duration: "Week 6",
        tasks: [
          "Share session recordings and slides",
          "Connect students with speakers on LinkedIn",
          "Facilitate internship applications",
          "Plan next seminar based on feedback"
        ]
      }
    ]
  }
];

const eventTypes = [
  { value: "technical", label: "Technical", icon: Zap, color: "blue" },
  { value: "cultural", label: "Cultural", icon: Star, color: "purple" },
  { value: "sports", label: "Sports", icon: Award, color: "green" },
  { value: "workshop", label: "Workshop", icon: BookOpen, color: "orange" },
  { value: "seminar", label: "Seminar", icon: Users, color: "pink" },
];

export default function EventParticipation() {
  const [step, setStep] = useState<"form" | "insights">("form");
  const [formData, setFormData] = useState<EventFormData>({
    eventType: "",
    eventName: "",
    skillLevel: "",
    teamSize: "",
    description: "",
  });
  const [filteredEvents, setFilteredEvents] = useState<PastEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);

  const handleSubmit = () => {
    // Filter past events based on event type
    const relevant = pastEventsData.filter(
      (event) => event.type.toLowerCase() === formData.eventType.toLowerCase()
    );
    setFilteredEvents(relevant.length > 0 ? relevant : pastEventsData);
    setStep("insights");
  };

  const handleReset = () => {
    setStep("form");
    setFormData({
      eventType: "",
      eventName: "",
      skillLevel: "",
      teamSize: "",
      description: "",
    });
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-[#D4AF37] via-[#F4D03F] via-purple-600 to-[#D4AF37] text-white py-24 overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.6"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          {/* Animated Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 200%' }}
          ></motion.div>
        </div>
        
        {/* Floating Icons */}
        <motion.div
          className="absolute top-10 left-10 text-white/20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Calendar className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-white/20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Target className="w-20 h-20" />
        </motion.div>



        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AI-Powered Event Insights
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="relative inline-block">
                Learn From Past Events
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{
                    scaleX: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
              </span>
              <motion.span
                className="block mt-4 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                style={{ backgroundSize: '200% auto' }}
              >
                Make Yours Better ✨
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Before organizing your event, discover what worked and what didn't in similar events.
              Get insights, solutions, and recommendations from real experiences.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Event Form */}
              <div className="relative bg-gradient-to-br from-white via-purple-50/30 to-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-100/50 overflow-hidden">
                {/* Statistics Dashboard */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-6 h-6" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </motion.div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {pastEventsData.reduce((acc, e) => acc + e.participants, 0).toLocaleString()}
                    </div>
                    <div className="text-sm opacity-90">Total Participants</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-6 h-6" />
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {(pastEventsData.reduce((acc, e) => acc + e.satisfaction, 0) / pastEventsData.length).toFixed(1)}/5
                    </div>
                    <div className="text-sm opacity-90">Avg Rating</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-6 h-6" />
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{pastEventsData.length}</div>
                    <div className="text-sm opacity-90">Past Events</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Lightbulb className="w-6 h-6" />
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {pastEventsData.reduce((acc, e) => acc + e.solutions.length, 0)}
                    </div>
                    <div className="text-sm opacity-90">Solutions Found</div>
                  </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
                
                {/* Motivational Call-to-Action Card */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-4 right-4 max-w-xs"
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {/* Glowing Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    ></motion.div>

                    <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-6 shadow-2xl border-2 border-white/30">
                      {/* Floating Icons */}
                      <div className="absolute -top-3 -right-3 flex gap-2">
                        {['🎯', '🚀', '⭐'].map((emoji, i) => (
                          <motion.div
                            key={i}
                            className="text-3xl"
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 2 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>

                      {/* Sparkles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-yellow-300 text-xl"
                          style={{
                            top: `${(i * 20) % 100}%`,
                            left: `${(i * 25) % 100}%`,
                          }}
                          animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.25
                          }}
                        >
                          ✨
                        </motion.div>
                      ))}

                      {/* Main Content */}
                      <div className="relative z-10 text-center text-white">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        >
                          <div className="text-5xl mb-3">🎉</div>
                        </motion.div>
                        
                        <h3 className="text-2xl font-extrabold mb-2 drop-shadow-lg">
                          Make It Happen!
                        </h3>
                        
                        <p className="text-sm mb-4 leading-relaxed opacity-95">
                          Every great event starts with <span className="font-bold text-yellow-300">one brave idea</span>.
                          <br />
                          Yours could be next! 🌟
                        </p>

                        {/* Animated Stats */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <Users className="w-4 h-4" />
                              </motion.div>
                              <div>
                                <div className="font-bold text-lg">2.2K+</div>
                                <div className="opacity-90">Participants</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Trophy className="w-4 h-4" />
                              </motion.div>
                              <div>
                                <div className="font-bold text-lg">6</div>
                                <div className="opacity-90">Success Stories</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Motivational Quotes Carousel */}
                        <motion.div
                          key={Math.floor(Date.now() / 3000) % 3}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-xs italic opacity-90 mb-3"
                        >
                          {[
                            '"The best way to predict the future is to create it"',
                            '"Dream big, start small, act now"',
                            '"Your event could inspire hundreds"'
                          ][Math.floor(Date.now() / 3000) % 3]}
                        </motion.div>

                        {/* Call to Action Arrow */}
                        <motion.div
                          className="flex items-center justify-center gap-2 text-yellow-300 font-bold"
                          animate={{
                            x: [0, -10, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}
                        >
                          <span className="text-2xl">👇</span>
                          <span className="text-sm">Start Planning Below</span>
                        </motion.div>
                      </div>

                      {/* Pulse Ring Effect */}
                      <motion.div
                        className="absolute inset-0 border-4 border-yellow-300 rounded-3xl"
                        animate={{
                          scale: [1, 1.1],
                          opacity: [0.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="mb-10 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg"
                  >
                    🎯 Smart Event Planning
                  </motion.div>
                  <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
                    Tell Us About Your Event
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Fill in the details to get <span className="text-purple-600 font-semibold">AI-powered personalized insights</span> from similar past events
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Event Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Event Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {eventTypes.map((type, idx) => {
                        const Icon = type.icon;
                        const isSelected = formData.eventType === type.value;
                        return (
                          <motion.button
                            key={type.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setFormData({ ...formData, eventType: type.value })
                            }
                            className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden group ${
                              isSelected
                                ? `border-${type.color}-500 bg-gradient-to-br from-${type.color}-50 to-${type.color}-100 shadow-lg`
                                : "border-gray-200 hover:border-gray-400 bg-white hover:shadow-md"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="selectedType"
                                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              ></motion.div>
                            )}
                            <div className="relative z-10">
                              <motion.div
                                animate={isSelected ? { rotate: [0, -10, 10, -10, 0] } : {}}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon
                                  className={`w-7 h-7 mx-auto mb-2 transition-colors ${
                                    isSelected
                                      ? `text-${type.color}-600`
                                      : "text-gray-400 group-hover:text-gray-600"
                                  }`}
                                />
                              </motion.div>
                              <div className={`text-sm font-semibold transition-colors ${
                                isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                              }`}>{type.label}</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) =>
                        setFormData({ ...formData, eventName: e.target.value })
                      }
                      placeholder="e.g., Annual Tech Fest 2026"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Skill Level <span className="text-gray-400">(Optional)</span>
                      </label>
                      <select
                        value={formData.skillLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, skillLevel: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      >
                        <option value="">Select skill level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.teamSize}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            teamSize: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      >
                        <option value="">Select team size</option>
                        <option value="solo">Solo (1 person)</option>
                        <option value="small">Small (2-5 members)</option>
                        <option value="medium">Medium (6-15 members)</option>
                        <option value="large">Large (16-50 members)</option>
                        <option value="xlarge">Very Large (50+ members)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brief Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Describe what you want to achieve with this event..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!formData.eventType || !formData.eventName || !formData.teamSize}
                    className="relative w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl overflow-hidden group"
                    style={{ backgroundSize: '200% auto' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    ></motion.div>
                    <span className="relative z-10 text-lg">✨ Get AI-Powered Insights</span>
                    <motion.div
                      animate={{
                        x: [0, 5, 0]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity
                      }}
                      className="relative z-10"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Insights Display */}
              <div className="space-y-12 relative">


                {/* Floating Particles Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${(i * 13) % 100}%`,
                        top: `${(i * 17) % 100}%`,
                        background: i % 3 === 0 ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 
                                   i % 3 === 1 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' :
                                   'linear-gradient(135deg, #f59e0b, #ef4444)',
                      }}
                      animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 4 + (i % 3),
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                  ))}
                </div>
                {/* Header with Back Button */}
                <div className="relative mb-12">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-purple-100 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="inline-block mb-3 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-lg"
                        >
                          ✅ Analysis Complete
                        </motion.div>
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 bg-clip-text text-transparent mb-3">
                          Insights for "{formData.eventName}"
                        </h2>
                        <p className="text-lg text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Based on <span className="font-bold text-purple-600">{filteredEvents.length}</span> similar past events
                        </p>
                      </div>
                      <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-bold rounded-2xl transition-all shadow-lg border-2 border-gray-300"
                      >
                        🔄 Plan New Event
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Aggregated Insights Sections */}
                <div className="space-y-8">
                  {/* 1. Problems Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Animated Corner Decorations */}
                    <motion.div
                      className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    ></motion.div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Common Problems
                          </h3>
                          <p className="text-sm text-gray-600">
                            Challenges faced in similar events
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-red-600">
                            {filteredEvents.flatMap(e => e.problems).length}
                          </div>
                          <div className="text-xs text-gray-500">Issues identified</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {filteredEvents.flatMap(event => event.problems).map((problem, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="relative flex gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl border-l-4 border-red-500 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                          >
                            {/* Severity Indicator */}
                            <motion.div
                              className="absolute top-2 right-2 px-2 py-1 bg-red-100 rounded-full text-xs font-semibold text-red-700"
                              whileHover={{ scale: 1.1 }}
                            >
                              Critical
                            </motion.div>
                            <motion.div
                              className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-xs font-bold text-white">
                                {idx + 1}
                              </span>
                            </motion.div>
                            <p className="text-gray-700 group-hover:text-gray-900 transition-colors flex-1">{problem}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* 2. Solutions Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Animated Glow */}
                    <motion.div
                      className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity
                      }}
                    ></motion.div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </motion.div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Proven Solutions
                        </h3>
                        <p className="text-sm text-gray-600">
                          What actually worked in past events
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 text-lg font-bold">
                          <TrendingUp className="w-5 h-5" />
                          {Math.round((filteredEvents.flatMap(e => e.solutions).length / filteredEvents.flatMap(e => e.problems).length) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Success Rate</div>
                      </div>
                    </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {filteredEvents.flatMap(event => event.solutions).map((solution, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            className="relative flex gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all cursor-pointer border border-green-100 group overflow-hidden"
                          >
                            {/* Success Badge */}
                            <motion.div
                              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full"
                              whileHover={{ scale: 1.1 }}
                            >
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">Verified</span>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 400 }}
                              className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>
                            <p className="text-gray-800 group-hover:text-gray-900 transition-colors flex-1">{solution}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* 3. Recommendations Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Sparkle Effect */}
                    <motion.div
                      className="absolute top-10 right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 180, 0]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity
                      }}
                    ></motion.div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(212, 175, 55, 0)",
                              "0 0 0 10px rgba(212, 175, 55, 0.1)",
                              "0 0 0 0 rgba(212, 175, 55, 0)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        >
                          <Lightbulb className="w-6 h-6 text-white" />
                        </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Expert Recommendations
                        </h3>
                        <p className="text-sm text-gray-600">
                          Best practices for your event
                        </p>
                      </div>
                    </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {filteredEvents.flatMap(event => event.recommendations).map((rec, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            whileHover={{ scale: 1.02, x: -5 }}
                            className="flex gap-3 p-4 bg-gradient-to-r from-[#D4AF37]/10 via-[#F4D03F]/5 to-transparent rounded-xl border-l-4 border-[#D4AF37] hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <motion.div
                              animate={{
                                rotate: [0, 15, -15, 0]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: idx * 0.2
                              }}
                            >
                              <Zap className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5 group-hover:text-[#B8941F] transition-colors" />
                            </motion.div>
                            <p className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{rec}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* 4. Roadmap Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative bg-gradient-to-br from-white via-purple-50/30 to-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Background */}
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Animated Circles */}
                    <motion.div
                      className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, 20, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity
                      }}
                    ></motion.div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Target className="w-6 h-6 text-white" />
                        </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Step-by-Step Roadmap
                        </h3>
                        <p className="text-sm text-gray-600">
                          Comprehensive timeline for your event
                        </p>
                      </div>
                    </div>
                    {filteredEvents.length > 0 && (
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-200 via-purple-400 to-purple-600"></div>
                        
                        <div className="space-y-6">
                          {filteredEvents[0].roadmap.map((phase, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              className="relative pl-14"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute left-3 top-3 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                              
                              <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-purple-600">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-lg font-bold text-purple-900">
                                    {phase.phase}
                                  </h5>
                                  <span className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-sm font-medium">
                                    {phase.duration}
                                  </span>
                                </div>
                                <ul className="space-y-2">
                                  {phase.tasks.map((task, taskIdx) => (
                                    <li
                                      key={taskIdx}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-sm">{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  </motion.div>

                  {/* 5. Outcomes Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Animated Waves */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/5 to-transparent"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    ></motion.div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            y: [0, -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        >
                          <TrendingUp className="w-6 h-6 text-white" />
                        </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Expected Outcomes
                        </h3>
                        <p className="text-sm text-gray-600">
                          What others achieved with similar events
                        </p>
                      </div>
                    </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {filteredEvents.flatMap(event => event.outcomes).map((outcome, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            className="flex gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all cursor-pointer border border-blue-100 group"
                          >
                            <motion.div
                              animate={{
                                rotate: [0, 360]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: idx * 0.3
                              }}
                            >
                              <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 group-hover:text-blue-700 transition-colors" />
                            </motion.div>
                            <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{outcome}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Similar Events Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-8 relative"
                >
                  {/* Section Divider with Animation */}
                  <div className="relative py-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                        className="bg-white px-6"
                      >
                        <div className="text-4xl">🎯</div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="text-center relative">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 rounded-3xl blur-3xl -z-10"></div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                      className="inline-block mb-6"
                    >
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        ></motion.div>
                        <div className="relative px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-2xl">
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                              <Star className="w-5 h-5 fill-current" />
                            </motion.div>
                            Past Success Stories
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="text-5xl font-extrabold mb-4"
                    >
                      <span className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 bg-clip-text text-transparent">
                        Similar Events
                      </span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      className="text-gray-600"
                    >
                      Explore detailed analysis of each past event
                    </motion.p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.15, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.05, y: -10, rotateZ: 1 }}
                      onClick={() => setSelectedEvent(event)}
                      className="relative bg-gradient-to-br from-white via-purple-50/30 to-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all group border-2 border-purple-100/50"
                    >
                      {/* Animated Border Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(168, 85, 247, 0)',
                            '0 0 0 4px rgba(168, 85, 247, 0.1)',
                            '0 0 0 0 rgba(168, 85, 247, 0)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                      ></motion.div>
                      
                      {/* Hover Gradient Overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))'
                        }}
                      ></motion.div>
                      
                      {/* Sparkle Effect on Hover */}
                      <motion.div
                        className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity
                        }}
                      >
                        ✨
                      </motion.div>
                      {/* Event Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Success Badge */}
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.5 + index * 0.1, type: "spring" }}
                          className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5"
                        >
                          <span className="text-sm">⭐</span>
                          {event.satisfaction.toFixed(1)} Rating
                        </motion.div>
                        
                        <div className="absolute bottom-4 left-4 right-4 z-10">\n                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                            {event.name}
                          </h3>
                          <div className="flex items-center gap-4 text-white/90 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.participants}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Event Stats */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-gray-900">
                              {event.satisfaction}/5
                            </span>
                            <span className="text-sm text-gray-500">satisfaction</span>
                          </div>
                          <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium">
                            {event.type}
                          </span>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200/50 shadow-sm"
                          >
                            <motion.div
                              animate={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                            </motion.div>
                            <div className="text-2xl font-extrabold text-red-600">
                              {event.problems.length}
                            </div>
                            <div className="text-xs text-gray-700 font-semibold">Issues</div>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200/50 shadow-sm"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            </motion.div>
                            <div className="text-2xl font-extrabold text-green-600">
                              {event.solutions.length}
                            </div>
                            <div className="text-xs text-gray-700 font-semibold">Solutions</div>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200/50 shadow-sm"
                          >
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Lightbulb className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                            </motion.div>
                            <div className="text-2xl font-extrabold text-amber-600">
                              {event.recommendations.length}
                            </div>
                            <div className="text-xs text-gray-700 font-semibold">Tips</div>
                          </motion.div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg"
                        >
                          <span>🔍 View Complete Analysis</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                </motion.div>

                {/* Detailed View Modal */}
                <AnimatePresence>
                  {selectedEvent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                      onClick={() => setSelectedEvent(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                      >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {selectedEvent.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {selectedEvent.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {selectedEvent.participants} participants
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  {selectedEvent.satisfaction}/5
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedEvent(null)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        <div className="p-6 space-y-8">
                          {/* Event Image */}
                          <div className="relative h-64 rounded-xl overflow-hidden">
                            <img
                              src={selectedEvent.image}
                              alt={selectedEvent.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Budget */}
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl">
                            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                              <LineChart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Total Budget</div>
                              <div className="text-2xl font-bold text-[#D4AF37]">
                                {selectedEvent.budget}
                              </div>
                            </div>
                          </div>

                          {/* Problems Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900">
                                Problems Faced
                              </h4>
                            </div>
                            <div className="space-y-3">
                              {selectedEvent.problems.map((problem, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 p-4 bg-red-50 rounded-xl"
                                >
                                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-bold text-red-700">
                                      {idx + 1}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{problem}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Solutions Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900">
                                Solutions Implemented
                              </h4>
                            </div>
                            <div className="space-y-3">
                              {selectedEvent.solutions.map((solution, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 p-4 bg-green-50 rounded-xl"
                                >
                                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-gray-700">{solution}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Outcomes Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900">
                                Outcomes & Achievements
                              </h4>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              {selectedEvent.outcomes.map((outcome, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 p-4 bg-blue-50 rounded-xl"
                                >
                                  <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-gray-700">{outcome}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900">
                                Recommendations for Your Event
                              </h4>
                            </div>
                            <div className="space-y-3">
                              {selectedEvent.recommendations.map((rec, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl border-l-4 border-[#D4AF37]"
                                >
                                  <Zap className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                  <p className="text-gray-700 font-medium">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Roadmap Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-purple-600" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900">
                                Step-by-Step Roadmap
                              </h4>
                            </div>
                            <div className="relative">
                              {/* Timeline Line */}
                              <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-200 via-purple-400 to-purple-600"></div>
                              
                              <div className="space-y-6">
                                {selectedEvent.roadmap.map((phase, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-14"
                                  >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-3 top-3 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                                    
                                    <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-purple-600">
                                      <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-lg font-bold text-purple-900">
                                          {phase.phase}
                                        </h5>
                                        <span className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-sm font-medium">
                                          {phase.duration}
                                        </span>
                                      </div>
                                      <ul className="space-y-2">
                                        {phase.tasks.map((task, taskIdx) => (
                                          <li
                                            key={taskIdx}
                                            className="flex items-start gap-2 text-gray-700"
                                          >
                                            <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{task}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 pt-4">
                            <button className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                              Download Complete Report
                            </button>
                            <button className="px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#D4AF37]/5 transition-all">
                              Save to My Events
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
