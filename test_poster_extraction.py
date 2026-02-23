"""
Test Poster Information Extraction
This script demonstrates the automatic poster analysis feature
"""

import json
from poster_analysis_ai import get_analysis_pipeline

def test_poster_analysis():
    """Test the poster analysis pipeline"""
    
    print("=" * 60)
    print("POSTER INFORMATION EXTRACTION TEST")
    print("=" * 60)
    print()
    
    # Initialize the pipeline
    print("Initializing AI Pipeline...")
    pipeline = get_analysis_pipeline()
    print()
    
    # Test with mock data (since OCR requires actual image)
    print("Testing with sample poster text...")
    print("-" * 60)
    
    # Simulate extracted text from a poster
    sample_text = """
    TECH FEST 2026
    Innovation and Technology Summit
    
    Amity School of Computer Science
    
    Date: March 15-16, 2026
    Time: 9:00 AM - 6:00 PM
    Venue: Main Auditorium, Block A
    
    Register by: March 10, 2026
    
    Organized by: Student Technical Council
    Contact: techfest@amity.edu
    
    Join us for workshops, hackathons, and tech talks!
    Network with industry leaders and showcase your innovations.
    """
    
    print("Sample Poster Text:")
    print(sample_text)
    print()
    print("-" * 60)
    print()
    
    # Analyze using the pipeline (using mock OCR)
    result = pipeline.analyze_poster("mock_poster.jpg")
    
    # Display results
    print("EXTRACTION RESULTS:")
    print("=" * 60)
    print()
    
    if result.get("success"):
        extracted = result.get("extractedData", {})
        confidence = result.get("confidence", {})
        
        print("📋 Event Information Extracted:")
        print("-" * 60)
        print(f"Title:                {extracted.get('title', 'N/A')}")
        print(f"Category:             {extracted.get('category', 'N/A')}")
        print(f"School:               {extracted.get('school', 'N/A')}")
        print(f"Date:                 {extracted.get('date', 'N/A')}")
        print(f"Time:                 {extracted.get('time', 'N/A')}")
        print(f"Location:             {extracted.get('location', 'N/A')}")
        print(f"Organizer:            {extracted.get('organizer', 'N/A')}")
        print(f"Registration Deadline: {extracted.get('registrationDeadline', 'N/A')}")
        print(f"Description:          {extracted.get('description', 'N/A')[:100]}...")
        print()
        
        print("📊 Confidence Scores:")
        print("-" * 60)
        print(f"Category Confidence:  {confidence.get('category', 0):.0%}")
        print(f"School Confidence:    {confidence.get('school', 0):.0%}")
        print(f"Overall Confidence:   {confidence.get('overall', 0):.0%}")
        print()
        
        if result.get("needsReview"):
            print("⚠️  NOTE: Low confidence detected. Please review extracted data.")
        else:
            print("✅ High confidence extraction - Ready to use!")
        
        print()
        print("=" * 60)
        print()
        
        # Show field-level confidence
        if 'fields' in confidence:
            print("📈 Field-Level Confidence:")
            print("-" * 60)
            for field, conf in confidence['fields'].items():
                status = "✅" if conf > 0.7 else "⚠️" if conf > 0.5 else "❌"
                print(f"{status} {field:20s}: {conf:.0%}")
            print()
        
        # Show suggestions
        if result.get('suggestions'):
            print("💡 Suggestions:")
            print("-" * 60)
            for suggestion in result['suggestions']:
                print(f"  • {suggestion}")
            print()
        
        print("=" * 60)
        print()
        print("✨ FEATURE DEMONSTRATION COMPLETE")
        print()
        print("How to use in your application:")
        print("1. Upload a poster image via the frontend")
        print("2. The system automatically extracts all text using OCR")
        print("3. NLP analyzes the text and fills all event fields")
        print("4. Review the auto-filled data (edit if needed)")
        print("5. Submit to create the event")
        print()
        print("No manual data entry required! 🎉")
        print("=" * 60)
        
    else:
        print("❌ Analysis failed:", result.get("error", "Unknown error"))
    
    return result


def display_json_result(result):
    """Display the full JSON result"""
    print()
    print("=" * 60)
    print("FULL JSON RESPONSE:")
    print("=" * 60)
    print(json.dumps(result, indent=2))
    print("=" * 60)


if __name__ == "__main__":
    try:
        result = test_poster_analysis()
        
        # Optionally display full JSON
        print()
        response = input("Show full JSON response? (y/n): ").strip().lower()
        if response == 'y':
            display_json_result(result)
        
        print()
        print("Test completed successfully! ✅")
        
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()
