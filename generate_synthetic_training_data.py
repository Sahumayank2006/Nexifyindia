"""
Synthetic Training Data Generation for AI Models
Phase 2: Generate datasets for Category Classification, School Classification, and NER
"""

import random
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import pandas as pd

# Constants
EVENT_CATEGORIES = [
    "Technical",
    "Workshop",
    "Cultural",
    "Sports",
    "Career",
    "Awareness",
    "Webinar"
]

AMITY_SCHOOLS = [
    "Amity School of Engineering & Technology",
    "Amity School of Business",
    "Amity School of Communication",
    "Amity School of Computer Science",
    "Amity School of Architecture & Planning",
    "Amity School of Fine Arts",
    "Amity School of Law",
    "Amity School of Applied Sciences",
    "Amity School of Biotechnology",
    "Amity School of Hospitality",
    "Amity School of Liberal Arts",
    "Amity School of Design"
]

# Keywords and templates for each category
CATEGORY_TEMPLATES = {
    "Technical": {
        "titles": ["Hackathon", "TechFest", "CodeSprint", "DevCon", "Tech Summit", "Innovation Challenge"],
        "keywords": ["coding", "programming", "AI", "ML", "blockchain", "IoT", "robotics", "hackathon", "technology"],
        "descriptions": [
            "Join us for an exciting coding competition",
            "Build innovative tech solutions",
            "Showcase your programming skills",
            "Develop cutting-edge applications"
        ]
    },
    "Workshop": {
        "titles": ["Workshop on", "Training Session", "Hands-on Tutorial", "Skill Development", "Masterclass"],
        "keywords": ["workshop", "training", "learn", "tutorial", "hands-on", "practical", "session", "skill"],
        "descriptions": [
            "Learn industry-relevant skills",
            "Practical training session",
            "Hands-on experience with experts",
            "Develop your professional skills"
        ]
    },
    "Cultural": {
        "titles": ["Fest", "Cultural Night", "Celebration", "Arts Festival", "Music Concert", "Dance Competition"],
        "keywords": ["cultural", "music", "dance", "drama", "art", "performance", "celebration", "fest"],
        "descriptions": [
            "Celebrate culture and tradition",
            "Showcase your artistic talents",
            "Experience vibrant performances",
            "Join the cultural celebration"
        ]
    },
    "Sports": {
        "titles": ["Sports Meet", "Tournament", "Athletic Competition", "Championship", "Sports Day"],
        "keywords": ["sports", "athletic", "tournament", "competition", "match", "game", "championship"],
        "descriptions": [
            "Compete in exciting sports events",
            "Show your athletic prowess",
            "Join the sports championship",
            "Inter-college sports competition"
        ]
    },
    "Career": {
        "titles": ["Career Fair", "Placement Drive", "Job Expo", "Internship Fair", "Recruitment"],
        "keywords": ["career", "job", "placement", "internship", "recruitment", "interview", "hiring"],
        "descriptions": [
            "Meet top recruiters",
            "Explore career opportunities",
            "Get placed in leading companies",
            "Network with industry professionals"
        ]
    },
    "Awareness": {
        "titles": ["Awareness Campaign", "Social Initiative", "Health Drive", "Environment Day", "Safety Seminar"],
        "keywords": ["awareness", "social", "campaign", "health", "environment", "safety", "community"],
        "descriptions": [
            "Spread awareness about important issues",
            "Join our social initiative",
            "Make a difference in society",
            "Community welfare program"
        ]
    },
    "Webinar": {
        "titles": ["Webinar on", "Online Session", "Virtual Talk", "E-Seminar", "Online Workshop"],
        "keywords": ["webinar", "online", "virtual", "zoom", "meet", "remote", "e-learning"],
        "descriptions": [
            "Join from anywhere online",
            "Virtual learning experience",
            "Interactive online session",
            "Connect remotely with experts"
        ]
    }
}

# School-specific keywords
SCHOOL_KEYWORDS = {
    "Amity School of Engineering & Technology": ["engineering", "technology", "ASET", "technical", "innovation"],
    "Amity School of Business": ["business", "management", "MBA", "ASB", "entrepreneurship"],
    "Amity School of Communication": ["communication", "media", "journalism", "ASC", "broadcasting"],
    "Amity School of Computer Science": ["computer science", "IT", "ASCS", "software", "programming"],
    "Amity School of Architecture & Planning": ["architecture", "planning", "design", "urban", "building"],
    "Amity School of Fine Arts": ["fine arts", "painting", "sculpture", "art", "gallery"],
    "Amity School of Law": ["law", "legal", "judiciary", "court", "justice"],
    "Amity School of Applied Sciences": ["applied sciences", "physics", "chemistry", "research", "lab"],
    "Amity School of Biotechnology": ["biotechnology", "genetics", "bio", "molecular", "life sciences"],
    "Amity School of Hospitality": ["hospitality", "hotel management", "tourism", "culinary", "service"],
    "Amity School of Liberal Arts": ["liberal arts", "humanities", "literature", "philosophy", "social sciences"],
    "Amity School of Design": ["design", "graphic design", "UX", "UI", "product design"]
}

