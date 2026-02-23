import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings('ignore')

class EventRecommendationSystem:
    def __init__(self):
        """Initialize the recommendation system by loading trained models"""
        print("Loading trained models...")
        self.recommendation_model = joblib.load('recommendation_model.pkl')
        self.satisfaction_model = joblib.load('satisfaction_model.pkl')
        self.scaler = joblib.load('scaler.pkl')
        self.label_encoders = joblib.load('label_encoders.pkl')
        self.metadata = joblib.load('model_metadata.pkl')
        self.feature_columns = self.metadata['feature_columns']
        print(f"✓ Models loaded successfully!")
        print(f"✓ Best Model: {self.metadata['best_model_name']}")
        print(f"✓ Accuracy: {self.metadata['accuracy']*100:.2f}%\n")
        
    def prepare_input(self, student_profile, event_info, past_feedback=None):
        """
        Prepare input features from student profile and event information
        
        Args:
            student_profile: dict with keys like branch, year, age, gender, skill_level, etc.
            event_info: dict with event details like name, type, level, duration, etc.
            past_feedback: dict with optional past ratings (if available)
        """
        # Default values
        input_data = {
            'event_name_encoded': self.label_encoders['event_name'].transform([event_info['name']])[0],
            'event_type_encoded': self.label_encoders['event_type'].transform([event_info['type']])[0],
            'event_level_encoded': self.label_encoders['event_level'].transform([event_info['level']])[0],
            'event_duration_days': event_info['duration_days'],
            'student_branch_encoded': self.label_encoders['student_branch'].transform([student_profile['branch']])[0],
            'student_year': student_profile['year'],
            'student_age': student_profile.get('age', 18 + student_profile['year']),
            'gender_encoded': self.label_encoders['gender'].transform([student_profile['gender']])[0],
            'previous_participation_encoded': self.label_encoders['previous_participation'].transform([student_profile.get('previous_participation', 'Low')])[0],
            'skill_level_encoded': self.label_encoders['skill_level'].transform([student_profile['skill_level']])[0],
            'team_size': student_profile.get('team_size', 3),
            'participated_alone': student_profile.get('participated_alone', 0),
            'achievement_encoded': self.label_encoders['achievement'].transform([student_profile.get('achievement', 'Participation')])[0],
        }
        
        # Use past feedback if available, otherwise use estimated values
        if past_feedback:
            input_data.update({
                'venue_rating': past_feedback.get('venue_rating', 7.0),
                'organization_rating': past_feedback.get('organization_rating', 7.0),
                'content_quality': past_feedback.get('content_quality', 7.0),
                'mentor_support': past_feedback.get('mentor_support', 7.0),
                'food_quality': past_feedback.get('food_quality', 7.0),
                'prize_satisfaction': past_feedback.get('prize_satisfaction', 7.0),
                'networking_opportunities': past_feedback.get('networking_opportunities', 7.0),
                'time_management': past_feedback.get('time_management', 7.0),
                'infrastructure': past_feedback.get('infrastructure', 7.0),
                'registration_process': past_feedback.get('registration_process', 8.0),
                'learning_outcome': past_feedback.get('learning_outcome', 7.0),
            })
        else:
            # Estimate based on skill level and previous participation
            base_rating = 7.0 if student_profile['skill_level'] in ['Advanced', 'Expert'] else 6.5
            input_data.update({
                'venue_rating': base_rating + np.random.uniform(-0.5, 0.5),
                'organization_rating': base_rating + np.random.uniform(-0.5, 0.5),
                'content_quality': base_rating + np.random.uniform(-0.5, 0.5),
                'mentor_support': base_rating + np.random.uniform(-0.5, 0.5),
                'food_quality': 6.5 + np.random.uniform(-0.5, 0.5),
                'prize_satisfaction': base_rating + np.random.uniform(-0.5, 0.5),
                'networking_opportunities': base_rating + np.random.uniform(-0.5, 0.5),
                'time_management': base_rating + np.random.uniform(-0.5, 0.5),
                'infrastructure': base_rating + np.random.uniform(-0.5, 0.5),
                'registration_process': 8.0,
                'learning_outcome': base_rating + np.random.uniform(-0.5, 0.5),
            })
        
        # Calculate composite scores
        input_data['total_experience_score'] = (
            input_data['venue_rating'] + input_data['organization_rating'] + 
            input_data['content_quality'] + input_data['mentor_support']
        ) / 4
        
        input_data['facility_score'] = (
            input_data['food_quality'] + input_data['infrastructure'] + 
            input_data['registration_process']
        ) / 3
        
        input_data['engagement_score'] = (
            input_data['networking_opportunities'] + input_data['time_management'] + 
            input_data['learning_outcome']
        ) / 3
        
        # Sentiment and feedback
        sentiment = 'Positive' if input_data['total_experience_score'] >= 7 else 'Neutral'
        input_data['sentiment_encoded'] = self.label_encoders['sentiment'].transform([sentiment])[0]
        input_data['feedback_length'] = 150
        input_data['suggestions_given'] = 1
        
        # Create DataFrame with correct column order
        input_df = pd.DataFrame([input_data])[self.feature_columns]
        return input_df
    
    def predict_recommendation(self, student_profile, event_info, past_feedback=None):
        """
        Predict if a student would recommend the event
        
        Returns:
            - recommendation: 0 (not recommend) or 1 (recommend)
            - probability: confidence score
            - satisfaction: predicted satisfaction score
        """
        input_features = self.prepare_input(student_profile, event_info, past_feedback)
        
        # Predict recommendation
        recommendation = self.recommendation_model.predict(input_features)[0]
        
        if hasattr(self.recommendation_model, 'predict_proba'):
            probability = self.recommendation_model.predict_proba(input_features)[0][1]
        else:
            probability = recommendation
        
        # Predict satisfaction
        satisfaction = self.satisfaction_model.predict(input_features)[0]
        
        return {
            'would_recommend': bool(recommendation),
            'confidence': float(probability),
            'predicted_satisfaction': float(satisfaction),
            'recommendation_text': "Highly Recommended" if probability > 0.75 else 
                                   "Recommended" if recommendation else 
                                   "Not Recommended"
        }
    
    def recommend_events_for_student(self, student_profile, available_events, past_feedback=None, top_n=5):
        """
        Recommend top N events for a student based on their profile
        
        Args:
            student_profile: dict with student information
            available_events: list of dicts with event information
            past_feedback: dict with optional past ratings
            top_n: number of recommendations to return
        
        Returns:
            List of recommended events with scores
        """
        recommendations = []
        
        for event in available_events:
            prediction = self.predict_recommendation(student_profile, event, past_feedback)
            recommendations.append({
                'event_name': event['name'],
                'event_type': event['type'],
                'confidence': prediction['confidence'],
                'predicted_satisfaction': prediction['predicted_satisfaction'],
                'recommendation': prediction['recommendation_text'],
                'would_recommend': prediction['would_recommend']
            })
        
        # Sort by confidence and satisfaction
        recommendations.sort(key=lambda x: (x['confidence'], x['predicted_satisfaction']), reverse=True)
        
        return recommendations[:top_n]
    
    def get_insights_from_past_events(self, past_events_feedback):
        """
        Analyze past event feedback to provide insights
        
        Args:
            past_events_feedback: DataFrame with past event feedback
        
        Returns:
            dict with insights and recommendations
        """
        insights = {
            'total_events_attended': len(past_events_feedback),
            'average_satisfaction': past_events_feedback['overall_satisfaction'].mean(),
            'recommendation_rate': past_events_feedback['would_recommend'].mean(),
            'preferred_event_types': past_events_feedback['event_type'].mode().values[0] if len(past_events_feedback) > 0 else None,
            'best_event': past_events_feedback.nlargest(1, 'overall_satisfaction')['event_name'].values[0] if len(past_events_feedback) > 0 else None,
            'areas_of_concern': []
        }
        
        # Identify areas of concern
        rating_columns = ['venue_rating', 'organization_rating', 'content_quality', 
                         'mentor_support', 'food_quality', 'infrastructure']
        
        for col in rating_columns:
            if col in past_events_feedback.columns:
                avg_rating = past_events_feedback[col].mean()
                if avg_rating < 6.0:
                    insights['areas_of_concern'].append({
                        'area': col.replace('_', ' ').title(),
                        'average_rating': avg_rating
                    })
        
        return insights


