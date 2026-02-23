// Mock data for Campus Memory platform

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: "IIT" | "NIT" | "State" | "Private" | "Central";
  established: number;
  studentStrength: number;
  memoryIndex: number;
  activeUsers: number;
  color: string;
}

export const colleges: College[] = [
  // Gwalior Colleges
  { id: "amity-gwalior", name: "Amity University Gwalior", shortName: "Amity Gwalior", city: "Gwalior", state: "Madhya Pradesh", type: "Private", established: 2010, studentStrength: 6500, memoryIndex: 75, activeUsers: 1842, color: "https://i.ibb.co/VckjsXLC/image.png" },
  { id: "itm-gwalior", name: "ITM University Gwalior", shortName: "ITM Gwalior", city: "Gwalior", state: "Madhya Pradesh", type: "Private", established: 2011, studentStrength: 5600, memoryIndex: 68, activeUsers: 1450, color: "#2563EB" },
  { id: "jiwaji", name: "Jiwaji University", shortName: "Jiwaji University", city: "Gwalior", state: "Madhya Pradesh", type: "State", established: 1964, studentStrength: 25000, memoryIndex: 72, activeUsers: 3200, color: "#DC2626" },
  { id: "prestige-gwalior", name: "Prestige Institute of Management Gwalior", shortName: "Prestige Gwalior", city: "Gwalior", state: "Madhya Pradesh", type: "Private", established: 1994, studentStrength: 3200, memoryIndex: 65, activeUsers: 890, color: "#10B981" },
  
  // Jhansi Colleges
  { id: "bundelkhand", name: "Bundelkhand University", shortName: "Bundelkhand University", city: "Jhansi", state: "Uttar Pradesh", type: "State", established: 1975, studentStrength: 18000, memoryIndex: 70, activeUsers: 2450, color: "#F59E0B" },
  { id: "iiitdmj", name: "IIIT Design & Manufacturing Jabalpur", shortName: "IIITDM Jabalpur", city: "Jabalpur", state: "Madhya Pradesh", type: "Central", established: 2005, studentStrength: 1200, memoryIndex: 82, activeUsers: 980, color: "#7C3AED" },
  { id: "gla-india", name: "GLA University", shortName: "GLA University", city: "Mathura", state: "Uttar Pradesh", type: "Private", established: 2010, studentStrength: 8500, memoryIndex: 66, activeUsers: 1680, color: "#8B5CF6" },
  
  // Lucknow Colleges
  { id: "lucknow-university", name: "University of Lucknow", shortName: "Lucknow University", city: "Lucknow", state: "Uttar Pradesh", type: "State", established: 1920, studentStrength: 35000, memoryIndex: 78, activeUsers: 4500, color: "#1E40AF" },
  { id: "iit-kanpur", name: "Indian Institute of Technology Kanpur", shortName: "IIT Kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "IIT", established: 1959, studentStrength: 9800, memoryIndex: 92, activeUsers: 3700, color: "#DC2626" },
  { id: "bbau", name: "Babasaheb Bhimrao Ambedkar University", shortName: "BBAU Lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "Central", established: 1996, studentStrength: 12000, memoryIndex: 74, activeUsers: 2100, color: "#EF4444" },
  { id: "integral", name: "Integral University", shortName: "Integral University", city: "Lucknow", state: "Uttar Pradesh", type: "Private", established: 2004, studentStrength: 10000, memoryIndex: 69, activeUsers: 1950, color: "#059669" },
  { id: "amity-lucknow", name: "Amity University Lucknow", shortName: "Amity Lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "Private", established: 2006, studentStrength: 7000, memoryIndex: 76, activeUsers: 2200, color: "#C026D3" },
];

export interface Student {
  id: string;
  name: string;
  email: string;
  collegeid: string;
  program: string;
  year: number;
  batch: string;
  points: number;
  achievements: string[];
  contributionsCount: number;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "analyzing" | "solving" | "resolved" | "prevented";
  reportedBy: string;
  reportedByStudent?: Student;
  reportedDate: string;
  resolvedDate?: string;
  upvotes: number;
  supportCount: number;
  supporters: string[];
  sentiment: "positive" | "neutral" | "negative";
  college: string;
}

export const problems: Problem[] = [
  { id: "p1", title: "Library overcrowding during exam week", category: "Infrastructure & Logistics", subcategory: "Library management", description: "Library becomes extremely crowded 2 weeks before end-semester exams. Seats unavailable after 8 AM.", severity: "high", status: "resolved", reportedBy: "Rahul Sharma (CSE, 3rd Year)", reportedDate: "2024-11-15", resolvedDate: "2025-01-10", upvotes: 234, supportCount: 156, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p2", title: "WiFi dead zones in hostel Block C", category: "Hostel & Accommodation", subcategory: "WiFi/power problems", description: "Consistent WiFi connectivity issues in Block C, floors 3-5. Affects 200+ students.", severity: "high", status: "solving", reportedBy: "Priya Verma (ECE, 2nd Year)", reportedDate: "2024-09-20", upvotes: 189, supportCount: 89, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p3", title: "Mess food quality deterioration", category: "Hostel & Accommodation", subcategory: "Food quality tracking", description: "Noticeable decline in food quality since new vendor. Multiple hygiene concerns reported.", severity: "critical", status: "analyzing", reportedBy: "Anonymous (ME, 4th Year)", reportedDate: "2025-01-05", upvotes: 312, supportCount: 178, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p4", title: "Parking chaos near main gate", category: "Infrastructure & Logistics", subcategory: "Parking chaos patterns", description: "No organized parking system. Two-wheelers blocking pedestrian paths during peak hours.", severity: "medium", status: "resolved", reportedBy: "Amit Kumar (Civil, 3rd Year)", reportedDate: "2024-08-10", resolvedDate: "2024-10-15", upvotes: 156, supportCount: 67, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p5", title: "Tech fest budget mismanagement", category: "Campus Events & Fests", subcategory: "Budget management", description: "Recurring issue: tech fest budget exhausted before day 2. Same pattern for 3 consecutive years.", severity: "high", status: "prevented", reportedBy: "Sneha Patel (MBA, 2nd Year)", reportedDate: "2024-02-20", resolvedDate: "2024-09-15", upvotes: 278, supportCount: 145, supporters: [], sentiment: "neutral", college: "amity-gwalior" },
  { id: "p6", title: "Attendance system technical glitches", category: "Administration & Policies", subcategory: "Attendance system flaws", description: "Biometric attendance system fails frequently. Students marked absent despite being present.", severity: "high", status: "solving", reportedBy: "Vikram Singh (IT, 1st Year)", reportedDate: "2025-01-08", upvotes: 198, supportCount: 98, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p7", title: "Lab equipment shortage in Physics dept", category: "Academic & Timetable", subcategory: "Lab timing conflicts", description: "Insufficient oscilloscopes and multimeters for batch of 60. Students share in groups of 5-6.", severity: "medium", status: "reported", reportedBy: "Anjali Mishra (Physics, 2nd Year)", reportedDate: "2025-01-12", upvotes: 87, supportCount: 45, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p8", title: "Certificate issuance delays", category: "Administration & Policies", subcategory: "Certificate delays", description: "Degree certificates taking 6+ months after graduation. Affecting job joining and higher studies.", severity: "critical", status: "analyzing", reportedBy: "Anonymous (EE, Alumni 2024)", reportedDate: "2024-12-01", upvotes: 445, supportCount: 234, supporters: [], sentiment: "negative", college: "amity-gwalior" },
  { id: "p9", title: "Shuttle service gaps after 7 PM", category: "Infrastructure & Logistics", subcategory: "Transport coordination", description: "Evening classes end at 7 PM but campus shuttle stops at 6:30 PM. Students walking 2 km back to hostels.", severity: "medium", status: "reported", reportedBy: "Rohan Desai (MBA, 1st Year)", reportedDate: "2025-01-24", upvotes: 64, supportCount: 34, supporters: [], sentiment: "negative", college: "itm-gwalior" },
  { id: "p10", title: "Central library AC downtime", category: "Academic & Timetable", subcategory: "Library management", description: "Air-conditioning unit fails every alternate afternoon during peak project submissions. Creates uncomfortable study environment.", severity: "high", status: "solving", reportedBy: "Kavya Jain (Science, 3rd Year)", reportedDate: "2025-02-01", upvotes: 98, supportCount: 56, supporters: [], sentiment: "negative", college: "jiwaji" },
];

// Sample students for the system
export const students: Student[] = [
  { id: "s1", name: "Arjun K.", email: "arjun@example.com", collegeid: "amity-gwalior", program: "CSE", year: 3, batch: "2023", points: 2340, achievements: ["ach1", "ach4", "ach6"], contributionsCount: 45 },
  { id: "s2", name: "Priya S.", email: "priya@example.com", collegeid: "amity-gwalior", program: "ECE", year: 2, batch: "2024", points: 2180, achievements: ["ach2", "ach5"], contributionsCount: 38 },
  { id: "s3", name: "Rahul M.", email: "rahul@example.com", collegeid: "amity-gwalior", program: "ME", year: 3, batch: "2023", points: 1950, achievements: ["ach1", "ach3"], contributionsCount: 32 },
  { id: "s4", name: "Sneha P.", email: "sneha@example.com", collegeid: "amity-gwalior", program: "IT", year: 2, batch: "2024", points: 1820, achievements: ["ach5"], contributionsCount: 28 },
  { id: "s5", name: "Vikram J.", email: "vikram@example.com", collegeid: "amity-gwalior", program: "Civil", year: 1, batch: "2025", points: 1750, achievements: ["ach1"], contributionsCount: 25 },
];

export interface Pattern {
  id: string;
  title: string;
  frequency: number;
  yearsActive: number;
  affectedDepartments: string[];
  seasonalTrend: string;
  successRate: number;
  similarCampuses: string[];
  severity: "low" | "medium" | "high";
  college: string;
}

export const patterns: Pattern[] = [
  { id: "pt1", title: "Library overcrowding during exams", frequency: 98, yearsActive: 8, affectedDepartments: ["All"], seasonalTrend: "Nov-Dec, Apr-May", successRate: 67, similarCampuses: ["ITM Gwalior", "Jiwaji University"], severity: "high", college: "amity-gwalior" },
  { id: "pt2", title: "Fest budget exhaustion", frequency: 85, yearsActive: 5, affectedDepartments: ["Student Affairs", "Finance"], seasonalTrend: "Feb-Mar, Sep-Oct", successRate: 45, similarCampuses: ["ITM Gwalior", "Lucknow University"], severity: "medium", college: "amity-gwalior" },
  { id: "pt3", title: "Hostel WiFi outages", frequency: 92, yearsActive: 6, affectedDepartments: ["IT Services", "Administration"], seasonalTrend: "Year-round, peaks during exams", successRate: 30, similarCampuses: ["Jiwaji University", "Bundelkhand University"], severity: "high", college: "amity-gwalior" },
  { id: "pt4", title: "Food quality cycles", frequency: 76, yearsActive: 10, affectedDepartments: ["Hostel Admin", "Health Services"], seasonalTrend: "Post-vendor change, monsoon season", successRate: 55, similarCampuses: ["All campuses"], severity: "medium", college: "amity-gwalior" },
  { id: "pt5", title: "Parking congestion patterns", frequency: 88, yearsActive: 7, affectedDepartments: ["Security", "Infrastructure"], seasonalTrend: "Weekdays 8-10 AM, event days", successRate: 72, similarCampuses: ["ITM Gwalior", "Lucknow University"], severity: "low", college: "amity-gwalior" },
];

export interface Alert {
  id: string;
  title: string;
  riskLevel: "green" | "yellow" | "red";
  predictedDate: string;
  daysUntil: number;
  confidence: number;
  historicalOccurrences: number;
  description: string;
  preventiveActions: string[];
  college: string;
}

export const alerts: Alert[] = [
  { id: "a1", title: "Library overcrowding predicted", riskLevel: "red", predictedDate: "2025-04-15", daysUntil: 68, confidence: 94, historicalOccurrences: 16, description: "End-semester exams approaching. Library capacity expected to exceed 150% by April 15.", preventiveActions: ["Open additional study halls", "Extend library hours to 24/7", "Set up temporary reading spaces in auditorium", "Deploy seat reservation system"], college: "amity-gwalior" },
  { id: "a2", title: "Cultural fest budget risk", riskLevel: "yellow", predictedDate: "2025-03-01", daysUntil: 23, confidence: 78, historicalOccurrences: 5, description: "Annual cultural fest in March. Historical pattern shows 60% chance of budget overrun by Day 2.", preventiveActions: ["Implement milestone-based budget release", "Assign financial auditor per event", "Create emergency fund (10% of total)", "Pre-negotiate vendor rates"], college: "amity-gwalior" },
  { id: "a3", title: "Monsoon infrastructure issues", riskLevel: "yellow", predictedDate: "2025-07-01", daysUntil: 145, confidence: 88, historicalOccurrences: 12, description: "Monsoon season brings flooding in Ground Floor labs and hostel basements. Pattern: 3-4 incidents per monsoon.", preventiveActions: ["Pre-monsoon drain cleaning", "Relocate sensitive equipment from Ground Floor", "Install water level sensors", "Prepare emergency response kit"], college: "amity-gwalior" },
  { id: "a4", title: "New student orientation overwhelm", riskLevel: "green", predictedDate: "2025-08-01", daysUntil: 176, confidence: 72, historicalOccurrences: 8, description: "First-year onboarding creates administrative bottleneck. Wait times exceed 3 hours for document verification.", preventiveActions: ["Pre-arrival digital document submission", "Multi-counter setup", "Student volunteer deployment", "Staggered reporting schedule"], college: "amity-gwalior" },
];

export interface WisdomTip {
  id: string;
  content: string;
  category: string;
  batch: string;
  upvotes: number;
  department: string;
  college: string;
  contributedBy: string;
}

export const wisdomTips: WisdomTip[] = [
  { id: "w1", content: "Always take Prof. Sharma's elective on Machine Learning - best course in CSE department. He gives real industry problems as assignments.", category: "Course selection advice", batch: "2023", upvotes: 342, department: "CSE", college: "amity-gwalior", contributedBy: "Arjun K." },
  { id: "w2", content: "The library has a hidden study room on the 3rd floor behind the reference section. Usually empty even during exams. Thank me later!", category: "Campus survival hacks", batch: "2022", upvotes: 567, department: "General", college: "amity-gwalior", contributedBy: "Priya S." },
  { id: "w3", content: "Start your internship applications in August, not January. Most companies close applications by November for summer internships.", category: "Internship guidance", batch: "2023", upvotes: 445, department: "All", college: "amity-gwalior", contributedBy: "Rahul M." },
  { id: "w4", content: "The chai stall near Gate 2 closes at 11 PM but the one inside the campus near the workshop opens at 6 AM. Essential info for night owls.", category: "Campus survival hacks", batch: "2024", upvotes: 789, department: "General", college: "amity-gwalior", contributedBy: "Sneha P." },
  { id: "w5", content: "For EE students: Prof. Verma's control systems notes from 2019 are gold. Available in departmental library archives. Ask the librarian specifically.", category: "Exam preparation tips", batch: "2023", upvotes: 234, department: "EE", college: "amity-gwalior", contributedBy: "Vikram J." },
  { id: "w6", content: "Register for gym slot in the first week itself. It fills up by Day 3 and you'll have to wait till next semester.", category: "Campus survival hacks", batch: "2024", upvotes: 456, department: "General", college: "amity-gwalior", contributedBy: "Anonymous" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  earnedBy: number;
}

export const achievements: Achievement[] = [
  { id: "ach1", name: "Problem Solver", description: "Reported 10 problems that led to solutions", icon: "🔧", level: "gold", category: "Problem Solving", earnedBy: 234 },
  { id: "ach2", name: "Memory Keeper", description: "Contributed 50+ wisdom tips", icon: "🧠", level: "platinum", category: "Wisdom", earnedBy: 45 },
  { id: "ach3", name: "Prevention Hero", description: "Your report prevented a recurring issue", icon: "🛡️", level: "silver", category: "Prevention", earnedBy: 567 },
  { id: "ach4", name: "Voice of Campus", description: "Your contributions were upvoted 1000+ times", icon: "📣", level: "gold", category: "Community", earnedBy: 123 },
  { id: "ach5", name: "Freshman Guide", description: "Helped 100+ juniors with your wisdom", icon: "🌟", level: "silver", category: "Mentorship", earnedBy: 345 },
  { id: "ach6", name: "Data Detective", description: "Identified a hidden pattern across 5+ years", icon: "🔍", level: "platinum", category: "Analytics", earnedBy: 28 },
];

export const campusPulseData = {
  satisfaction: 87,
  problemsInResolution: 12,
  wisdomAddedThisWeek: 45,
  preventionStreak: 32,
  mostHelpfulBatch: "2023",
  problemsPreventedToday: 47,
  hoursSavedThisWeek: 1234,
  satisfactionIncrease: 34,
  repeatIssuesReduced: 78,
};

export const monthlyData = [
  { month: "Jan", problems: 45, resolved: 38, prevented: 12 },
  { month: "Feb", problems: 52, resolved: 42, prevented: 15 },
  { month: "Mar", problems: 78, resolved: 55, prevented: 22 },
  { month: "Apr", problems: 95, resolved: 70, prevented: 30 },
  { month: "May", problems: 40, resolved: 35, prevented: 18 },
  { month: "Jun", problems: 25, resolved: 22, prevented: 10 },
  { month: "Jul", problems: 55, resolved: 40, prevented: 20 },
  { month: "Aug", problems: 65, resolved: 50, prevented: 25 },
  { month: "Sep", problems: 72, resolved: 58, prevented: 28 },
  { month: "Oct", problems: 60, resolved: 48, prevented: 22 },
  { month: "Nov", problems: 88, resolved: 65, prevented: 35 },
  { month: "Dec", problems: 70, resolved: 55, prevented: 28 },
];

export const departmentData = [
  { department: "CSE", issues: 45, resolution: 89, satisfaction: 82 },
  { department: "ECE", issues: 38, resolution: 85, satisfaction: 78 },
  { department: "ME", issues: 32, resolution: 92, satisfaction: 85 },
  { department: "Civil", issues: 28, resolution: 88, satisfaction: 80 },
  { department: "EE", issues: 35, resolution: 82, satisfaction: 76 },
  { department: "Physics", issues: 20, resolution: 95, satisfaction: 88 },
  { department: "Math", issues: 15, resolution: 97, satisfaction: 92 },
  { department: "Chemistry", issues: 22, resolution: 90, satisfaction: 84 },
];

export const problemCategories = [
  { name: "Academic & Timetable", icon: "📚", color: "#1E40AF", count: 156 },
  { name: "Campus Events & Fests", icon: "🎪", color: "#F59E0B", count: 89 },
  { name: "Hostel & Accommodation", icon: "🏠", color: "#10B981", count: 234 },
  { name: "Infrastructure & Logistics", icon: "🏗️", color: "#8B5CF6", count: 178 },
  { name: "Administration & Policies", icon: "📋", color: "#DC2626", count: 145 },
  { name: "Senior-to-Junior Wisdom", icon: "🎓", color: "#FBBF24", count: 312 },
];

export const testimonials = [
  { name: "Dr. Rajesh Kumar", role: "Dean of Students, IIT Delhi", quote: "Campus Memory has transformed how we understand and address student concerns. It's like having decades of institutional wisdom at our fingertips.", avatar: "👨‍🏫" },
  { name: "Priya Sharma", role: "Student Council President, NIT Trichy", quote: "For the first time, we're not repeating mistakes from previous batches. The pattern detection is incredibly accurate.", avatar: "👩‍🎓" },
  { name: "Prof. Anand Mohan", role: "Head of Admin, BHU", quote: "The predictive alerts saved us from three potential crises this semester alone. This is what smart education looks like.", avatar: "👨‍💼" },
  { name: "Amit Verma", role: "Alumni, BITS Pilani '22", quote: "I wish we had this when I was in college. Contributing my experiences now so juniors don't face the same struggles.", avatar: "🧑‍💻" },
];
