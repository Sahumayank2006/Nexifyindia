"""
Quick Start Script for Campus Event Management System
Run this to set up everything automatically
"""

import os
import sys
import subprocess

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def run_command(command, description):
    print(f"⏳ {description}...")
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ {description} - Complete!")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ {description} - Failed!")
        return False

def main():
    print_header("🚀 Campus Event Management System - Setup")
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required!")
        return
    
    print("✅ Python version OK")
    
    # Install dependencies
    print_header("📦 Installing Dependencies")
    
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        return
    
    if not run_command("python -m spacy download en_core_web_sm", "Downloading spaCy model"):
        print("⚠️  spaCy model download failed. You can continue, but NER will use fallback.")
    
    # Create directories
    print_header("📁 Creating Directories")
    
    os.makedirs("models", exist_ok=True)
    os.makedirs("training_data", exist_ok=True)
    print("✅ Directories created")
    
    # Check Firebase credentials
    print_header("🔑 Firebase Configuration")
    
    if not os.path.exists("firebase-credentials.json"):
        print("⚠️  firebase-credentials.json not found!")
        print("\n📝 Please create firebase-credentials.json with your Firebase service account key")
        print("   Get it from: Firebase Console > Project Settings > Service Accounts")
        response = input("\nDo you want to continue anyway? (y/n): ")
        if response.lower() != 'y':
            print("Setup paused. Add firebase-credentials.json and run again.")
            return
    else:
        print("✅ Firebase credentials found")
    
    # Ask about training data and models
    print_header("🧠 AI Models Setup")
    
    response = input("Do you want to generate training data and train models? (y/n): ")
    
    if response.lower() == 'y':
        print("\n⏳ This will take some time...")
        
        if run_command("python generate_synthetic_training_data.py", 
                      "Generating 100k+ training samples"):
            print("\n✅ Training data generated!")
            
            response = input("\nDo you want to train the AI models now? (y/n): ")
            if response.lower() == 'y':
                print("\n⚠️  Model training can take 1-2 hours on CPU")
                response = input("Continue? (y/n): ")
                
                if response.lower() == 'y':
                    run_command("python train_ai_models.py", "Training AI models")
    else:
        print("⏭️  Skipping AI model training")
        print("   Models will use rule-based classification")
    
    # Setup complete
    print_header("✅ Setup Complete!")
    
    print("🎉 Your Campus Event Management System is ready!")
    print("\n📝 Next Steps:")
    print("   1. Start the API server:")
    print("      python event_api_server.py")
    print("\n   2. Access the API documentation:")
    print("      http://localhost:8001/docs")
    print("\n   3. (Optional) Set up the frontend:")
    print("      cd CampusMemory/CampusMemory")
    print("      npm install")
    print("      npm run dev")
    print("\n📖 Full documentation: EVENT_MANAGEMENT_README.md")
    print("🚀 Deployment guide: DEPLOYMENT_GUIDE.md")
    
    # Ask to start server
    response = input("\n🚀 Start the API server now? (y/n): ")
    if response.lower() == 'y':
        print("\n" + "=" * 70)
        print("  Starting API Server...")
        print("  Press Ctrl+C to stop")
        print("=" * 70 + "\n")
        
        try:
            subprocess.run("python event_api_server.py", shell=True)
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Thanks for using Campus Event Management!")

if __name__ == "__main__":
    main()
