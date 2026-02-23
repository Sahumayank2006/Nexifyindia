"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Coffee,
  Briefcase,
  UtensilsCrossed,
  GraduationCap,
  FileText,
  Video,
  Plus,
  Edit2,
  Trash2,
  ShoppingCart,
  Calendar,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Star,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package,
  Settings,
  CreditCard,
  Upload,
  Download,
  Eye,
  MessageSquare,
  Bell,
  Phone,
  Mail,
  Building,
  Award,
  Sparkles,
  Home,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  BookOpen,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";

// ============================================
// INTERFACES & TYPES
// ============================================

interface Canteen {
  id: string;
  name: string;
  location: string;
  description: string;
  openingHours: string;
  contact: string;
  image: string;
  status: "open" | "closed";
  rating: number;
  totalOrders: number;
}

interface MenuItem {
  id: string;
  canteenId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  availability: "available" | "out-of-stock";
  dietaryTags: string[];
  customizations: string[];
  rating: number;
  reviews: number;
}

interface Order {
  id: string;
  studentId: string;
  studentName: string;
  canteenId: string;
  canteenName: string;
  items: { menuItem: MenuItem; quantity: number; customization?: string }[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  pickupTime: string;
  specialInstructions?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod: "online" | "cash";
  createdAt: string;
}

interface CounselorSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  mode: "online" | "offline" | "both";
  category: "career" | "stress" | "abroad" | "general";
}

interface Counselor {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  photo: string;
  rating: number;
  reviews: number;
  availability: string;
}

interface ResumePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  turnaroundTime: string;
  features: string[];
  popular?: boolean;
}

interface ResumeRequest {
  id: string;
  studentId: string;
  studentName: string;
  packageId: string;
  packageName: string;
  resumeFile: string;
  linkedinUrl?: string;
  notes?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  expertId?: string;
  feedback?: string;
  reviewedFile?: string;
  createdAt: string;
  paymentStatus: "pending" | "paid" | "refunded";
}

interface MockInterviewExpert {
  id: string;
  name: string;
  company: string;
  position: string;
  bio: string;
  expertise: string[];
  photo: string;
  linkedinUrl: string;
  rating: number;
  reviews: number;
}