# Locations
LOCATIONS = [
    "Main Auditorium",
    "Block A, Room 301",
    "Open Air Theatre",
    "Sports Complex",
    "Library Seminar Hall",
    "Computer Lab 2",
    "Central Lawn",
    "Conference Hall",
    "Innovation Center",
    "Student Activity Center"
]

# Organizers
ORGANIZERS = [
    "Student Council",
    "Technical Society",
    "Cultural Committee",
    "Sports Club",
    "Department Association",
    "Training & Placement Cell",
    "Social Service Club",
    "Innovation Cell"
]

def generate_date():
    """Generate random future date"""
    days_ahead = random.randint(1, 90)
    date = datetime.now() + timedelta(days=days_ahead)
    return date.strftime("%B %d, %Y")

def generate_time():
    """Generate random time"""
    hour = random.randint(9, 17)
    minute = random.choice([0, 30])
    period = "AM" if hour < 12 else "PM"
    display_hour = hour if hour <= 12 else hour - 12
    return f"{display_hour}:{minute:02d} {period}"

def generate_poster_text(category: str, school: str) -> Dict[str, Any]:
    """Generate synthetic poster text mimicking real event posters"""
    
    templates = CATEGORY_TEMPLATES[category]
    
    # Generate event title
    if category == "Workshop" or category == "Webinar":
        topic = random.choice(["Python", "Data Science", "Digital Marketing", "Public Speaking", 
                              "Leadership", "AI/ML", "Web Development", "Design Thinking"])
        title = f"{random.choice(templates['titles'])} {topic}"
    else:
        title = f"{random.choice(templates['titles'])} 2026"
    
    # Generate description with category keywords
    description = random.choice(templates['descriptions'])
    keywords = random.sample(templates['keywords'], min(3, len(templates['keywords'])))
    description += ". " + " ".join([word.capitalize() for word in keywords])
    
    # Add school information
    school_keywords = random.sample(SCHOOL_KEYWORDS[school], min(2, len(SCHOOL_KEYWORDS[school])))
    
    # Generate dates
    event_date = generate_date()
    event_time = generate_time()
    
    # Registration deadline (before event)
    deadline_date = datetime.strptime(event_date, "%B %d, %Y") - timedelta(days=random.randint(2, 7))
    deadline = deadline_date.strftime("%B %d, %Y")
    
    location = random.choice(LOCATIONS)
    organizer = random.choice(ORGANIZERS)
    
    # Create poster text (mimicking OCR output)
    poster_text = f"""
{title.upper()}

{school}
Presents

{description}

📅 Date: {event_date}
⏰ Time: {event_time}
📍 Venue: {location}

Organized by: {organizer}
{', '.join(school_keywords)}

Register by: {deadline}
Contact: events@amity.edu

{' '.join(keywords)}
"""
    
    return {
        "text": poster_text,
        "title": title,
        "category": category,
        "school": school,
        "date": event_date,
        "time": event_time,
        "location": location,
        "organizer": organizer,
        "deadline": deadline
    }

def generate_classifier_dataset(num_samples: int = 100000) -> pd.DataFrame:
    """Generate synthetic dataset for category and school classifiers"""
    
    print(f"🔄 Generating {num_samples} samples for classifiers...")
    
    data = []
    
    for i in range(num_samples):
        if i % 10000 == 0:
            print(f"  Generated {i} samples...")
        
        # Random category and school
        category = random.choice(EVENT_CATEGORIES)
        school = random.choice(AMITY_SCHOOLS)
        
        # Generate poster text
        poster_data = generate_poster_text(category, school)
        
        data.append({
            "text": poster_data["text"],
            "category": category,
            "school": school
        })
    
    df = pd.DataFrame(data)
    print(f"✅ Generated {len(df)} samples")
    
    return df

