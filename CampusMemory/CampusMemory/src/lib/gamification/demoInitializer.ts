/**
 * Demo Data Initializer for Gamification & Opportunity Predictor
 * 
 * Run this in browser console to initialize demo data:
 * - Award sample points to students
 * - Create student profiles with interests
 * - Set event deadlines for testing
 */

// Initialize Sample Points for Testing
export function initializeDemoPoints() {
  if (typeof window === 'undefined') return;

  // Sample students
  const students = [
    { id: 'student-001', name: 'Alice Johnson', points: 320 },
    { id: 'student-002', name: 'Bob Smith', points: 180 },
    { id: 'student-003', name: 'Charlie Davis', points: 95 },
    { id: 'student-004', name: 'Diana Prince', points: 450 },
    { id: 'student-005', name: 'Eve Wilson', points: 60 },
  ];

  students.forEach(student => {
    const pointsData = {
      studentId: student.id,
      studentName: student.name,
      totalPoints: student.points,
      eventHistory: [
        {
          eventId: 'demo-workshop-1',
          eventName: 'AI/ML Workshop',
          eventType: 'workshop',
          points: 10,
          date: new Date().toISOString()
        },
        {
          eventId: 'demo-hackathon-1',
          eventName: 'Tech Hackathon',
          eventType: 'hackathon',
          points: 20,
          date: new Date().toISOString()
        }
      ]
    };

    localStorage.setItem(`studentPoints_${student.id}`, JSON.stringify(pointsData));
  });

  console.log('✅ Demo points initialized for 5 students');
  console.log('Points:', students.map(s => `${s.name}: ${s.points}`));
}

// Initialize Current User Profile with Interests
export function initializeCurrentUserProfile() {
  if (typeof window === 'undefined') return;

  const currentUser = localStorage.getItem('campusMemoryCurrentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    
    // Add interests if not present
    if (!user.interests || user.interests.length === 0) {
      user.interests = ['AI', 'Machine Learning', 'Web Development', 'Hackathons'];
    }

    // Add branch if not present
    if (!user.branch) {
      user.branch = 'Computer Science';
    }

    localStorage.setItem('campusMemoryCurrentUser', JSON.stringify(user));
    console.log('✅ Current user profile updated with interests:', user.interests);
  } else {
    console.log('⚠️ No current user found. Please login first.');
  }
}

// Award Points to Current User
export function awardDemoPoints(eventType = 'hackathon') {
  if (typeof window === 'undefined') return;

  const currentUser = localStorage.getItem('campusMemoryCurrentUser');
  if (!currentUser) {
    console.log('⚠️ Please login first');
    return;
  }

  const user = JSON.parse(currentUser);
  const pointValues: Record<string, number> = {
    workshop: 10,
    hackathon: 20,
    seminar: 5,
    competition: 25
  };

  const points = pointValues[eventType] || 10;
  const existing = localStorage.getItem(`studentPoints_${user.id}`);
  
  let pointsData;
  if (existing) {
    pointsData = JSON.parse(existing);
    pointsData.totalPoints += points;
    pointsData.eventHistory.push({
      eventId: `demo-${Date.now()}`,
      eventName: `Demo ${eventType}`,
      eventType,
      points,
      date: new Date().toISOString()
    });
  } else {
    pointsData = {
      studentId: user.id,
      studentName: user.name,
      totalPoints: points,
      eventHistory: [{
        eventId: `demo-${Date.now()}`,
        eventName: `Demo ${eventType}`,
        eventType,
        points,
        date: new Date().toISOString()
      }]
    };
  }

  localStorage.setItem(`studentPoints_${user.id}`, JSON.stringify(pointsData));
  console.log(`✅ Awarded ${points} points for ${eventType}. Total: ${pointsData.totalPoints}`);
  console.log('🔄 Refresh page to see updates!');
}

// Quick Test Function - Awards Points and Shows Leaderboard
export function quickTest() {
  initializeDemoPoints();
  initializeCurrentUserProfile();
  awardDemoPoints('hackathon');
  console.log('\n🎉 Demo data initialized!');
  console.log('\n📋 Next Steps:');
  console.log('1. Refresh the page');
  console.log('2. Go to Events page to see your points in header');
  console.log('3. Go to College Dashboard → Leaderboard tab to see rankings');
  console.log('\n💡 To award more points, run: awardDemoPoints("hackathon")');
}

// Browser Console Helper
if (typeof window !== 'undefined') {
  (window as any).gamificationDemo = {
    initPoints: initializeDemoPoints,
    initProfile: initializeCurrentUserProfile,
    awardPoints: awardDemoPoints,
    quickTest: quickTest,
  };
  
  console.log('🎮 Gamification Demo Helpers Loaded!');
  console.log('Run: gamificationDemo.quickTest() to initialize demo data');
}

export default {
  initializeDemoPoints,
  initializeCurrentUserProfile,
  awardDemoPoints,
  quickTest
};
