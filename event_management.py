"""
Event Management Helper
Utilities for managing events in the Campus Memory system
"""

import json
import os
from datetime import datetime, timedelta

DATA_DIR = "campus_data"

def create_sample_events():
    """Create sample events for testing"""
    events = [
        {
            "id": "evt1",
            "name": "Hacksetu",
            "type": "Hackathon",
            "level": "National",
            "duration_days": 2,
            "description": "National level hackathon focused on innovative solutions. Build projects that solve real-world problems with cutting-edge technology.",
            "date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
            "location": "Main Campus Auditorium",
            "registrations": 245,
            "max_participants": 500,
            "prizes": "₹1,00,000",
            "organizer": "Technical Society",
            "contact": "tech@university.edu"
        },
        {
            "id": "evt2",
            "name": "Smart India Hackathon",
            "type": "Hackathon",
            "level": "National",
            "duration_days": 3,
            "description": "Government initiative for solving real-world problems. Work on challenges from various ministries and departments.",
            "date": (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
            "location": "Multiple Locations Nationwide",
            "registrations": 1520,
            "max_participants": 2000,
            "prizes": "₹5,00,000",
            "organizer": "Ministry of Education",
            "contact": "sih@gov.in"
        },
        {
            "id": "evt3",
            "name": "Ami Chroma",
            "type": "Cultural",
            "level": "University",
            "duration_days": 3,
            "description": "Annual cultural fest with music, dance, drama competitions and celebrity performances. Experience the vibrant campus culture!",
            "date": (datetime.now() + timedelta(days=20)).strftime("%Y-%m-%d"),
            "location": "University Auditorium & Grounds",
            "registrations": 3200,
            "max_participants": 5000,
            "prizes": "₹50,000",
            "organizer": "Cultural Committee",
            "contact": "culture@university.edu"
        },
        {
            "id": "evt4",
            "name": "Init Maths",
            "type": "Training",
            "level": "Department",
            "duration_days": 6,
            "description": "Intensive mathematics workshop for competitive programming. Learn algorithmic problem-solving and mathematical optimization.",
            "date": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
            "location": "Mathematics Department, Block C",
            "registrations": 78,
            "max_participants": 100,
            "prizes": "Certificates",
            "organizer": "Mathematics Department",
            "contact": "math@university.edu"
        },
        {
            "id": "evt5",
            "name": "TechFest 2026",
            "type": "Technical",
            "level": "University",
            "duration_days": 2,
            "description": "Annual technical festival featuring coding competitions, robotics, AI challenges, tech talks and workshops.",
            "date": (datetime.now() + timedelta(days=35)).strftime("%Y-%m-%d"),
            "location": "Technology Park, Campus",
            "registrations": 890,
            "max_participants": 1500,
            "prizes": "₹2,50,000",
            "organizer": "Tech Council",
            "contact": "techfest@university.edu"
        },
        {
            "id": "evt6",
            "name": "Anveshan",
            "type": "Hackathon",
            "level": "University",
            "duration_days": 1,
            "description": "24-hour hackathon to build innovative projects. Perfect for beginners and experienced coders alike.",
            "date": (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
            "location": "Computer Science Block",
            "registrations": 156,
            "max_participants": 200,
            "prizes": "₹30,000",
            "organizer": "CSE Department",
            "contact": "cse@university.edu"
        },
        {
            "id": "evt7",
            "name": "Convocation 2026",
            "type": "Ceremony",
            "level": "University",
            "duration_days": 1,
            "description": "Annual convocation ceremony celebrating graduating students. A memorable day for final year students and their families.",
            "date": (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d"),
            "location": "University Convocation Hall",
            "registrations": 2500,
            "max_participants": 5000,
            "prizes": "N/A",
            "organizer": "University Administration",
            "contact": "admin@university.edu"
        },
        {
            "id": "evt8",
            "name": "StartupX",
            "type": "Workshop",
            "level": "University",
            "duration_days": 2,
            "description": "Entrepreneurship workshop with successful founders. Learn about startup ecosystem, fundraising, and building products.",
            "date": (datetime.now() + timedelta(days=25)).strftime("%Y-%m-%d"),
            "location": "Innovation Center",
            "registrations": 234,
            "max_participants": 300,
            "prizes": "Incubation Opportunities",
            "organizer": "Entrepreneurship Cell",
            "contact": "ecell@university.edu"
        },
        {
            "id": "evt9",
            "name": "Code Sprint",
            "type": "Competition",
            "level": "Department",
            "duration_days": 1,
            "description": "Speed coding competition. Solve algorithmic challenges in limited time. Great for competitive programming practice.",
            "date": (datetime.now() + timedelta(days=12)).strftime("%Y-%m-%d"),
            "location": "CSE Lab 204",
            "registrations": 89,
            "max_participants": 120,
            "prizes": "₹15,000",
            "organizer": "Coding Club",
            "contact": "codingclub@university.edu"
        },
        {
            "id": "evt10",
            "name": "Research Symposium",
            "type": "Conference",
            "level": "University",
            "duration_days": 2,
            "description": "Academic research presentations from students and faculty. Showcase your research work and learn from others.",
            "date": (datetime.now() + timedelta(days=50)).strftime("%Y-%m-%d"),
            "location": "Research Center",
            "registrations": 145,
            "max_participants": 250,
            "prizes": "Best Paper Awards",
            "organizer": "Research Cell",
            "contact": "research@university.edu"
        }
    ]
    
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(os.path.join(DATA_DIR, "events.json"), 'w') as f:
        json.dump(events, f, indent=2)
    
    print(f"✅ Created {len(events)} sample events")
    return events

def list_events():
    """List all events"""
    filepath = os.path.join(DATA_DIR, "events.json")
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            events = json.load(f)
        
        print(f"\n📅 Total Events: {len(events)}\n")
        for evt in events:
            print(f"  [{evt['id']}] {evt['name']}")
            print(f"      Type: {evt['type']} | Level: {evt['level']} | Date: {evt['date']}")
            print(f"      Registrations: {evt['registrations']}/{evt['max_participants']}")
            print()
        
        return events
    else:
        print("No events found. Run create_sample_events() first.")
        return []

def get_event_statistics():
    """Get event statistics"""
    filepath = os.path.join(DATA_DIR, "events.json")
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            events = json.load(f)
        
        types = {}
        levels = {}
        total_registrations = 0
        
        for evt in events:
            evt_type = evt['type']
            evt_level = evt['level']
            types[evt_type] = types.get(evt_type, 0) + 1
            levels[evt_level] = levels.get(evt_level, 0) + 1
            total_registrations += evt['registrations']
        
        print("\n📊 Event Statistics:\n")
        print(f"  Total Events: {len(events)}")
        print(f"  Total Registrations: {total_registrations:,}")
        print(f"\n  By Type:")
        for type_, count in sorted(types.items()):
            print(f"    - {type_}: {count}")
        print(f"\n  By Level:")
        for level, count in sorted(levels.items()):
            print(f"    - {level}: {count}")
        
        return {
            "total_events": len(events),
            "total_registrations": total_registrations,
            "by_type": types,
            "by_level": levels
        }
    else:
        print("No events found.")
        return {}

if __name__ == "__main__":
    print("="*80)
    print("EVENT MANAGEMENT SYSTEM")
    print("="*80)
    
    # Create sample events
    events = create_sample_events()
    
    # List all events
    list_events()
    
    # Show statistics
    get_event_statistics()
    
    print("\n✅ Event management setup complete!")
    print("   Events are stored in: campus_data/events.json")