def generate_ner_dataset(num_samples: int = 10000) -> List[Dict[str, Any]]:
    """Generate synthetic dataset for NER (spaCy format)"""
    
    print(f"🔄 Generating {num_samples} samples for NER...")
    
    data = []
    
    for i in range(num_samples):
        if i % 1000 == 0:
            print(f"  Generated {i} samples...")
        
        category = random.choice(EVENT_CATEGORIES)
        school = random.choice(AMITY_SCHOOLS)
        
        poster_data = generate_poster_text(category, school)
        text = poster_data["text"]
        
        # Create annotations
        entities = []
        
        # Find DATE entities
        import re
        date_pattern = r'Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})'
        date_match = re.search(date_pattern, text)
        if date_match:
            start = date_match.start(1)
            end = date_match.end(1)
            entities.append((start, end, "DATE"))
        
        # Find TIME entities
        time_pattern = r'Time:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))'
        time_match = re.search(time_pattern, text)
        if time_match:
            start = time_match.start(1)
            end = time_match.end(1)
            entities.append((start, end, "TIME"))
        
        # Find LOCATION entities
        loc_pattern = r'Venue:\s*([A-Za-z0-9\s,]+)'
        loc_match = re.search(loc_pattern, text)
        if loc_match:
            start = loc_match.start(1)
            end = loc_match.end(1)
            entities.append((start, end, "LOCATION"))
        
        # Find ORG entities
        org_pattern = r'Organized by:\s*([A-Za-z\s&]+)'
        org_match = re.search(org_pattern, text)
        if org_match:
            start = org_match.start(1)
            end = org_match.end(1)
            entities.append((start, end, "ORG"))
        
        # Find DEADLINE entities
        deadline_pattern = r'Register by:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})'
        deadline_match = re.search(deadline_pattern, text)
        if deadline_match:
            start = deadline_match.start(1)
            end = deadline_match.end(1)
            entities.append((start, end, "DEADLINE"))
        
        data.append({
            "text": text,
            "entities": entities
        })
    
    print(f"✅ Generated {len(data)} NER samples")
    
    return data

def save_datasets():
    """Generate and save all datasets"""
    
    print("=" * 60)
    print("🚀 Starting Synthetic Data Generation")
    print("=" * 60)
    
    # 1. Generate classifier dataset (100k samples)
    print("\n📊 Phase 1: Category & School Classification Dataset")
    classifier_df = generate_classifier_dataset(100000)
    
    # Split into train/val/test
    train_size = int(0.8 * len(classifier_df))
    val_size = int(0.1 * len(classifier_df))
    
    train_df = classifier_df[:train_size]
    val_df = classifier_df[train_size:train_size + val_size]
    test_df = classifier_df[train_size + val_size:]
    
    # Save classifier datasets
    train_df.to_csv("training_data/classifier_train.csv", index=False)
    val_df.to_csv("training_data/classifier_val.csv", index=False)
    test_df.to_csv("training_data/classifier_test.csv", index=False)
    
    print(f"  ✅ Saved classifier datasets:")
    print(f"     - Train: {len(train_df)} samples")
    print(f"     - Val: {len(val_df)} samples")
    print(f"     - Test: {len(test_df)} samples")
    
    # 2. Generate NER dataset (10k samples)
    print("\n📊 Phase 2: NER Dataset")
    ner_data = generate_ner_dataset(10000)
    
    # Split NER data
    train_ner = ner_data[:8000]
    val_ner = ner_data[8000:9000]
    test_ner = ner_data[9000:]
    
    # Save NER datasets (spaCy format)
    with open("training_data/ner_train.json", "w") as f:
        json.dump(train_ner, f, indent=2)
    
    with open("training_data/ner_val.json", "w") as f:
        json.dump(val_ner, f, indent=2)
    
    with open("training_data/ner_test.json", "w") as f:
        json.dump(test_ner, f, indent=2)
    
    print(f"  ✅ Saved NER datasets:")
    print(f"     - Train: {len(train_ner)} samples")
    print(f"     - Val: {len(val_ner)} samples")
    print(f"     - Test: {len(test_ner)} samples")
    
    # 3. Generate sample posters CSV
    print("\n📊 Phase 3: Sample Event Posters")
    sample_posters = []
    for category in EVENT_CATEGORIES:
        for school in random.sample(AMITY_SCHOOLS, 3):  # 3 schools per category
            poster_data = generate_poster_text(category, school)
            sample_posters.append(poster_data)
    
    sample_df = pd.DataFrame(sample_posters)
    sample_df.to_csv("training_data/sample_posters.csv", index=False)
    print(f"  ✅ Saved {len(sample_df)} sample posters")
    
    print("\n" + "=" * 60)
    print("✅ Dataset Generation Complete!")
    print("=" * 60)
    print("\n📁 Generated files:")
    print("   - training_data/classifier_train.csv (80k samples)")
    print("   - training_data/classifier_val.csv (10k samples)")
    print("   - training_data/classifier_test.csv (10k samples)")
    print("   - training_data/ner_train.json (8k samples)")
    print("   - training_data/ner_val.json (1k samples)")
    print("   - training_data/ner_test.json (1k samples)")
    print("   - training_data/sample_posters.csv (21 samples)")
    print("\n📝 Next steps:")
    print("   1. Run train_models.py to train classifiers")
    print("   2. Models will be saved to ./models/ directory")
    print("   3. Models are automatically loaded by the API server")

if __name__ == "__main__":
    import os
    
    # Create directory
    os.makedirs("training_data", exist_ok=True)
    
    # Generate datasets
    save_datasets()