interface InterviewPackage {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  mode: "online" | "in-person" | "both";
  features: string[];
}

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  serviceType: "counseling" | "resume" | "interview";
  serviceId: string;
  serviceName: string;
  expertId?: string;
  expertName?: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  price: number;
  createdAt: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ServicesPage() {
  // View State
  const [currentView, setCurrentView] = useState<
    "home" | "cafeteria" | "career"
  >("home");
  const [userRole, setUserRole] = useState<"admin" | "student">("student");
  const [isAdmin, setIsAdmin] = useState(false);

  // Cafeteria State
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [cart, setCart] = useState<
    { menuItem: MenuItem; quantity: number; customization?: string }[]
  >([]);

  // Career Counseling State
  const [counselingSessions, setCounselingSessions] = useState<
    CounselorSession[]
  >([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [resumePackages, setResumePackages] = useState<ResumePackage[]>([]);
  const [resumeRequests, setResumeRequests] = useState<ResumeRequest[]>([]);
  const [mockInterviewExperts, setMockInterviewExperts] = useState<
    MockInterviewExpert[]
  >([]);
  const [interviewPackages, setInterviewPackages] = useState<
    InterviewPackage[]
  >([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ============================================
  // INITIALIZE DATA
  // ============================================

  useEffect(() => {
    initializeData();
    loadFromLocalStorage();
  }, []);

  const initializeData = () => {
    // Initialize Canteens
    const initialCanteens: Canteen[] = [
      {
        id: "c1",
        name: "A Block Canteen",
        location: "Academic Block A, Ground Floor",
        description:
          "Popular spot for quick bites and refreshments between classes",
        openingHours: "8:00 AM - 6:00 PM",
        contact: "+91 9876543210",
        image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400",
        status: "open",
        rating: 4.5,
        totalOrders: 1234,
      },
      {
        id: "c2",
        name: "B Block Canteen",
        location: "Engineering Block B, 1st Floor",
        description: "Spacious cafeteria with variety of meal options",
        openingHours: "7:30 AM - 7:00 PM",
        contact: "+91 9876543211",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        status: "open",
        rating: 4.3,
        totalOrders: 987,
      },
      {
        id: "c3",
        name: "C Block Canteen",
        location: "Science Block C, Ground Floor",
        description: "Cozy canteen with healthy food choices",
        openingHours: "8:00 AM - 5:30 PM",
        contact: "+91 9876543212",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
        status: "open",
        rating: 4.6,
        totalOrders: 765,
      },
      {
        id: "c4",
        name: "D Block Canteen",
        location: "Administrative Block D, Ground Floor",
        description: "Modern cafeteria with diverse menu",
        openingHours: "8:30 AM - 6:30 PM",
        contact: "+91 9876543213",
        image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
        status: "open",
        rating: 4.4,
        totalOrders: 654,
      },
      {
        id: "c5",
        name: "Nescafe",
        location: "Central Plaza, Near Library",
        description: "Premium coffee and snacks lounge",
        openingHours: "7:00 AM - 9:00 PM",
        contact: "+91 9876543214",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
        status: "open",
        rating: 4.8,
        totalOrders: 2341,
      },
    ];

    // Initialize Menu Items
    const initialMenuItems: MenuItem[] = [
      // A Block Items
      {
        id: "m1",
        canteenId: "c1",
        name: "Veg Sandwich",
        description: "Fresh vegetables with cheese and special sauce",
        price: 50,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: ["Extra Cheese", "No Onion", "Spicy"],
        rating: 4.5,
        reviews: 89,
      },
      {
        id: "m2",
        canteenId: "c1",
        name: "Masala Dosa",
        description: "Crispy dosa with potato filling",
        price: 60,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian", "Vegan"],
        customizations: ["Extra Chutney", "No Potato"],
        rating: 4.7,
        reviews: 124,
      },
      {
        id: "m3",
        canteenId: "c1",
        name: "Cold Coffee",
        description: "Chilled coffee with ice cream",
        price: 70,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: ["Less Sugar", "Extra Ice Cream"],
        rating: 4.6,
        reviews: 156,
      },
      // B Block Items
      {
        id: "m4",
        canteenId: "c2",
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with tender chicken",
        price: 120,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300",
        availability: "available",
        dietaryTags: ["Non-Vegetarian"],
        customizations: ["Extra Raita", "Less Spicy"],
        rating: 4.8,
        reviews: 234,
      },
      {
        id: "m5",
        canteenId: "c2",
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with spices",
        price: 90,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: ["Extra Mint Chutney"],
        rating: 4.6,
        reviews: 98,
      },
      // C Block Items
      {
        id: "m6",
        canteenId: "c3",
        name: "Fruit Salad",
        description: "Fresh seasonal fruits with honey",
        price: 80,
        category: "Healthy",
        image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free"],
        customizations: ["No Honey", "Extra Nuts"],
        rating: 4.4,
        reviews: 67,
      },
      {
        id: "m7",
        canteenId: "c3",
        name: "Green Smoothie",
        description: "Spinach, banana, and almond milk blend",
        price: 90,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian", "Vegan"],
        customizations: ["Add Protein", "Extra Sweet"],
        rating: 4.5,
        reviews: 45,
      },
      // D Block Items
      {
        id: "m8",
        canteenId: "c4",
        name: "Pasta Alfredo",
        description: "Creamy white sauce pasta",
        price: 100,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: ["Add Chicken", "Extra Cheese"],
        rating: 4.7,
        reviews: 112,
      },
      // Nescafe Items
      {
        id: "m9",
        canteenId: "c5",
        name: "Cappuccino",
        description: "Classic Italian coffee with foam",
        price: 80,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: ["Extra Shot", "Almond Milk"],
        rating: 4.9,
        reviews: 289,
      },
      {
        id: "m10",
        canteenId: "c5",
        name: "Chocolate Croissant",
        description: "Buttery pastry with chocolate filling",
        price: 70,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300",
        availability: "available",
        dietaryTags: ["Vegetarian"],
        customizations: [],
        rating: 4.8,
        reviews: 167,
      },
    ];

    // Initialize Counseling Sessions
    const initialCounselingSessions: CounselorSession[] = [
      {
        id: "cs1",
        title: "Career Guidance Session",
        description: "One-on-one session to discuss career paths and goals",
        duration: 60,
        price: 500,
        mode: "both",
        category: "career",
      },
      {
        id: "cs2",
        title: "Stress Management Counseling",
        description: "Learn techniques to manage academic stress",
        duration: 45,
        price: 400,
        mode: "both",
        category: "stress",
      },
      {
        id: "cs3",
        title: "Study Abroad Planning",
        description: "Guidance for international education opportunities",
        duration: 90,
        price: 800,
        mode: "online",
        category: "abroad",
      },
    ];

    // Initialize Counselors
    const initialCounselors: Counselor[] = [
      {
        id: "co1",
        name: "Dr. Priya Sharma",
        bio: "Career counselor with 10+ years experience",
        expertise: ["Career Planning", "Interview Prep", "Skill Development"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
        rating: 4.8,
        reviews: 145,
        availability: "Mon-Fri, 9AM-5PM",
      },
      {
        id: "co2",
        name: "Mr. Rajesh Kumar",
        bio: "Psychology expert specializing in student wellness",
        expertise: ["Stress Management", "Mental Health", "Personal Growth"],
        photo: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=200",
        rating: 4.9,
        reviews: 198,
        availability: "Tue-Sat, 10AM-6PM",
      },
      {
        id: "co3",
        name: "Ms. Anjali Verma",
        bio: "International education consultant",
        expertise: ["Study Abroad", "University Selection", "Visa Guidance"],
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
        rating: 4.7,
        reviews: 87,
        availability: "Mon-Thu, 11AM-7PM",
      },
    ];

    // Initialize Resume Packages
    const initialResumePackages: ResumePackage[] = [
      {
        id: "rp1",
        name: "Basic Resume Review",
        description: "Professional review with feedback",
        price: 300,
        turnaroundTime: "2-3 days",
        features: [
          "Grammar and formatting check",
          "Content suggestions",
          "Email support",
        ],
      },
      {
        id: "rp2",
        name: "Premium Resume + LinkedIn",
        description: "Complete profile optimization",
        price: 800,
        turnaroundTime: "3-5 days",
        features: [
          "Full resume rewrite",
          "LinkedIn profile optimization",
          "Cover letter template",
          "Priority support",
          "1 revision included",
        ],
        popular: true,
      },
      {
        id: "rp3",
        name: "Executive Package",
        description: "Comprehensive career branding",
        price: 1500,
        turnaroundTime: "5-7 days",
        features: [
          "Resume + LinkedIn + Cover Letter",
          "Personal branding consultation",
          "Portfolio website setup",
          "Unlimited revisions",
          "24/7 support",
        ],
      },
    ];

    // Initialize Mock Interview Experts
    const initialMockInterviewExperts: MockInterviewExpert[] = [
      {
        id: "ie1",
        name: "Amit Malhotra",
        company: "Google India",
        position: "Senior Software Engineer",
        bio: "10+ years in tech industry, passionate about mentoring",
        expertise: ["Software Engineering", "System Design", "Coding Interviews"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        linkedinUrl: "https://linkedin.com/in/sample",
        rating: 4.9,
        reviews: 234,
      },
      {
        id: "ie2",
        name: "Sneha Patel",
        company: "Amazon",
        position: "Product Manager",
        bio: "Expert in product strategy and management",
        expertise: ["Product Management", "Case Studies", "Leadership"],
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        linkedinUrl: "https://linkedin.com/in/sample",
        rating: 4.8,
        reviews: 187,
      },
      {
        id: "ie3",
        name: "Vikram Singh",
        company: "McKinsey & Company",
        position: "Consultant",
        bio: "Management consulting specialist",
        expertise: ["Consulting", "Case Interviews", "Business Strategy"],
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        linkedinUrl: "https://linkedin.com/in/sample",
        rating: 4.9,
        reviews: 156,
      },
    ];

    // Initialize Interview Packages
    const initialInterviewPackages: InterviewPackage[] = [
      {
        id: "ip1",
        name: "30-Min Mock Interview",
        description: "Quick practice session with feedback",
        duration: 30,
        price: 600,
        mode: "online",
        features: ["Live video interview", "Instant feedback", "Recording provided"],
      },
      {
        id: "ip2",
        name: "60-Min Detailed Interview",
        description: "Comprehensive interview practice",
        duration: 60,
        price: 1000,
        mode: "online",
        features: [
          "Full interview simulation",
          "Detailed written feedback",
          "Recording + transcript",
          "Follow-up email support",
        ],
      },
      {
        id: "ip3",
        name: "Premium Package (2 Sessions)",
        description: "Two sessions with same expert",
        duration: 120,
        price: 1800,
        mode: "both",
        features: [
          "2x 60-min sessions",
          "Progress tracking",
          "Personalized improvement plan",
          "Direct WhatsApp support",
        ],
      },
    ];

    setCanteens(initialCanteens);
    setMenuItems(initialMenuItems);
    setCounselingSessions(initialCounselingSessions);
    setCounselors(initialCounselors);
    setResumePackages(initialResumePackages);
    setMockInterviewExperts(initialMockInterviewExperts);
    setInterviewPackages(initialInterviewPackages);
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("cafeteria-orders");
      const savedBookings = localStorage.getItem("career-bookings");
      const savedResumeRequests = localStorage.getItem("resume-requests");
      const savedRole = localStorage.getItem("user-role");

      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      if (savedResumeRequests) setResumeRequests(JSON.parse(savedResumeRequests));
      if (savedRole) {
        setUserRole(savedRole as "admin" | "student");
        setIsAdmin(savedRole === "admin");
      }
    }
  };

  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // ============================================
  // CAFETERIA CRUD OPERATIONS
  // ============================================

  const addCanteen = (canteenData: Omit<Canteen, "id">) => {
    const newCanteen: Canteen = {
      ...canteenData,
      id: `c${Date.now()}`,
    };
    setCanteens([...canteens, newCanteen]);
    setShowModal(false);
  };

  const updateCanteen = (id: string, canteenData: Partial<Canteen>) => {
    setCanteens(
      canteens.map((c) => (c.id === id ? { ...c, ...canteenData } : c))
    );
    setShowModal(false);
  };

  const deleteCanteen = (id: string) => {
    setCanteens(canteens.filter((c) => c.id !== id));
  };

  const addMenuItem = (itemData: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `m${Date.now()}`,
    };
    setMenuItems([...menuItems, newItem]);
    setShowModal(false);
  };

  const updateMenuItem = (id: string, itemData: Partial<MenuItem>) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, ...itemData } : item)));
    setShowModal(false);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const addToCart = (menuItem: MenuItem, quantity: number, customization?: string) => {
    const existingItem = cart.find(
      (item) =>
        item.menuItem.id === menuItem.id &&
        item.customization === customization
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItem.id === menuItem.id &&
          item.customization === customization
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { menuItem, quantity, customization }]);
    }
    setShowCart(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const placeOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveToLocalStorage("cafeteria-orders", updatedOrders);
    setCart([]);
    setShowCart(false);
    setShowModal(false);
  };

  const updateOrderStatus = (
    id: string,
    status: Order["status"],
    paymentStatus?: Order["paymentStatus"]
  ) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status, ...(paymentStatus && { paymentStatus }) }
        : order
    );
    setOrders(updatedOrders);
    saveToLocalStorage("cafeteria-orders", updatedOrders);
  };

  // ============================================
  // CAREER COUNSELING CRUD OPERATIONS
  // ============================================

  const addCounselingSession = (sessionData: Omit<CounselorSession, "id">) => {
    const newSession: CounselorSession = {
      ...sessionData,
      id: `cs${Date.now()}`,
    };
    setCounselingSessions([...counselingSessions, newSession]);
    setShowModal(false);
  };

  const updateCounselingSession = (
    id: string,
    sessionData: Partial<CounselorSession>
  ) => {
    setCounselingSessions(
      counselingSessions.map((s) => (s.id === id ? { ...s, ...sessionData } : s))
    );
    setShowModal(false);
  };

  const deleteCounselingSession = (id: string) => {
    setCounselingSessions(counselingSessions.filter((s) => s.id !== id));
  };

  const addCounselor = (counselorData: Omit<Counselor, "id">) => {
    const newCounselor: Counselor = {
      ...counselorData,
      id: `co${Date.now()}`,
    };
    setCounselors([...counselors, newCounselor]);
    setShowModal(false);
  };

  const updateCounselor = (id: string, counselorData: Partial<Counselor>) => {
    setCounselors(
      counselors.map((c) => (c.id === id ? { ...c, ...counselorData } : c))
    );
    setShowModal(false);
  };

  const deleteCounselor = (id: string) => {
    setCounselors(counselors.filter((c) => c.id !== id));
  };

  const addResumePackage = (packageData: Omit<ResumePackage, "id">) => {
    const newPackage: ResumePackage = {
      ...packageData,
      id: `rp${Date.now()}`,
    };
    setResumePackages([...resumePackages, newPackage]);
    setShowModal(false);
  };

  const updateResumePackage = (id: string, packageData: Partial<ResumePackage>) => {
    setResumePackages(
      resumePackages.map((p) => (p.id === id ? { ...p, ...packageData } : p))
    );
    setShowModal(false);
  };

  const deleteResumePackage = (id: string) => {
    setResumePackages(resumePackages.filter((p) => p.id !== id));
  };

  const submitResumeRequest = (requestData: Omit<ResumeRequest, "id" | "createdAt">) => {
    const newRequest: ResumeRequest = {
      ...requestData,
      id: `rr${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedRequests = [...resumeRequests, newRequest];
    setResumeRequests(updatedRequests);
    saveToLocalStorage("resume-requests", updatedRequests);
    setShowModal(false);
  };

  const updateResumeRequest = (
    id: string,
    requestData: Partial<ResumeRequest>
  ) => {
    const updatedRequests = resumeRequests.map((r) =>
      r.id === id ? { ...r, ...requestData } : r
    );
    setResumeRequests(updatedRequests);
    saveToLocalStorage("resume-requests", updatedRequests);
    setShowModal(false);
  };

  const addMockInterviewExpert = (expertData: Omit<MockInterviewExpert, "id">) => {
    const newExpert: MockInterviewExpert = {
      ...expertData,
      id: `ie${Date.now()}`,
    };
    setMockInterviewExperts([...mockInterviewExperts, newExpert]);
    setShowModal(false);
  };

  const updateMockInterviewExpert = (
    id: string,
    expertData: Partial<MockInterviewExpert>
  ) => {
    setMockInterviewExperts(
      mockInterviewExperts.map((e) => (e.id === id ? { ...e, ...expertData } : e))
    );
    setShowModal(false);
  };

  const deleteMockInterviewExpert = (id: string) => {
    setMockInterviewExperts(mockInterviewExperts.filter((e) => e.id !== id));
  };

  const addInterviewPackage = (packageData: Omit<InterviewPackage, "id">) => {
    const newPackage: InterviewPackage = {
      ...packageData,
      id: `ip${Date.now()}`,
    };
    setInterviewPackages([...interviewPackages, newPackage]);
    setShowModal(false);
  };

  const updateInterviewPackage = (
    id: string,
    packageData: Partial<InterviewPackage>
  ) => {
    setInterviewPackages(
      interviewPackages.map((p) => (p.id === id ? { ...p, ...packageData } : p))
    );
    setShowModal(false);
  };

  const deleteInterviewPackage = (id: string) => {
    setInterviewPackages(interviewPackages.filter((p) => p.id !== id));
  };

  const createBooking = (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    saveToLocalStorage("career-bookings", updatedBookings);
    setShowModal(false);
  };

  const updateBooking = (id: string, bookingData: Partial<Booking>) => {
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, ...bookingData } : b
    );
    setBookings(updatedBookings);
    saveToLocalStorage("career-bookings", updatedBookings);
    setShowModal(false);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getTotalCartAmount = () => {
    return cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  };

  const getFilteredMenuItems = (canteenId: string) => {
    let filtered = menuItems.filter((item) => item.canteenId === canteenId);

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getCategories = () => {
    const categories = new Set(menuItems.map((item) => item.category));
    return ["all", ...Array.from(categories)];
  };

  // ============================================
  // RENDER HOME VIEW
  // ============================================

  const renderHomeView = () => {
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-12 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Campus Services Hub</span>
            </motion.div>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Everything You Need,
              <br />
              <span className="text-emerald-200">One Platform</span>
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-emerald-50">
              From delicious meals to career guidance - access all campus services
              with ease. Order food, book counseling sessions, and boost your career!
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView("cafeteria")}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-emerald-600 shadow-lg transition hover:shadow-xl"
              >
                <Coffee className="h-5 w-5" />
                Explore Cafeteria
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView("career")}
                className="flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-8 py-3 font-bold backdrop-blur-sm transition hover:bg-white/20"
              >
                <Briefcase className="h-5 w-5" />
                Career Services
              </motion.button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        </motion.div>

        {/* Role Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => {
                setUserRole("student");
                setIsAdmin(false);
                localStorage.setItem("user-role", "student");
              }}
              className={`rounded-full px-6 py-2 font-semibold transition ${
                userRole === "student"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => {
                setUserRole("admin");
                setIsAdmin(true);
                localStorage.setItem("user-role", "admin");
              }}
              className={`rounded-full px-6 py-2 font-semibold transition ${
                userRole === "admin"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Admin Panel
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg"
          >
            <Coffee className="mb-4 h-10 w-10" />
            <h3 className="text-3xl font-bold">{canteens.length}</h3>
            <p className="text-purple-100">Canteens</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg"
          >
            <UtensilsCrossed className="mb-4 h-10 w-10" />
            <h3 className="text-3xl font-bold">{menuItems.length}</h3>
            <p className="text-blue-100">Menu Items</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-white shadow-lg"
          >
            <GraduationCap className="mb-4 h-10 w-10" />
            <h3 className="text-3xl font-bold">{counselors.length}</h3>
            <p className="text-amber-100">Counselors</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 p-6 text-white shadow-lg"
          >
            <Video className="mb-4 h-10 w-10" />
            <h3 className="text-3xl font-bold">{mockInterviewExperts.length}</h3>
            <p className="text-rose-100">Interview Experts</p>
          </motion.div>
        </div>

        {/* Main Service Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Cafeteria Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition hover:shadow-2xl"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-3xl"></div>
            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <Coffee className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900">
                Cafeteria Services
              </h2>
              <p className="mb-6 text-gray-600">
                Order from multiple canteens across campus. Fresh food, quick
                delivery, and cashless payments.
              </p>
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>{canteens.length} canteens available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Order tracking in real-time</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView("cafeteria")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                Browse Canteens
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Career Services Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition hover:shadow-2xl"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                <Briefcase className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900">
                Career Counseling
              </h2>
              <p className="mb-6 text-gray-600">
                Professional guidance for your career journey. Resume reviews,
                mock interviews, and one-on-one counseling.
              </p>
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Expert career counselors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Industry professionals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Resume & LinkedIn optimization</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView("career")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                Explore Services
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Why Choose Our Platform?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Fast & Easy</h3>
              <p className="text-gray-600">
                Quick ordering and booking process. Get what you need in just a few
                clicks.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Safe and encrypted payment gateway. Your financial data is always
                protected.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Track Everything
              </h3>
              <p className="text-gray-600">
                Monitor your orders and bookings in real-time. Stay updated with
                notifications.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER CAFETERIA VIEW
  // ============================================

  const renderCafeteriaView = () => {
    if (selectedCanteen) {
      return renderMenuView();
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Campus Canteens
            </h1>
            <p className="text-gray-600">
              Choose from {canteens.length} locations across campus
            </p>
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setModalType("add-canteen");
                setSelectedItem(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" />
              Add Canteen
            </motion.button>
          )}
        </div>

        {/* Canteens Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {canteens.map((canteen, index) => (
            <motion.div
              key={canteen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={canteen.image}
                  alt={canteen.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">
                    {canteen.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        canteen.status === "open"
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {canteen.status === "open" ? "Open Now" : "Closed"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold text-white">
                        {canteen.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>{canteen.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>{canteen.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>{canteen.contact}</span>
                  </div>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  {canteen.description}
                </p>
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {canteen.totalOrders} orders
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {menuItems.filter((item) => item.canteenId === canteen.id).length}{" "}
                    items
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCanteen(canteen)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View Menu
                  </motion.button>
                  {isAdmin && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedItem(canteen);
                          setModalType("edit-canteen");
                          setShowModal(true);
                        }}
                        className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (
                            confirm(
                              `Delete ${canteen.name}? This action cannot be undone.`
                            )
                          ) {
                            deleteCanteen(canteen.id);
                          }
                        }}
                        className="rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin: View All Orders */}
        {isAdmin && orders.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Recent Orders
            </h2>
            <div className="space-y-4">
              {orders
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 10)
                .map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl bg-white p-6 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-bold text-gray-900">
                            Order #{order.id.slice(-6)}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.status === "ready"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.paymentStatus === "refunded"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.studentName} • {order.canteenName} • ₹
                          {order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()} •
                          Pickup: {order.pickupTime}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as Order["status"]
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMenuView = () => {
    if (!selectedCanteen) return null;

    const filteredItems = getFilteredMenuItems(selectedCanteen.id);
    const categories = getCategories();

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedCanteen(null)}
              className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCanteen.name}
              </h1>
              <p className="text-gray-600">{selectedCanteen.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isAdmin && cart.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
              >
                <ShoppingCart className="h-5 w-5" />
                View Cart
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {cart.length}
                </span>
              </motion.button>
            )}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setModalType("add-menu-item");
                  setSelectedItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
              >
                <Plus className="h-5 w-5" />
                Add Item
              </motion.button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-6 py-3 font-semibold transition ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <UtensilsCrossed className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute right-2 top-2 flex gap-2">
                    {item.availability === "out-of-stock" && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                        Out of Stock
                      </span>
                    )}
                    {item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">
                        {item.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Customizations */}
                  {item.customizations.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-gray-700">
                        Customizations:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.customizations.map((custom) => (
                          <span
                            key={custom}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                          >
                            {custom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!isAdmin ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (item.availability === "available") {
                            addToCart(item, 1);
                          }
                        }}
                        disabled={item.availability === "out-of-stock"}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
                          item.availability === "available"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedItem(item);
                            setModalType("edit-menu-item");
                            setShowModal(true);
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Edit2 className="h-5 w-5" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (confirm(`Delete ${item.name}?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="rounded-full bg-red-600 p-2 text-white transition hover:bg-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER CAREER VIEW
  // ============================================

  const renderCareerView = () => {
    return (
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl"
          >
            <Briefcase className="h-10 w-10" />
          </motion.div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Career Counseling Services
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Professional guidance to help you succeed in your career journey
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* One-on-One Counseling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <GraduationCap className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-2xl font-bold">One-on-One Counseling</h3>
            <p className="mb-6 text-purple-100">
              Personal career guidance sessions with expert counselors
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setModalType("view-counseling");
                setShowModal(true);
              }}
              className="rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              View Sessions
            </motion.button>
            <div className="mt-4 text-sm text-purple-200">
              {counselors.length} counselors available
            </div>
          </motion.div>

          {/* Resume Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <FileText className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-2xl font-bold">Resume & LinkedIn</h3>
            <p className="mb-6 text-blue-100">
              Professional review and optimization of your profile
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setModalType("view-resume-packages");
                setShowModal(true);
              }}
              className="rounded-full bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View Packages
            </motion.button>
            <div className="mt-4 text-sm text-blue-200">
              Starting from ₹{Math.min(...resumePackages.map((p) => p.price))}
            </div>
          </motion.div>

          {/* Mock Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 p-8 text-white shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <Video className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-2xl font-bold">Mock Interviews</h3>
            <p className="mb-6 text-rose-100">
              Practice with industry experts from top companies
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setModalType("view-interview-experts");
                setShowModal(true);
              }}
              className="rounded-full bg-white px-6 py-3 font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              View Experts
            </motion.button>
            <div className="mt-4 text-sm text-rose-200">
              {mockInterviewExperts.length} industry experts
            </div>
          </motion.div>
        </div>

        {/* Your Bookings (Student View) */}
        {!isAdmin && bookings.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Your Bookings
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {bookings
                .filter((b) => b.studentId === "current-user")
                .map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl bg-white p-6 shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {booking.serviceName}
                        </h3>
                        {booking.expertName && (
                          <p className="text-sm text-gray-600">
                            with {booking.expertName}
                          </p>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        {booking.date} at {booking.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-emerald-600" />₹
                        {booking.price} • {booking.paymentStatus}
                      </div>
                    </div>
                    {booking.meetingLink && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </motion.a>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Admin: All Bookings */}
        {isAdmin && bookings.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                All Bookings
              </h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setModalType("add-counselor");
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 font-semibold text-white"
                >
                  <Plus className="h-5 w-5" />
                  Add Counselor
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setModalType("add-interview-expert");
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 font-semibold text-white"
                >
                  <Plus className="h-5 w-5" />
                  Add Expert
                </motion.button>
              </div>
            </div>
            <div className="space-y-4">
              {bookings
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl bg-white p-6 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-bold text-gray-900">
                            {booking.serviceName}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : booking.status === "confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {booking.studentName}{" "}
                          {booking.expertName && `• ${booking.expertName}`} •
                          {booking.date} {booking.time} • ₹{booking.price}
                        </p>
                        {booking.notes && (
                          <p className="mt-1 text-xs text-gray-500">
                            Notes: {booking.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            updateBooking(booking.id, {
                              status: e.target.value as Booking["status"],
                            })
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Admin: Resume Requests */}
        {isAdmin && resumeRequests.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Resume Requests
            </h2>
            <div className="space-y-4">
              {resumeRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl bg-white p-6 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          {request.packageName}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : request.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : request.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {request.studentName} •{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.linkedinUrl && (
                        <a
                          href={request.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View LinkedIn
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedItem(request);
                          setModalType("manage-resume-request");
                          setShowModal(true);
                        }}
                        className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Manage
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Student: Resume Requests */}
        {!isAdmin && resumeRequests.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Your Resume Requests
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {resumeRequests
                .filter((r) => r.studentId === "current-user")
                .map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl bg-white p-6 shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {request.packageName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Submitted:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          request.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : request.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : request.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    {request.reviewedFile && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <Download className="h-4 w-4" />
                        Download Reviewed Resume
                      </motion.button>
                    )}
                    {request.feedback && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="text-sm font-semibold text-gray-700">
                          Feedback:
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.feedback}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER MODALS
  // ============================================

  const renderModals = () => {
    return (
      <AnimatePresence>
        {/* Cart Modal */}
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Your Cart
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600">
                    Add some delicious items to get started!
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-4">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
                      >
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ₹{item.menuItem.price} × {item.quantity}
                          </p>
                          {item.customization && (
                            <p className="text-xs text-gray-500">
                              {item.customization}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-600">
                            ₹{item.menuItem.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="rounded-full p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 rounded-xl bg-gray-50 p-6">
                    <div className="mb-2 flex items-center justify-between text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{getTotalCartAmount()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCart(false);
                      setModalType("place-order");
                      setShowModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-6 w-6" />
                    Proceed to Checkout
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Place Order Modal */}
        {showModal && modalType === "place-order" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Complete Your Order
              </h2>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pickup Time
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none">
                    <option>ASAP (15-20 mins)</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Method
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <button className="flex items-center gap-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 p-4 font-semibold text-emerald-700">
                      <CreditCard className="h-5 w-5" />
                      Online Payment
                    </button>
                    <button className="flex items-center gap-3 rounded-lg border-2 border-gray-300 p-4 font-semibold text-gray-700 hover:border-emerald-600 hover:bg-emerald-50">
                      <DollarSign className="h-5 w-5" />
                      Cash on Pickup
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="mb-6 rounded-xl bg-gray-50 p-6">
                <h3 className="mb-4 font-bold text-gray-900">
                  Order Summary
                </h3>
                <div className="mb-4 space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{item.menuItem.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-emerald-600">
                      ₹{getTotalCartAmount()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedCanteen) {
                      placeOrder({
                        studentId: "current-user",
                        studentName: "John Doe",
                        canteenId: selectedCanteen.id,
                        canteenName: selectedCanteen.name,
                        items: cart,
                        totalAmount: getTotalCartAmount(),
                        status: "pending",
                        pickupTime: "ASAP",
                        paymentStatus: "paid",
                        paymentMethod: "online",
                      });
                      alert("Order placed successfully! 🎉");
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle className="h-5 w-5" />
                  Confirm Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Counseling Sessions */}
        {showModal && modalType === "view-counseling" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Counseling Sessions & Counselors
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Counselors Grid */}
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Our Expert Counselors
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {counselors.map((counselor) => (
                    <div
                      key={counselor.id}
                      className="rounded-2xl bg-gradient-to-br from-purple-50 to-white p-6 shadow-lg"
                    >
                      <img
                        src={counselor.photo}
                        alt={counselor.name}
                        className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-purple-100"
                      />
                      <h4 className="mb-2 text-lg font-bold text-gray-900">
                        {counselor.name}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600">
                        {counselor.bio}
                      </p>
                      <div className="mb-3 flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{counselor.rating}</span>
                        <span className="text-sm text-gray-600">
                          ({counselor.reviews} reviews)
                        </span>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-1">
                        {counselor.expertise.map((exp) => (
                          <span
                            key={exp}
                            className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                      <p className="mb-4 text-xs text-gray-600">
                        <Clock className="inline h-3 w-3" /> {counselor.availability}
                      </p>
                      {!isAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            createBooking({
                              studentId: "current-user",
                              studentName: "John Doe",
                              serviceType: "counseling",
                              serviceId: counselingSessions[0]?.id || "",
                              serviceName: counselingSessions[0]?.title || "Counseling Session",
                              expertId: counselor.id,
                              expertName: counselor.name,
                              date: new Date().toISOString().split("T")[0],
                              time: "10:00 AM",
                              status: "pending",
                              paymentStatus: "paid",
                              price: counselingSessions[0]?.price || 500,
                            });
                            alert("Booking request sent! 🎉");
                            setShowModal(false);
                          }}
                          className="w-full rounded-full bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
                        >
                          Book Session
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Types */}
              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Available Session Types
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {counselingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-xl border-2 border-purple-200 bg-white p-6"
                    >
                      <h4 className="mb-2 font-bold text-gray-900">
                        {session.title}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600">
                        {session.description}
                      </p>
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {session.duration} mins
                        </span>
                        <span className="font-bold text-purple-600">
                          ₹{session.price}
                        </span>
                      </div>
                      <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        {session.mode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Resume Packages */}
        {showModal && modalType === "view-resume-packages" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Resume Review Packages
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {resumePackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-lg ${
                      pkg.popular
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute right-4 top-4">
                        <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                          <Sparkles className="h-3 w-3" />
                          Popular
                        </span>
                      </div>
                    )}
                    <FileText className="mb-4 h-12 w-12 text-blue-600" />
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {pkg.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {pkg.description}
                    </p>
                    <div className="mb-4">
                      <div className="mb-1 text-3xl font-bold text-blue-600">
                        ₹{pkg.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pkg.turnaroundTime}
                      </div>
                    </div>
                    <ul className="mb-6 space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {!isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          submitResumeRequest({
                            studentId: "current-user",
                            studentName: "John Doe",
                            packageId: pkg.id,
                            packageName: pkg.name,
                            resumeFile: "resume.pdf",
                            status: "pending",
                            paymentStatus: "paid",
                          });
                          alert("Request submitted successfully! 🎉");
                          setShowModal(false);
                        }}
                        className={`w-full rounded-full px-4 py-3 font-bold text-white transition ${
                          pkg.popular
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        Choose Package
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Interview Experts */}
        {showModal && modalType === "view-interview-experts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Mock Interview Experts
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Experts Grid */}
              <div className="mb-8 grid gap-6 md:grid-cols-3">
                {mockInterviewExperts.map((expert, index) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-gradient-to-br from-rose-50 to-white p-6 shadow-lg"
                  >
                    <img
                      src={expert.photo}
                      alt={expert.name}
                      className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-rose-100"
                    />
                    <h4 className="mb-1 text-lg font-bold text-gray-900">
                      {expert.name}
                    </h4>
                    <p className="mb-2 text-sm font-semibold text-rose-600">
                      {expert.position}
                    </p>
                    <p className="mb-1 text-sm text-gray-700">
                      <Building className="inline h-4 w-4" /> {expert.company}
                    </p>
                    <p className="mb-3 text-sm text-gray-600">{expert.bio}</p>
                    <div className="mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{expert.rating}</span>
                      <span className="text-sm text-gray-600">
                        ({expert.reviews} reviews)
                      </span>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-1">
                      {expert.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="rounded-full bg-rose-100 px-2 py-1 text-xs text-rose-700"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                    {!isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          createBooking({
                            studentId: "current-user",
                            studentName: "John Doe",
                            serviceType: "interview",
                            serviceId: interviewPackages[0]?.id || "",
                            serviceName: interviewPackages[0]?.name || "Mock Interview",
                            expertId: expert.id,
                            expertName: expert.name,
                            date: new Date().toISOString().split("T")[0],
                            time: "2:00 PM",
                            status: "pending",
                            paymentStatus: "paid",
                            price: interviewPackages[0]?.price || 600,
                            meetingLink: "https://meet.google.com/abc-defg-hij",
                          });
                          alert("Interview booked successfully! 🎉");
                          setShowModal(false);
                        }}
                        className="w-full rounded-full bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700"
                      >
                        Book Interview
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Interview Packages */}
              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Interview Packages
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {interviewPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border-2 border-rose-200 bg-white p-6"
                    >
                      <h4 className="mb-2 font-bold text-gray-900">
                        {pkg.name}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600">
                        {pkg.description}
                      </p>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {pkg.duration} mins
                        </span>
                        <span className="text-xl font-bold text-rose-600">
                          ₹{pkg.price}
                        </span>
                      </div>
                      <ul className="mb-3 space-y-1">
                        {pkg.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs"
                          >
                            <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-600" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        {pkg.mode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-gray-700 shadow-md transition hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            {!isAdmin && cart.length > 0 && currentView === "cafeteria" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCart(true)}
                className="relative rounded-full bg-emerald-600 p-3 text-white shadow-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {cart.length}
                </span>
              </motion.button>
            )}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-full bg-white p-3 shadow-md transition hover:shadow-lg"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        {currentView !== "home" && (
          <div className="mb-8">
            <div className="inline-flex rounded-full bg-white p-1 shadow-lg">
              <button
                onClick={() => setCurrentView("home")}
                className="rounded-full px-6 py-2 font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                <Home className="inline h-5 w-5" /> Home
              </button>
              <button
                onClick={() => setCurrentView("cafeteria")}
                className={`rounded-full px-6 py-2 font-semibold transition ${
                  currentView === "cafeteria"
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Coffee className="inline h-5 w-5" /> Cafeteria
              </button>
              <button
                onClick={() => setCurrentView("career")}
                className={`rounded-full px-6 py-2 font-semibold transition ${
                  currentView === "career"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Briefcase className="inline h-5 w-5" /> Career
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderHomeView()}
            </motion.div>
          )}
          {currentView === "cafeteria" && (
            <motion.div
              key="cafeteria"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCafeteriaView()}
            </motion.div>
          )}
          {currentView === "career" && (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCareerView()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        {renderModals()}
      </div>
    </main>
  );
}
