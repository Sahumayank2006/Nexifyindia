// Image assets for Campus Memory Platform
// Using Unsplash CDN for high-quality images with Indian university aesthetics

export const images = {
  // Hero Section
  hero: {
    mainBanner: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80", // IIT campus aerial view
    students: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", // Indian students studying
    library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80", // University library
    graduation: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80", // Graduation ceremony
  },

  // Event Images
  events: {
    hackathon: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", // Team coding
    cultural: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", // Cultural performance
    technical: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80", // Tech conference
    workshop: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", // Workshop setting
    conference: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", // Conference hall
    ceremony: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80", // Ceremony stage
    competition: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80", // Competition
    training: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", // Training session
  },

  // ML/AI Visualization
  ml: {
    aiNetwork: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", // AI neural network
    dataAnalysis: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", // Data analytics
    brainAI: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80", // AI brain visualization
    robotics: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", // AI robotics
  },

  // Campus Scenes
  campus: {
    auditorium: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", // Modern auditorium
    classroom: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", // Classroom
    cafeteria: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80", // Cafeteria
    lab: "https://images.unsplash.com/photo-1581093458791-9d42e2d8f7f7?w=800&q=80", // Computer lab
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Sports facility
    hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", // Hostel building
  },

  // Student Life
  students: {
    studying: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", // Students studying together
    teamwork: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", // Team collaboration
    presentation: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", // Student presentation
    research: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", // Research work
    celebration: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80", // Student celebration
  },

  // Icons/Logos (Indian theme)
  icons: {
    india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80", // India gate/symbol
    college: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80", // College building
    trophy: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80", // Trophy/achievement
    graduation: "https://images.unsplash.com/photo-1627556704283-6d4a6c8e9b3a?w=400&q=80", // Graduation cap
  },

  // Background Patterns
  patterns: {
    abstract1: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80", // Abstract tech pattern
    abstract2: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80", // Geometric pattern
    particles: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80", // Particle network
  },

  // Feature Icons
  features: {
    memory: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80", // Memory/storage concept
    wisdom: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80", // Books/wisdom
    alerts: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80", // Alert/notification
    analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", // Analytics dashboard
  }
};

// Event type to image mapping
export const getEventImage = (eventType: string): string => {
  const typeMap: { [key: string]: string } = {
    'Hackathon': images.events.hackathon,
    'Cultural': images.events.cultural,
    'Technical': images.events.technical,
    'Workshop': images.events.workshop,
    'Conference': images.events.conference,
    'Ceremony': images.events.ceremony,
    'Competition': images.events.competition,
    'Training': images.events.training,
  };
  return typeMap[eventType] || images.events.technical;
};

// Random student image picker
export const getRandomStudentImage = (): string => {
  const studentImages = Object.values(images.students);
  return studentImages[Math.floor(Math.random() * studentImages.length)];
};

// College type to image mapping
export const getCollegeImage = (collegeName: string): string => {
  if (collegeName.includes('IIT')) return "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";
  if (collegeName.includes('NIT')) return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80";
  if (collegeName.includes('IIIT')) return "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80";
  return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80";
};
