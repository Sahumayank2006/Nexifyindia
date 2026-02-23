"""
Event Guidance System
Provides recommendations and advice to students based on past event feedback
"""

import pandas as pd
import numpy as np
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class EventGuidanceSystem:
    def __init__(self):
        """Initialize by loading historical feedback data"""
        print("Loading historical event feedback data...")
        self.df = pd.read_csv('event_feedback_dataset.csv')
        print(f"✓ Loaded {len(self.df):,} feedback records from past events\n")
    
    def get_recommendations_for_registered_event(self, student_profile, event_name):
        """
        Provide comprehensive recommendations when student registers for an event
        
        Args:
            student_profile: dict with student information
            event_name: name of event student registered for
            
        Returns:
            dict with recommendations, warnings, tips, and insights
        """
        # Get all past feedback for this event
        event_feedback = self.df[self.df['event_name'] == event_name]
        
        if len(event_feedback) == 0:
            return {"error": f"No historical data found for {event_name}"}
        
        # Get feedback from similar students
        similar_students = event_feedback[
            (event_feedback['student_branch'] == student_profile.get('branch', '')) |
            (event_feedback['student_year'] == student_profile.get('year', 0)) |
            (event_feedback['skill_level'] == student_profile.get('skill_level', ''))
        ]
        
        if len(similar_students) == 0:
            similar_students = event_feedback
        
        # Analyze feedback
        guidance = {
            'event_name': event_name,
            'event_type': event_feedback.iloc[0]['event_type'],
            'total_past_attendees': len(event_feedback),
            'similar_profile_attendees': len(similar_students),
            'overall_satisfaction': event_feedback['overall_satisfaction'].mean(),
            'recommendation_rate': event_feedback['would_recommend'].mean() * 100,
        }
        
        # 1. COMMON ISSUES & WARNINGS
        guidance['common_issues'] = self._analyze_common_issues(event_feedback)
        
        # 2. AREAS OF CONCERN (Low ratings)
        guidance['areas_of_concern'] = self._identify_concerns(event_feedback)
        
        # 3. SUCCESS FACTORS (High ratings)
        guidance['strengths'] = self._identify_strengths(event_feedback)
        
        # 4. ACTIONABLE RECOMMENDATIONS
        guidance['recommendations'] = self._generate_recommendations(
            event_feedback, similar_students, student_profile
        )
        
        # 5. SUCCESS TIPS from high performers
        guidance['success_tips'] = self._get_success_tips(event_feedback, student_profile)
        
        # 6. WHAT TO EXPECT
        guidance['expectations'] = self._set_expectations(event_feedback, similar_students)
        
        # 7. PREPARATION ADVICE
        guidance['preparation'] = self._get_preparation_advice(event_feedback, student_profile)
        
        return guidance
    
    def _analyze_common_issues(self, event_feedback):
        """Find most common issues faced by past attendees"""
        all_issues = []
        for issues_str in event_feedback['issues_faced'].values:
            if issues_str and str(issues_str) != 'None' and str(issues_str) != 'nan':
                all_issues.extend([issue.strip() for issue in str(issues_str).split(',')])
        
        issue_counts = Counter(all_issues)
        total_attendees = len(event_feedback)
        
        common_issues = []
        for issue, count in issue_counts.most_common(5):
            if issue and issue != 'None':
                percentage = (count / total_attendees) * 100
                common_issues.append({
                    'issue': issue,
                    'reported_by': count,
                    'percentage': percentage
                })
        
        return common_issues
    
    def _identify_concerns(self, event_feedback):
        """Identify areas with low ratings"""
        rating_columns = {
            'venue_rating': 'Venue Quality',
            'organization_rating': 'Organization & Coordination',
            'content_quality': 'Content Quality',
            'mentor_support': 'Mentor Support',
            'food_quality': 'Food & Refreshments',
            'infrastructure': 'Infrastructure & Facilities',
            'time_management': 'Time Management',
            'registration_process': 'Registration Process'
        }
        
        concerns = []
        for col, label in rating_columns.items():
            avg_rating = event_feedback[col].mean()
            if avg_rating < 7.0:
                concerns.append({
                    'area': label,
                    'average_rating': avg_rating,
                    'severity': 'High' if avg_rating < 6.0 else 'Medium'
                })
        
        return sorted(concerns, key=lambda x: x['average_rating'])
    
    def _identify_strengths(self, event_feedback):
        """Identify areas with high ratings"""
        rating_columns = {
            'venue_rating': 'Venue Quality',
            'organization_rating': 'Organization & Coordination',
            'content_quality': 'Content Quality',
            'mentor_support': 'Mentor Support',
            'networking_opportunities': 'Networking Opportunities',
            'learning_outcome': 'Learning Outcome',
            'infrastructure': 'Infrastructure'
        }
        
        strengths = []
        for col, label in rating_columns.items():
            avg_rating = event_feedback[col].mean()
            if avg_rating >= 7.5:
                strengths.append({
                    'area': label,
                    'average_rating': avg_rating
                })
        
        return sorted(strengths, key=lambda x: x['average_rating'], reverse=True)
    
    def _generate_recommendations(self, event_feedback, similar_students, student_profile):
        """Generate actionable recommendations based on past feedback"""
        recommendations = []
        
        # Based on common issues
        if event_feedback['organization_rating'].mean() < 7.0:
            recommendations.append({
                'category': 'Organization',
                'advice': 'Past attendees reported coordination issues. Arrive early, keep emergency contacts handy, and be patient with organizers.',
                'priority': 'High'
            })
        
        if event_feedback['mentor_support'].mean() < 7.0:
            recommendations.append({
                'category': 'Mentorship',
                'advice': 'Mentor availability was limited. Prepare your questions in advance and try to connect with mentors early.',
                'priority': 'High'
            })
        
        if event_feedback['food_quality'].mean() < 6.5:
            recommendations.append({
                'category': 'Food',
                'advice': 'Food quality received low ratings. Consider bringing your own snacks and water.',
                'priority': 'Medium'
            })
        
        if event_feedback['infrastructure'].mean() < 7.0:
            recommendations.append({
                'category': 'Technical Setup',
                'advice': 'Infrastructure issues were common. Bring backup chargers, power banks, and essential equipment.',
                'priority': 'High'
            })
        
        if event_feedback['time_management'].mean() < 7.0:
            recommendations.append({
                'category': 'Time Management',
                'advice': 'Timing issues were reported. Plan your schedule with buffer time and prioritize tasks.',
                'priority': 'Medium'
            })
        
        # Event-specific recommendations
        event_type = event_feedback.iloc[0]['event_type']
        
        if event_type == 'Hackathon':
            team_stats = event_feedback.groupby('team_size')['overall_satisfaction'].mean()
            if len(team_stats) > 0:
                best_team_size = team_stats.idxmax()
                recommendations.append({
                    'category': 'Team Formation',
                    'advice': f'Data shows teams of {best_team_size} members had highest satisfaction. Form your team before the event.',
                    'priority': 'High'
                })
        
        if student_profile.get('skill_level') == 'Beginner':
            recommendations.append({
                'category': 'Skill Level',
                'advice': 'As a beginner, focus on learning rather than winning. Connect with experienced participants.',
                'priority': 'Medium'
            })
        
        return recommendations
    
    def _get_success_tips(self, event_feedback, student_profile):
        """Get tips from successful participants"""
        # Define successful participants
        successful = event_feedback[
            (event_feedback['overall_satisfaction'] >= 8.0) &
            (event_feedback['would_recommend'] == 1)
        ]
        
        if len(successful) == 0:
            return []
        
        tips = []
        
        # Team participation
        solo_success = len(successful[successful['participated_alone'] == 1]) / len(successful) * 100
        if solo_success < 20:
            tips.append("Most successful participants came with teams. Teamwork is key!")
        
        # Achievement patterns
        winners = successful[successful['achievement'].isin(['Won Prize', 'Runner Up'])]
        if len(winners) > 0:
            avg_learning = winners['learning_outcome'].mean()
            tips.append(f"Prize winners had average learning outcome of {avg_learning:.1f}/10. Focus on learning!")
        
        # Skill level insights
        skill_success = successful.groupby('skill_level').size()
        if len(skill_success) > 0:
            tips.append(f"Successful participants were mostly {skill_success.idxmax()} level. Set realistic expectations.")
        
        # Content quality correlation
        if successful['content_quality'].mean() >= 8.0:
            tips.append("High content engagement correlates with success. Participate actively in all sessions.")
        
        # Networking
        if successful['networking_opportunities'].mean() >= 8.0:
            tips.append("Successful participants leveraged networking. Don't hesitate to connect with others.")
        
        return tips
    
    def _set_expectations(self, event_feedback, similar_students):
        """Set realistic expectations based on past data"""
        expectations = {
            'satisfaction_range': {
                'min': event_feedback['overall_satisfaction'].quantile(0.25),
                'max': event_feedback['overall_satisfaction'].quantile(0.75),
                'average': event_feedback['overall_satisfaction'].mean()
            },
            'likely_outcome': 'Positive' if event_feedback['overall_satisfaction'].mean() >= 7.0 else 'Mixed',
            'recommendation_likelihood': event_feedback['would_recommend'].mean() * 100
        }
        
        if len(similar_students) > 0:
            expectations['similar_students_satisfaction'] = similar_students['overall_satisfaction'].mean()
        
        return expectations
    
    def _get_preparation_advice(self, event_feedback, student_profile):
        """Provide preparation checklist"""
        event_type = event_feedback.iloc[0]['event_type']
        duration = event_feedback.iloc[0]['event_duration_days']
        
        checklist = []
        
        # General preparation
        checklist.append({
            'item': 'Registration Confirmation',
            'description': 'Keep your registration email and ID ready'
        })
        
        if event_type in ['Hackathon', 'Technical']:
            checklist.append({
                'item': 'Laptop & Charger',
                'description': 'Ensure laptop is fully charged with all necessary software installed'
            })
            checklist.append({
                'item': 'Power Bank',
                'description': 'Backup power source for long coding sessions'
            })
            checklist.append({
                'item': 'Internet Backup',
                'description': 'Mobile hotspot as backup if WiFi fails'
            })
        
        if duration > 1:
            checklist.append({
                'item': 'Snacks & Water',
                'description': 'Keep yourself energized throughout the event'
            })
        
        if event_type == 'Hackathon':
            checklist.append({
                'item': 'Team Formation',
                'description': 'Form your team and discuss ideas beforehand'
            })
            checklist.append({
                'item': 'Idea Preparation',
                'description': 'Have 2-3 project ideas ready to pitch'
            })
        
        if event_feedback['mentor_support'].mean() < 7.0:
            checklist.append({
                'item': 'Questions List',
                'description': 'Write down questions to ask mentors when available'
            })
        
        checklist.append({
            'item': 'Emergency Contacts',
            'description': 'Save organizer contacts and venue information'
        })
        
        return checklist