# Example usage
if __name__ == "__main__":
    print("="*80)
    print("EVENT RECOMMENDATION SYSTEM - DEMO")
    print("="*80)
    
    # Initialize system
    recommender = EventRecommendationSystem()
    
    # Example: New student profile
    student = {
        'branch': 'CSE',
        'year': 2,
        'age': 19,
        'gender': 'Male',
        'skill_level': 'Intermediate',
        'previous_participation': 'Low',
        'team_size': 3,
        'participated_alone': 0,
        'achievement': 'Participation'
    }
    
    # Available events
    events = [
        {'name': 'Hacksetu', 'type': 'Hackathon', 'level': 'National', 'duration_days': 2},
        {'name': 'Anveshan', 'type': 'Hackathon', 'level': 'University', 'duration_days': 1},
        {'name': 'Ami Chroma', 'type': 'Cultural', 'level': 'University', 'duration_days': 3},
        {'name': 'Smart India Hackathon', 'type': 'Hackathon', 'level': 'National', 'duration_days': 3},
        {'name': 'Init Maths', 'type': 'Training', 'level': 'Department', 'duration_days': 6},
        {'name': 'Convocation', 'type': 'Ceremony', 'level': 'University', 'duration_days': 1},
    ]
    
    print("\n" + "="*80)
    print("STUDENT PROFILE")
    print("="*80)
    for key, value in student.items():
        print(f"  {key.replace('_', ' ').title():25s}: {value}")
    
    print("\n" + "="*80)
    print("TOP RECOMMENDED EVENTS")
    print("="*80)
    
    recommendations = recommender.recommend_events_for_student(student, events, top_n=5)
    
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['event_name']} ({rec['event_type']})")
        print(f"   Confidence: {rec['confidence']*100:.1f}%")
        print(f"   Predicted Satisfaction: {rec['predicted_satisfaction']:.2f}/10")
        print(f"   Status: {rec['recommendation']}")
        if rec['would_recommend']:
            print(f"   ✓ Student will likely recommend this event")
        else:
            print(f"   ✗ Student may not recommend this event")
    
    # Predict for specific event
    print("\n" + "="*80)
    print("SPECIFIC EVENT PREDICTION: Hacksetu")
    print("="*80)
    
    result = recommender.predict_recommendation(student, events[0])
    print(f"Would Recommend: {result['would_recommend']}")
    print(f"Confidence: {result['confidence']*100:.1f}%")
    print(f"Predicted Satisfaction: {result['predicted_satisfaction']:.2f}/10")
    print(f"Recommendation: {result['recommendation_text']}")
    
    print("\n" + "="*80)
    print("RECOMMENDATION SYSTEM READY!")
    print("="*80)
