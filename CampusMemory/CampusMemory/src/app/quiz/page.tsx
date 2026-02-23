"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Trophy,
  Star,
  Play,
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Zap,
  Crown,
  Sparkles,
  Users,
  Save,
  X,
  ChevronRight,
  Home,
  Timer,
  BarChart3,
  Flame,
  GraduationCap,
} from "lucide-react";

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: Question[];
  timeLimit: number; // seconds per question
  createdAt: string;
  // Academic filters
  course?: string; // B.Tech, BCA, BBA, MBA, B.Sc, etc.
  program?: string; // CSE, IT, ECE, Mechanical, etc.
  section?: string; // A, B, C, D, E
  year?: number; // 1, 2, 3, 4
  semester?: number; // 1-8
  tags?: string[]; // Additional tags
}

interface QuizResult {
  quizId: string;
  quizTitle: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: string;
}

export default function QuizPage() {
  const [view, setView] = useState<"home" | "admin" | "quiz" | "results" | "leaderboard" | "filter">("filter");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [lastScore, setLastScore] = useState<QuizResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Academic filters
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  
  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showQuizForm, setShowQuizForm] = useState(false);

  // Initialize data from localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem("campusQuizzes");
    const savedResults = localStorage.getItem("campusQuizResults");
    const savedPlayerName = localStorage.getItem("campusQuizPlayerName");
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
      // Initialize with comprehensive sample quizzes
      const sampleQuizzes: Quiz[] = [
        // B.Tech CSE Quizzes
        {
          id: "q1",
          title: "Data Structures Fundamentals",
          description: "Arrays, Linked Lists, Stacks & Queues",
          category: "Programming",
          difficulty: "Medium",
          timeLimit: 45,
          course: "B.Tech",
          program: "CSE",
          year: 2,
          semester: 3,
          section: "All",
          tags: ["DSA", "Programming", "Core"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q1-1",
              question: "What is the time complexity of accessing an element in an array?",
              options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
              correctAnswer: 0,
              explanation: "Array access is O(1) as elements are stored contiguously in memory"
            },
            {
              id: "q1-2",
              question: "Which data structure uses LIFO principle?",
              options: ["Queue", "Stack", "Array", "Tree"],
              correctAnswer: 1,
              explanation: "Stack follows Last In First Out (LIFO) principle"
            },
            {
              id: "q1-3",
              question: "What is the main advantage of a linked list over an array?",
              options: ["Faster access", "Dynamic size", "Less memory", "Simpler code"],
              correctAnswer: 1,
              explanation: "Linked lists can grow and shrink dynamically, unlike fixed-size arrays"
            },
            {
              id: "q1-4",
              question: "In which data structure is BFS (Breadth First Search) implemented?",
              options: ["Stack", "Queue", "Tree", "Graph"],
              correctAnswer: 1,
              explanation: "BFS uses a Queue to explore nodes level by level"
            }
          ]
        },
        {
          id: "q2",
          title: "Object-Oriented Programming",
          description: "OOP concepts - Inheritance, Polymorphism, Encapsulation",
          category: "Programming",
          difficulty: "Easy",
          timeLimit: 30,
          course: "B.Tech",
          program: "CSE",
          year: 1,
          semester: 2,
          section: "All",
          tags: ["OOP", "Java", "C++"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q2-1",
              question: "What is encapsulation in OOP?",
              options: [
                "Hiding implementation details",
                "Creating multiple classes",
                "Using inheritance",
                "Defining methods"
              ],
              correctAnswer: 0,
              explanation: "Encapsulation means bundling data and methods while hiding internal details"
            },
            {
              id: "q2-2",
              question: "Which concept allows a class to inherit properties from another class?",
              options: ["Polymorphism", "Inheritance", "Abstraction", "Encapsulation"],
              correctAnswer: 1,
              explanation: "Inheritance enables a class to acquire properties and methods of another class"
            },
            {
              id: "q2-3",
              question: "What does polymorphism mean?",
              options: [
                "Many forms of the same entity",
                "Single form",
                "No forms",
                "Hidden forms"
              ],
              correctAnswer: 0,
              explanation: "Polymorphism allows objects to take many forms (method overloading/overriding)"
            }
          ]
        },
        // B.Tech ECE Quizzes
        {
          id: "q3",
          title: "Digital Electronics Basics",
          description: "Logic gates, Boolean algebra, and circuits",
          category: "Electronics",
          difficulty: "Medium",
          timeLimit: 40,
          course: "B.Tech",
          program: "ECE",
          year: 2,
          semester: 3,
          section: "All",
          tags: ["Digital", "Electronics", "Logic"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q3-1",
              question: "Which gate gives output 1 only when both inputs are 1?",
              options: ["OR", "AND", "NOT", "XOR"],
              correctAnswer: 1,
              explanation: "AND gate outputs 1 only when all inputs are 1"
            },
            {
              id: "q3-2",
              question: "What is a Universal gate?",
              options: ["AND", "OR", "NAND", "NOT"],
              correctAnswer: 2,
              explanation: "NAND and NOR are universal gates as they can implement any Boolean function"
            },
            {
              id: "q3-3",
              question: "How many input combinations are possible with 3 input variables?",
              options: ["6", "8", "9", "16"],
              correctAnswer: 1,
              explanation: "2^n combinations where n=3, so 2^3 = 8 combinations"
            }
          ]
        },
        // BCA Quizzes
        {
          id: "q4",
          title: "Database Management Systems",
          description: "SQL, Normalization, and DBMS concepts",
          category: "Database",
          difficulty: "Medium",
          timeLimit: 35,
          course: "BCA",
          program: "Computer Applications",
          year: 2,
          semester: 4,
          section: "All",
          tags: ["DBMS", "SQL", "Database"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q4-1",
              question: "Which SQL command is used to retrieve data?",
              options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
              correctAnswer: 1,
              explanation: "SELECT is used to query and retrieve data from database tables"
            },
            {
              id: "q4-2",
              question: "What does ACID stand for in database transactions?",
              options: [
                "Atomicity, Consistency, Isolation, Durability",
                "Access, Control, Integration, Data",
                "Automatic, Consistent, Independent, Durable",
                "All, Complete, Independent, Data"
              ],
              correctAnswer: 0,
              explanation: "ACID: Atomicity, Consistency, Isolation, Durability - ensures reliable transactions"
            },
            {
              id: "q4-3",
              question: "Which normal form eliminates transitive dependencies?",
              options: ["1NF", "2NF", "3NF", "BCNF"],
              correctAnswer: 2,
              explanation: "Third Normal Form (3NF) removes transitive dependencies"
            },
            {
              id: "q4-4",
              question: "What is a primary key?",
              options: [
                "A unique identifier for a record",
                "A foreign reference",
                "An index column",
                "A nullable field"
              ],
              correctAnswer: 0,
              explanation: "Primary key uniquely identifies each record in a table"
            }
          ]
        },
        // MBA Quizzes
        {
          id: "q5",
          title: "Marketing Management",
          description: "Marketing strategies, 4Ps, and consumer behavior",
          category: "Management",
          difficulty: "Easy",
          timeLimit: 30,
          course: "MBA",
          program: "Marketing",
          year: 1,
          semester: 1,
          section: "All",
          tags: ["Marketing", "Business", "Strategy"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q5-1",
              question: "What are the 4Ps of Marketing?",
              options: [
                "Product, Price, Place, Promotion",
                "People, Process, Physical, Promotion",
                "Profit, Price, Product, People",
                "Plan, Prepare, Present, Promote"
              ],
              correctAnswer: 0,
              explanation: "The Marketing Mix consists of Product, Price, Place, and Promotion"
            },
            {
              id: "q5-2",
              question: "What is market segmentation?",
              options: [
                "Dividing market into distinct groups",
                "Increasing market share",
                "Reducing prices",
                "Expanding product line"
              ],
              correctAnswer: 0,
              explanation: "Market segmentation divides a market into distinct groups of buyers"
            },
            {
              id: "q5-3",
              question: "What does USP stand for?",
              options: [
                "Universal Sales Process",
                "Unique Selling Proposition",
                "Ultimate Service Provider",
                "United Sales Platform"
              ],
              correctAnswer: 1,
              explanation: "USP is the Unique Selling Proposition that differentiates a product"
            }
          ]
        },
        // BBA Quizzes
        {
          id: "q6",
          title: "Financial Accounting Basics",
          description: "Accounting principles, journal entries, and statements",
          category: "Finance",
          difficulty: "Easy",
          timeLimit: 25,
          course: "BBA",
          program: "Finance",
          year: 1,
          semester: 1,
          section: "All",
          tags: ["Accounting", "Finance", "Business"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q6-1",
              question: "Which is an asset account?",
              options: ["Revenue", "Cash", "Equity", "Liability"],
              correctAnswer: 1,
              explanation: "Cash is an asset - resources owned by the company"
            },
            {
              id: "q6-2",
              question: "What is the accounting equation?",
              options: [
                "Assets = Liabilities + Equity",
                "Revenue - Expenses = Profit",
                "Debit = Credit",
                "Income - Costs = Net Income"
              ],
              correctAnswer: 0,
              explanation: "The fundamental accounting equation: Assets = Liabilities + Equity"
            },
            {
              id: "q6-3",
              question: "Which financial statement shows profitability?",
              options: [
                "Balance Sheet",
                "Income Statement",
                "Cash Flow Statement",
                "Statement of Changes"
              ],
              correctAnswer: 1,
              explanation: "Income Statement (P&L) shows revenue, expenses, and profit/loss"
            }
          ]
        },
        // B.Sc Chemistry Quiz
        {
          id: "q7",
          title: "Organic Chemistry Fundamentals",
          description: "Hydrocarbons, functional groups, and reactions",
          category: "Science",
          difficulty: "Medium",
          timeLimit: 40,
          course: "B.Sc",
          program: "Chemistry",
          year: 2,
          semester: 3,
          section: "All",
          tags: ["Chemistry", "Organic", "Science"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q7-1",
              question: "What is the general formula for alkanes?",
              options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
              correctAnswer: 1,
              explanation: "Alkanes follow the general formula CnH2n+2 (saturated hydrocarbons)"
            },
            {
              id: "q7-2",
              question: "Which functional group is present in alcohols?",
              options: ["-COOH", "-OH", "-CHO", "-NH2"],
              correctAnswer: 1,
              explanation: "Alcohols contain the hydroxyl (-OH) functional group"
            },
            {
              id: "q7-3",
              question: "What type of bond is present in benzene?",
              options: [
                "Single bonds",
                "Double bonds",
                "Delocalized bonds",
                "Triple bonds"
              ],
              correctAnswer: 2,
              explanation: "Benzene has delocalized pi electrons forming resonance structures"
            }
          ]
        },
        // B.Tech IT Quiz
        {
          id: "q8",
          title: "Computer Networks",
          description: "OSI model, protocols, and network architecture",
          category: "Networking",
          difficulty: "Hard",
          timeLimit: 50,
          course: "B.Tech",
          program: "IT",
          year: 3,
          semester: 5,
          section: "All",
          tags: ["Networks", "Protocol", "Internet"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q8-1",
              question: "How many layers are in the OSI model?",
              options: ["5", "6", "7", "8"],
              correctAnswer: 2,
              explanation: "OSI model has 7 layers from Physical to Application"
            },
            {
              id: "q8-2",
              question: "Which protocol is used for secure web browsing?",
              options: ["HTTP", "FTP", "HTTPS", "SMTP"],
              correctAnswer: 2,
              explanation: "HTTPS (HTTP Secure) uses SSL/TLS for encrypted communication"
            },
            {
              id: "q8-3",
              question: "What is the default port for HTTP?",
              options: ["21", "22", "80", "443"],
              correctAnswer: 2,
              explanation: "HTTP uses port 80 by default (HTTPS uses 443)"
            },
            {
              id: "q8-4",
              question: "Which device operates at the Data Link layer?",
              options: ["Router", "Switch", "Hub", "Gateway"],
              correctAnswer: 1,
              explanation: "Switches operate at Layer 2 (Data Link) using MAC addresses"
            },
            {
              id: "q8-5",
              question: "What does TCP stand for?",
              options: [
                "Transmission Control Protocol",
                "Transfer Connection Protocol",
                "Transport Channel Protocol",
                "Technical Communication Protocol"
              ],
              correctAnswer: 0,
              explanation: "TCP is Transmission Control Protocol, providing reliable data transfer"
            }
          ]
        },
        // General Quiz (All students)
        {
          id: "q9",
          title: "General Aptitude Test",
          description: "Logical reasoning and quantitative aptitude",
          category: "Aptitude",
          difficulty: "Medium",
          timeLimit: 30,
          course: "All",
          program: "All",
          year: 0,
          semester: 0,
          section: "All",
          tags: ["Aptitude", "Reasoning", "Placement"],
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: "q9-1",
              question: "If 5 workers can complete a task in 12 days, how many days will 10 workers take?",
              options: ["24 days", "6 days", "10 days", "15 days"],
              correctAnswer: 1,
              explanation: "More workers = less time. 5×12 = 10×x, so x = 6 days"
            },
            {
              id: "q9-2",
              question: "Complete the series: 2, 6, 12, 20, 30, __",
              options: ["40", "42", "44", "36"],
              correctAnswer: 1,
              explanation: "Pattern: n×(n+1) where n= 1,2,3,4,5,6. Next is 6×7=42"
            },
            {
              id: "q9-3",
              question: "What is 15% of 200?",
              options: ["25", "30", "35", "40"],
              correctAnswer: 1,
              explanation: "15% of 200 = 15/100 × 200 = 30"
            },
            {
              id: "q9-4",
              question: "If A is taller than B, and B is taller than C, then:",
              options: [
                "C is tallest",
                "A is tallest",
                "B is tallest",
                "Cannot determine"
              ],
              correctAnswer: 1,
              explanation: "Transitive relation: If A>B and B>C, then A>C. A is tallest"
            }
          ]
        }
      ];
      setQuizzes(sampleQuizzes);
      localStorage.setItem("campusQuizzes", JSON.stringify(sampleQuizzes));
    }
    
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
    
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (view === "quiz" && selectedQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (view === "quiz" && timeLeft === 0 && selectedQuiz) {
      // Auto-submit when time runs out
      handleNextQuestion();
    }
  }, [timeLeft, view, selectedQuiz]);

  // Play sound effect
  const playSound = (type: "correct" | "wrong" | "complete") => {
    if (!soundEnabled) return;
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === "correct") {
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
    } else if (type === "wrong") {
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.3;
    } else {
      oscillator.frequency.value = 1000;
      gainNode.gain.value = 0.2;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Start quiz
  const startQuiz = (quiz: Quiz) => {
    if (!playerName) {
      setSelectedQuiz(quiz);
      setShowNamePrompt(true);
      return;
    }
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeLeft(quiz.timeLimit);
    setQuizStartTime(Date.now());
    setView("quiz");
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (!selectedQuiz) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    playSound(correct ? "correct" : "wrong");
    
    setTimeout(() => {
      setShowFeedback(false);
      handleNextQuestion();
    }, 1500);
  };

  // Next question or finish quiz
  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(selectedQuiz.timeLimit);
    } else {
      finishQuiz();
    }
  };

  // Finish quiz and calculate results
  const finishQuiz = () => {
    if (!selectedQuiz) return;
    
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return answer === selectedQuiz.questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    const result: QuizResult = {
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      playerName,
      score,
      totalQuestions: selectedQuiz.questions.length,
      timeTaken,
      date: new Date().toISOString()
    };
    
    const newResults = [...results, result];
    setResults(newResults);
    setLastScore(result);
    localStorage.setItem("campusQuizResults", JSON.stringify(newResults));
    
    playSound("complete");
    setView("results");
  };

  // Admin functions
  const handleAdminLogin = () => {
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setView("admin");
    } else {
      alert("Incorrect password!");
    }
  };

  const handleCreateQuiz = (quiz: Quiz) => {
    const newQuizzes = [...quizzes, quiz];
    setQuizzes(newQuizzes);
    localStorage.setItem("campusQuizzes", JSON.stringify(newQuizzes));
    setShowQuizForm(false);
    setEditingQuiz(null);
  };

  const handleUpdateQuiz = (updatedQuiz: Quiz) => {
    const newQuizzes = quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q);
    setQuizzes(newQuizzes);
    localStorage.setItem("campusQuizzes", JSON.stringify(newQuizzes));
    setShowQuizForm(false);
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      const newQuizzes = quizzes.filter(q => q.id !== quizId);
      setQuizzes(newQuizzes);
      localStorage.setItem("campusQuizzes", JSON.stringify(newQuizzes));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Programming": return <Zap className="w-5 h-5" />;
      case "General": return <Brain className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  // Get leaderboard
  const getLeaderboard = () => {
    return results
      .sort((a, b) => {
        if (b.score / b.totalQuestions !== a.score / a.totalQuestions) {
          return (b.score / b.totalQuestions) - (a.score / a.totalQuestions);
        }
        return a.timeTaken - b.timeTaken;
      })
      .slice(0, 10);
  };

  // Get filtered quizzes based on selected filters
  const getFilteredQuizzes = () => {
    return quizzes.filter(quiz => {
      if (selectedCourse && selectedCourse !== "All" && quiz.course !== selectedCourse && quiz.course !== "All") return false;
      if (selectedProgram && selectedProgram !== "All" && quiz.program !== selectedProgram && quiz.program !== "All") return false;
      if (selectedYear && selectedYear !== 0 && quiz.year !== selectedYear && quiz.year !== 0) return false;
      if (selectedSection && selectedSection !== "All" && quiz.section !== selectedSection && quiz.section !== "All") return false;
      if (selectedCategory && selectedCategory !== "All" && quiz.category !== selectedCategory) return false;
      if (selectedDifficulty && selectedDifficulty !== "All" && quiz.difficulty !== selectedDifficulty) return false;
      return true;
    });
  };

  // Get unique courses
  const getCourses = () => {
    const courses = new Set(quizzes.map(q => q.course).filter(c => c && c !== "All"));
    return ["All", ...Array.from(courses).sort()];
  };

  // Get unique programs for selected course
  const getPrograms = () => {
    const programs = new Set(
      quizzes
        .filter(q => !selectedCourse || selectedCourse === "All" || q.course === selectedCourse || q.course === "All")
        .map(q => q.program)
        .filter(p => p && p !== "All")
    );
    return ["All", ...Array.from(programs).sort()];
  };

  // Get unique categories
  const getCategories = () => {
    const categories = new Set(quizzes.map(q => q.category).filter(c => c));
    return ["All", ...Array.from(categories).sort()];
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCourse("");
    setSelectedProgram("");
    setSelectedSection("");
    setSelectedYear(null);
    setSelectedCategory("");
    setSelectedDifficulty("");
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? "bg-purple-500" : "bg-blue-400"
        } animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? "bg-pink-500" : "bg-purple-400"
        } animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10">
        {/* FILTER VIEW */}
        {view === "filter" && (
          <FilterView
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            getCourses={getCourses}
            getPrograms={getPrograms}
            getCategories={getCategories}
            resetFilters={resetFilters}
            setView={setView}
            setShowAdminLogin={setShowAdminLogin}
            quizzes={quizzes}
          />
        )}

        {/* HOME VIEW */}
        {view === "home" && (
          <HomeView
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            quizzes={getFilteredQuizzes()}
            startQuiz={startQuiz}
            setView={setView}
            setShowAdminLogin={setShowAdminLogin}
            getDifficultyColor={getDifficultyColor}
            getCategoryIcon={getCategoryIcon}
            selectedCourse={selectedCourse}
            selectedProgram={selectedProgram}
            selectedYear={selectedYear}
            resetFilters={resetFilters}
          />
        )}

        {/* QUIZ VIEW */}
        {view === "quiz" && selectedQuiz && (
          <QuizView
            darkMode={darkMode}
            selectedQuiz={selectedQuiz}
            currentQuestionIndex={currentQuestionIndex}
            timeLeft={timeLeft}
            selectedAnswers={selectedAnswers}
            handleAnswerSelect={handleAnswerSelect}
            setView={setView}
            setSelectedQuiz={setSelectedQuiz}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        )}

        {/* RESULTS VIEW */}
        {view === "results" && lastScore && selectedQuiz && (
          <ResultsView
            darkMode={darkMode}
            lastScore={lastScore}
            selectedQuiz={selectedQuiz}
            selectedAnswers={selectedAnswers}
            setView={setView}
            setSelectedQuiz={setSelectedQuiz}
          />
        )}

        {/* LEADERBOARD VIEW */}
        {view === "leaderboard" && (
          <LeaderboardView
            darkMode={darkMode}
            leaderboard={getLeaderboard()}
            setView={setView}
          />
        )}

        {/* ADMIN VIEW */}
        {view === "admin" && isAdmin && (
          <AdminView
            darkMode={darkMode}
            quizzes={quizzes}
            setView={setView}
            setShowQuizForm={setShowQuizForm}
            setEditingQuiz={setEditingQuiz}
            handleDeleteQuiz={handleDeleteQuiz}
            getDifficultyColor={getDifficultyColor}
          />
        )}

        {/* Name Prompt Modal */}
        {showNamePrompt && (
          <NamePromptModal
            playerName={playerName}
            setPlayerName={setPlayerName}
            setShowNamePrompt={setShowNamePrompt}
            selectedQuiz={selectedQuiz}
            startQuiz={startQuiz}
          />
        )}

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <AdminLoginModal
            darkMode={darkMode}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            handleAdminLogin={handleAdminLogin}
            setShowAdminLogin={setShowAdminLogin}
          />
        )}

        {/* Quiz Form Modal */}
        {showQuizForm && (
          <QuizFormModal
            darkMode={darkMode}
            editingQuiz={editingQuiz}
            setShowQuizForm={setShowQuizForm}
            handleCreateQuiz={handleCreateQuiz}
            handleUpdateQuiz={handleUpdateQuiz}
            setEditingQuiz={setEditingQuiz}
          />
        )}
      </div>
    </main>
  );
}

