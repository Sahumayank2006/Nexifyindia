import { problems, wisdomTips, alerts, students } from "./data";

export function seedInitialData(collegeId: string) {
  // Seed problems
  const collegeProblems = problems.filter(p => p.college === collegeId);
  if (!localStorage.getItem(`problems_${collegeId}`)) {
    localStorage.setItem(`problems_${collegeId}`, JSON.stringify(collegeProblems));
  }

  // Seed wisdom
  const collegeWisdom = wisdomTips.filter(w => w.college === collegeId);
  if (!localStorage.getItem(`wisdom_${collegeId}`)) {
    localStorage.setItem(`wisdom_${collegeId}`, JSON.stringify(collegeWisdom));
  }

  // Seed alerts
  const collegeAlerts = alerts.filter(a => a.college === collegeId);
  if (!localStorage.getItem(`alerts_${collegeId}`)) {
    localStorage.setItem(`alerts_${collegeId}`, JSON.stringify(collegeAlerts));
  }

  // Seed students
  const collegeStudents = students.filter(s => s.collegeid === collegeId);
  if (!localStorage.getItem(`students_${collegeId}`)) {
    localStorage.setItem(`students_${collegeId}`, JSON.stringify(collegeStudents));
  }
}