def print_guidance(guidance):
    """Pretty print the guidance recommendations"""
    print("="*80)
    print(f"EVENT GUIDANCE: {guidance['event_name']}")
    print("="*80)
    
    print(f"\n📊 Event Overview:")
    print(f"  Type: {guidance['event_type']}")
    print(f"  Past Attendees: {guidance['total_past_attendees']:,}")
    print(f"  Average Satisfaction: {guidance['overall_satisfaction']:.2f}/10")
    print(f"  Would Recommend: {guidance['recommendation_rate']:.1f}%")
    print(f"  Similar Profile Attendees: {guidance['similar_profile_attendees']:,}")
    
    # Common Issues
    if guidance['common_issues']:
        print("\n⚠️  COMMON ISSUES REPORTED:")
        print("-"*80)
        for issue in guidance['common_issues']:
            print(f"  • {issue['issue']}")
            print(f"    Reported by {issue['reported_by']:,} students ({issue['percentage']:.1f}%)")
    
    # Areas of Concern
    if guidance['areas_of_concern']:
        print("\n🔴 AREAS OF CONCERN (Be Prepared):")
        print("-"*80)
        for concern in guidance['areas_of_concern']:
            severity_icon = "🔴" if concern['severity'] == 'High' else "🟡"
            print(f"  {severity_icon} {concern['area']}: {concern['average_rating']:.2f}/10")
    
    # Strengths
    if guidance['strengths']:
        print("\n✅ EVENT STRENGTHS:")
        print("-"*80)
        for strength in guidance['strengths']:
            print(f"  ✓ {strength['area']}: {strength['average_rating']:.2f}/10")
    
    # Recommendations
    if guidance['recommendations']:
        print("\n💡 ACTIONABLE RECOMMENDATIONS:")
        print("-"*80)
        for rec in guidance['recommendations']:
            priority_icon = "🔥" if rec['priority'] == 'High' else "📌"
            print(f"\n  {priority_icon} {rec['category']} [{rec['priority']} Priority]")
            print(f"     {rec['advice']}")
    
    # Success Tips
    if guidance['success_tips']:
        print("\n🏆 SUCCESS TIPS FROM TOP PERFORMERS:")
        print("-"*80)
        for i, tip in enumerate(guidance['success_tips'], 1):
            print(f"  {i}. {tip}")
    
    # Expectations
    print("\n📈 WHAT TO EXPECT:")
    print("-"*80)
    exp = guidance['expectations']
    print(f"  Expected Satisfaction Range: {exp['satisfaction_range']['min']:.2f} - {exp['satisfaction_range']['max']:.2f}/10")
    print(f"  Average Experience: {exp['satisfaction_range']['average']:.2f}/10")
    print(f"  Overall Outlook: {exp['likely_outcome']}")
    if 'similar_students_satisfaction' in exp:
        print(f"  Students like you rated: {exp['similar_students_satisfaction']:.2f}/10")
    
    # Preparation Checklist
    if guidance['preparation']:
        print("\n✓ PREPARATION CHECKLIST:")
        print("-"*80)
        for item in guidance['preparation']:
            print(f"  □ {item['item']}")
            print(f"    → {item['description']}")
    
    print("\n" + "="*80)
    print("Good luck with your event! 🎉")
    print("="*80)


# Example usage
if __name__ == "__main__":
    print("="*80)
    print("EVENT GUIDANCE SYSTEM - HELPING STUDENTS SUCCEED")
    print("="*80)
    print("\nThis system provides recommendations based on past feedback")
    print("to help you have the best experience at your registered event.\n")
    
    # Initialize system
    guidance_system = EventGuidanceSystem()
    
    # Example: Student registered for Hacksetu
    print("\n" + "="*80)
    print("SCENARIO: Student Registered for Hacksetu")
    print("="*80)
    
    student = {
        'branch': 'CSE',
        'year': 2,
        'skill_level': 'Intermediate',
        'gender': 'Male'
    }
    
    print("\nStudent Profile:")
    for key, value in student.items():
        print(f"  {key.title()}: {value}")
    
    print("\n")
    guidance = guidance_system.get_recommendations_for_registered_event(student, 'Hacksetu')
    print_guidance(guidance)
    
    # Example 2: Different event
    print("\n\n" + "="*80)
    print("SCENARIO: Student Registered for Ami Chroma")
    print("="*80)
    
    guidance = guidance_system.get_recommendations_for_registered_event(student, 'Ami Chroma')
    print_guidance(guidance)