// Component Definitions Follow...
function FilterView({ 
  darkMode, setDarkMode, soundEnabled, setSoundEnabled,
  selectedCourse, setSelectedCourse,
  selectedProgram, setSelectedProgram,
  selectedYear, setSelectedYear,
  selectedSection, setSelectedSection,
  selectedCategory, setSelectedCategory,
  selectedDifficulty, setSelectedDifficulty,
  getCourses, getPrograms, getCategories,
  resetFilters, setView, setShowAdminLogin, quizzes
}: any) {
  const courses = getCourses();
  const programs = getPrograms();
  const categories = getCategories();
  const years = [1, 2, 3, 4];
  const sections = ["A", "B", "C", "D", "E"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredCount = quizzes.filter((quiz: Quiz) => {
    if (selectedCourse && selectedCourse !== "All" && quiz.course !== selectedCourse && quiz.course !== "All") return false;
    if (selectedProgram && selectedProgram !== "All" && quiz.program !== selectedProgram && quiz.program !== "All") return false;
    if (selectedYear && selectedYear !== 0 && quiz.year !== selectedYear && quiz.year !== 0) return false;
    if (selectedSection && selectedSection !== "All" && quiz.section !== selectedSection && quiz.section !== "All") return false;
    if (selectedCategory && selectedCategory !== "All" && quiz.category !== selectedCategory) return false;
    if (selectedDifficulty && selectedDifficulty !== "All" && quiz.difficulty !== selectedDifficulty) return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition backdrop-blur ${
              darkMode
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-white/80 text-gray-900 hover:bg-white shadow-lg"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full transition ${
                darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100"
              }`}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition ${
                darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100"
              }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setShowAdminLogin(true)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
                darkMode
                  ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              <Settings className="h-4 w-4" />
              Admin
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              darkMode
                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className={`text-6xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Your Perfect Quiz
            </span>
          </h1>
          
          <p className={`text-xl max-w-2xl mx-auto mb-4 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Filter by course, program, year, and more to find quizzes tailored for you
          </p>

          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur ${
            darkMode ? "bg-white/10" : "bg-white/80"
          }`}>
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {filteredCount} quizzes available with current filters
            </span>
          </div>
        </motion.div>

        {/* Filter Cards */}
        <div className="max-w-6xl mx-auto space-y-8 mb-12">
          {/* Academic Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Academic Filters
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Filter by your course, program, year, and section
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Course Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  📚 Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setSelectedProgram(""); // Reset dependent filter
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">Select Course</option>
                  {courses.map((course: string) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Program Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  🎓 Program/Branch
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">Select Program</option>
                  {programs.map((program: string) => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  📅 Year
                </label>
                <select
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year === 1 ? "1st Year" : year === 2 ? "2nd Year" : year === 3 ? "3rd Year" : "4th Year"}</option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  🏫 Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Quiz Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-3xl p-8 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-orange-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Quiz Preferences
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose category and difficulty level
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  📂 Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">All Categories</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ⚡ Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none`}
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView("home")}
              disabled={filteredCount === 0}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                filteredCount === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl text-white"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                Show {filteredCount} Quizzes
                <ChevronRight className="w-6 h-6" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className={`rounded-2xl p-6 text-center backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/80"}`}>
            <div className="text-3xl mb-2">🎯</div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {quizzes.length}
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Quizzes</div>
          </div>

          <div className={`rounded-2xl p-6 text-center backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/80"}`}>
            <div className="text-3xl mb-2">📚</div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {courses.length - 1}
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Courses</div>
          </div>

          <div className={`rounded-2xl p-6 text-center backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/80"}`}>
            <div className="text-3xl mb-2">🎓</div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {programs.length - 1}
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Programs</div>
          </div>

          <div className={`rounded-2xl p-6 text-center backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/80"}`}>
            <div className="text-3xl mb-2">📂</div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {categories.length - 1}
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Categories</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HomeView({ darkMode, setDarkMode, soundEnabled, setSoundEnabled, quizzes, startQuiz, setView, setShowAdminLogin, getDifficultyColor, getCategoryIcon, selectedCourse, selectedProgram, selectedYear, resetFilters }: any) {
  const categories = Array.from(new Set(quizzes.map((q: Quiz) => q.category)));
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition backdrop-blur ${
            darkMode
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-white/80 text-gray-900 hover:bg-white shadow-lg"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-full transition ${
              darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100"
            }`}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition ${
              darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setShowAdminLogin(true)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
              darkMode
                ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            <Settings className="h-4 w-4" />
            Admin
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            darkMode
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className={`text-6xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz Arena
          </span>
        </h1>
        
        <p className={`text-xl max-w-2xl mx-auto mb-6 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          Test your knowledge, compete with peers, and climb the leaderboard!
        </p>

        {/* Active Filters Display */}
        {(selectedCourse || selectedProgram || selectedYear) && (
          <div className={`inline-flex flex-wrap items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur mb-4 ${
            darkMode ? "bg-white/10" : "bg-white/80"
          }`}>
            <span className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Filters:
            </span>
            {selectedCourse && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-sm font-semibold">
                📚 {selectedCourse}
              </span>
            )}
            {selectedProgram && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 text-sm font-semibold">
                🎓 {selectedProgram}
              </span>
            )}
            {selectedYear && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-sm font-semibold">
                📅 Year {selectedYear}
              </span>
            )}
            <button
              onClick={() => {
                resetFilters();
                setView("filter");
              }}
              className="ml-2 text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Clear All
            </button>
          </div>
        )}

        <button
          onClick={() => setView("filter")}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
            darkMode
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
          }`}
        >
          <Target className="w-5 h-5" />
          Change Filters
        </button>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80 shadow-xl"
            }`}
          >
            <Trophy className={`w-10 h-10 mx-auto mb-3 ${
              darkMode ? "text-yellow-400" : "text-yellow-600"
            }`} />
            <h3 className={`font-bold text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              {quizzes.length}
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Available Quizzes</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80 shadow-xl"
            }`}
          >
            <Users className={`w-10 h-10 mx-auto mb-3 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`} />
            <h3 className={`font-bold text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              {categories.length}
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Categories</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80 shadow-xl"
            }`}
            onClick={() => setView("leaderboard")}
          >
            <Crown className={`w-10 h-10 mx-auto mb-3 ${
              darkMode ? "text-purple-400" : "text-purple-600"
            }`} />
            <h3 className={`font-bold text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Top 10
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} cursor-pointer hover:underline`}>
              View Leaderboard
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz: Quiz, index: number) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`rounded-2xl p-6 backdrop-blur cursor-pointer group relative overflow-hidden ${
              darkMode
                ? "bg-white/10 hover:bg-white/15"
                : "bg-white/80 hover:bg-white shadow-xl"
            }`}
            onClick={() => startQuiz(quiz)}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              {/* Academic Info Badge */}
              {(quiz.course || quiz.program) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {quiz.course && quiz.course !== "All" && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      darkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}>
                      📚 {quiz.course}
                    </span>
                  )}
                  {quiz.program && quiz.program !== "All" && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                    }`}>
                      🎓 {quiz.program}
                    </span>
                  )}
                  {quiz.year && quiz.year !== 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      darkMode ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                    }`}>
                      📅 Year {quiz.year}
                    </span>
                  )}
                </div>
              )}

              {/* Category Icon */}
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold mb-4 ${
                darkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
              }`}>
                {getCategoryIcon(quiz.category)}
                {quiz.category}
              </div>
              
              {/* Title */}
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {quiz.title}
              </h3>
              
              {/* Description */}
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {quiz.description}
              </p>

              {/* Tags */}
              {quiz.tags && quiz.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {quiz.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded ${
                        darkMode ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Meta Info */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  <Target className="w-4 h-4" />
                  {quiz.questions.length} Questions
                </span>
                
                <span className={`inline-flex items-center gap-1 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  <Clock className="w-4 h-4" />
                  {quiz.timeLimit}s each
                </span>
              </div>
              
              {/* Difficulty Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  getDifficultyColor(quiz.difficulty)
                }`}>
                  {quiz.difficulty}
                </span>
                
                <motion.div
                  className="flex items-center gap-2 text-sm font-semibold text-purple-600"
                  whileHover={{ x: 5 }}
                >
                  Start Quiz
                  <Play className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {quizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-3xl backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white/80"
            }`}
          >
            <Brain className={`w-20 h-20 mx-auto mb-6 opacity-50 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              No Quizzes Found
            </h3>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No quizzes match your current filters. Try adjusting your selection.
            </p>
            <button
              onClick={() => {
                resetFilters();
                setView("filter");
              }}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
            >
              Change Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuizView({ darkMode, selectedQuiz, currentQuestionIndex, timeLeft, selectedAnswers, handleAnswerSelect, setView, setSelectedQuiz, showFeedback, isCorrect }: any) {
  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;
  const timePercentage = (timeLeft / selectedQuiz.timeLimit) * 100;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-3xl rounded-3xl p-8 backdrop-blur shadow-2xl ${
          darkMode ? "bg-white/10" : "bg-white/90"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to quit this quiz?")) {
                setView("home");
                setSelectedQuiz(null);
              }
            }}
            className={`p-2 rounded-full transition ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <X className={`w-6 h-6 ${darkMode ? "text-white" : "text-gray-900"}`} />
          </button>
          
          <div className={`text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
            <p className="text-sm opacity-70">Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</p>
            <h2 className="font-bold text-xl">{selectedQuiz.title}</h2>
          </div>
          
          {/* Timer */}
          <motion.div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
              timeLeft <= 5 ? "text-red-600" : darkMode ? "text-white" : "text-gray-900"
            }`}
            animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <svg className="absolute inset-0 w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="opacity-20"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - timePercentage / 100)}`}
                className={timeLeft <= 5 ? "stroke-red-500" : "stroke-blue-500"}
              />
            </svg>
            <span className="relative z-10">{timeLeft}</span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className={`h-2 rounded-full overflow-hidden ${
            darkMode ? "bg-white/20" : "bg-gray-200"
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-8"
        >
          <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {currentQuestion.question}
          </h3>
          
          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              const shouldShowCorrect = showFeedback && index === currentQuestion.correctAnswer;
              const shouldShowWrong = showFeedback && isSelected && index !== currentQuestion.correctAnswer;
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                  whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                  onClick={() => !showFeedback && handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left font-semibold transition-all relative overflow-hidden ${
                    shouldShowCorrect
                      ? "bg-green-500 text-white"
                      : shouldShowWrong
                      ? "bg-red-500 text-white"
                      : darkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        shouldShowCorrect || shouldShowWrong
                          ? "bg-white/20"
                          : darkMode
                          ? "bg-white/10"
                          : "bg-white"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                    {shouldShowCorrect && <CheckCircle2 className="w-6 h-6" />}
                    {shouldShowWrong && <XCircle className="w-6 h-6" />}
                  </div>
                  
                  {(shouldShowCorrect || shouldShowWrong) && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Feedback Animation */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 p-4 rounded-xl ${
                isCorrect
                  ? "bg-green-500/20 border-2 border-green-500"
                  : "bg-red-500/20 border-2 border-red-500"
              }`}
            >
              <p className={`font-semibold ${
                isCorrect
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {isCorrect ? "✓ Correct!" : "✗ Incorrect!"}
              </p>
              {currentQuestion.explanation && (
                <p className={`text-sm mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentQuestion.explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confetti Effect (would need react-confetti library) */}
    </div>
  );
}

function ResultsView({ darkMode, lastScore, selectedQuiz, selectedAnswers, setView, setSelectedQuiz }: any) {
  const percentage = (lastScore.score / lastScore.totalQuestions) * 100;
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-4xl rounded-3xl p-8 backdrop-blur shadow-2xl ${
          darkMode ? "bg-white/10" : "bg-white/90"
        }`}
      >
        {/* Celebration */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 1, repeat: 2 }}
          >
            {isPerfect ? (
              <Crown className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
            ) : isGood ? (
              <Trophy className="w-24 h-24 mx-auto mb-4 text-blue-500" />
            ) : (
              <Target className="w-24 h-24 mx-auto mb-4 text-gray-500" />
            )}
          </motion.div>
          
          <h2 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {isPerfect ? "Perfect Score! 🎉" : isGood ? "Great Job! 👏" : "Good Effort! 💪"}
          </h2>
          
          <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {lastScore.playerName}, you scored
          </p>
          
          <motion.div
            className="text-7xl font-bold my-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {lastScore.score}/{lastScore.totalQuestions}
          </motion.div>
          
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {percentage.toFixed(0)}% • Completed in {Math.floor(lastScore.timeTaken / 60)}m {lastScore.timeTaken % 60}s
          </p>
        </div>

        {/* Detailed Results */}
        <div className={`rounded-2xl p-6 mb-6 ${
          darkMode ? "bg-white/10" : "bg-gray-50"
        }`}>
          <h3 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Answer Review
          </h3>
          
          <div className="space-y-3">
            {selectedQuiz.questions.map((question: Question, index: number) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-xl ${
                    isCorrect
                      ? "bg-green-500/20 border-2 border-green-500"
                      : "bg-red-500/20 border-2 border-red-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </span>
                    <div className="flex-1">
                      <p className={`font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {index + 1}. {question.question}
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Your answer: <span className="font-semibold">{question.options[userAnswer]}</span>
                      </p>
                      {!isCorrect && (
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Correct answer: <span className="font-semibold text-green-600">{question.options[question.correctAnswer]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setView("home");
              setSelectedQuiz(null);
            }}
            className={`flex-1 py-4 rounded-xl font-semibold transition ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            <Home className="w-5 h-5 inline mr-2" />
            Back to Home
          </button>
          
          <button
            onClick={() => setView("leaderboard")}
            className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            View Leaderboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LeaderboardView({ darkMode, leaderboard, setView }: any) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setView("home")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
            darkMode
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          🏆 Leaderboard
        </h1>
        
        <div className="w-24"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-3xl p-8 backdrop-blur shadow-2xl ${
          darkMode ? "bg-white/10" : "bg-white/90"
        }`}
      >
        <div className="space-y-4">
          {leaderboard.map((result: QuizResult, index: number) => {
            const percentage = (result.score / result.totalQuestions) * 100;
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-6 rounded-2xl transition ${
                  index < 3
                    ? darkMode
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50"
                      : "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-500/50"
                    : darkMode
                    ? "bg-white/5"
                    : "bg-gray-50"
                }`}
              >
                <div className={`text-3xl font-bold w-12 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {medal || `#${index + 1}`}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {result.playerName}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {result.quizTitle}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {result.score}/{result.totalQuestions}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {percentage.toFixed(0)}% • {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                  </p>
                </div>
              </motion.div>
            );
          })}
          
          {leaderboard.length === 0 && (
            <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No scores yet. Be the first to take a quiz!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AdminView({ darkMode, quizzes, setView, setShowQuizForm, setEditingQuiz, handleDeleteQuiz, getDifficultyColor }: any) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setView("home")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
            darkMode
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          ⚙️ Admin Dashboard
        </h1>
        
        <button
          onClick={() => {
            setEditingQuiz(null);
            setShowQuizForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
        >
          <Plus className="h-4 w-4" />
          New Quiz
        </button>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz: Quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl p-6 backdrop-blur ${
              darkMode ? "bg-white/10" : "bg-white shadow-lg"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {quiz.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    getDifficultyColor(quiz.difficulty)
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {quiz.description}
                </p>
                <div className="flex items-center gap-6">
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    📚 {quiz.questions.length} questions
                  </span>
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ⏱️ {quiz.timeLimit}s per question
                  </span>
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    📂 {quiz.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setShowQuizForm(true);
                  }}
                  className={`p-3 rounded-full transition ${
                    darkMode
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className={`p-3 rounded-full transition ${
                    darkMode
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Modal Components
function NamePromptModal({ playerName, setPlayerName, setShowNamePrompt, selectedQuiz, startQuiz }: any) {
  const [name, setName] = useState(playerName);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <h3 className="text-2xl font-bold mb-2 text-gray-900">What's your name?</h3>
        <p className="text-gray-600 mb-6">Enter your name to track your score on the leaderboard</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition mb-6"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowNamePrompt(false)}
            className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                setPlayerName(name.trim());
                localStorage.setItem("campusQuizPlayerName", name.trim());
                setShowNamePrompt(false);
                if (selectedQuiz) {
                  startQuiz(selectedQuiz);
                }
              }
            }}
            className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
          >
            Start Quiz
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminLoginModal({ darkMode, adminPassword, setAdminPassword, handleAdminLogin, setShowAdminLogin }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl shadow-2xl w-full max-w-md p-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Admin Login
        </h3>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Enter admin password to access dashboard
        </p>
        <p className="text-sm text-purple-600 mb-4">
          Hint: The password is "admin123"
        </p>
        
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition mb-6"
          onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAdminLogin(false)}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleAdminLogin}
            className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function QuizFormModal({ darkMode, editingQuiz, setShowQuizForm, handleCreateQuiz, handleUpdateQuiz, setEditingQuiz }: any) {
  const [title, setTitle] = useState(editingQuiz?.title || "");
  const [description, setDescription] = useState(editingQuiz?.description || "");
  const [category, setCategory] = useState(editingQuiz?.category || "General");
  const [difficulty, setDifficulty] = useState(editingQuiz?.difficulty || "Medium");
  const [timeLimit, setTimeLimit] = useState(editingQuiz?.timeLimit || 30);
  const [course, setCourse] = useState(editingQuiz?.course || "All");
  const [program, setProgram] = useState(editingQuiz?.program || "All");
  const [year, setYear] = useState(editingQuiz?.year || 0);
  const [section, setSection] = useState(editingQuiz?.section || "All");
  const [semester, setSemester] = useState(editingQuiz?.semester || 0);
  const [tags, setTags] = useState(editingQuiz?.tags?.join(", ") || "");
  const [questions, setQuestions] = useState<Question[]>(editingQuiz?.questions || []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
      }
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !description || questions.length === 0) {
      alert("Please fill in all required fields and add at least one question!");
      return;
    }

    const quiz: Quiz = {
      id: editingQuiz?.id || `quiz-${Date.now()}`,
      title,
      description,
      category,
      difficulty: difficulty as any,
      timeLimit,
      course,
      program,
      year,
      section,
      semester,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter((t: string) => t) : [],
      questions,
      createdAt: editingQuiz?.createdAt || new Date().toISOString()
    };

    if (editingQuiz) {
      handleUpdateQuiz(quiz);
    } else {
      handleCreateQuiz(quiz);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl shadow-2xl w-full max-w-4xl p-8 my-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
          </h3>
          <button
            onClick={() => {
              setShowQuizForm(false);
              setEditingQuiz(null);
            }}
            className={`p-2 rounded-full transition ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <X className={`w-6 h-6 ${darkMode ? "text-white" : "text-gray-900"}`} />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., JavaScript Fundamentals"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
              >
                <option value="Programming">Programming</option>
                <option value="General">General Knowledge</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Math">Mathematics</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Time Limit (seconds) *
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min="10"
                max="300"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this quiz"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition resize-none"
            />
          </div>

          {/* Academic Filters */}
          <div className={`p-6 rounded-2xl ${darkMode ? "bg-white/5" : "bg-purple-50"}`}>
            <h4 className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              🎓 Academic Information (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Course
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                >
                  <option value="All">All Courses</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="B.Com">B.Com</option>
                  <option value="M.Com">M.Com</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Program/Branch
                </label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g., CSE, IT, ECE"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                >
                  <option value={0}>All Years</option>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                >
                  <option value="All">All Sections</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                >
                  <option value={0}>Any Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., DSA, Core, Advanced"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Questions ({questions.length})
              </label>
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className={`p-6 rounded-2xl ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Question {qIndex + 1}
                    </h4>
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    placeholder="Enter your question"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={question.explanation || ""}
                    onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                    placeholder="Explanation (optional)"
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition text-sm"
                  />
                </div>
              ))}

              {questions.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No questions yet. Click "Add Question" to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={() => {
              setShowQuizForm(false);
              setEditingQuiz(null);
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition"
          >
            <Save className="w-5 h-5 inline mr-2" />
            {editingQuiz ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
