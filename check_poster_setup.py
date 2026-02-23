"""
Quick Diagnostic Tool for Poster Extraction Feature
Run this to check if everything is set up correctly
"""

import sys

def print_status(message, status):
    """Print status with color coding"""
    symbols = {"ok": "✅", "warning": "⚠️", "error": "❌", "info": "ℹ️"}
    print(f"{symbols.get(status, '•')} {message}")

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print_status(f"Python {version.major}.{version.minor}.{version.micro}", "ok")
    if version < (3, 8):
        print_status("  Warning: Python 3.8+ recommended", "warning")
    return True

def check_module(name, required=True):
    """Check if a module is installed"""
    try:
        __import__(name)
        print_status(f"{name} installed", "ok")
        return True
    except ImportError:
        if required:
            print_status(f"{name} NOT installed", "error")
            return False
        else:
            print_status(f"{name} not installed (optional)", "warning")
            return True

def check_api_imports():
    """Check if the poster analysis module can be imported"""
    try:
        from poster_analysis_ai import get_analysis_pipeline
        print_status("poster_analysis_ai module imports correctly", "ok")
        
        # Try to create pipeline
        pipeline = get_analysis_pipeline()
        print_status("AI pipeline can be initialized", "ok")
        return True
    except Exception as e:
        print_status(f"poster_analysis_ai import failed: {e}", "error")
        return False

def check_backend_running():
    """Check if backend API is running"""
    try:
        import requests
        response = requests.get("http://localhost:8001/", timeout=2)
        print_status("Backend server is running on port 8001", "ok")
        return True
    except ImportError:
        print_status("requests module not installed (cannot check server)", "warning")
        return True
    except Exception:
        print_status("Backend server NOT running on port 8001", "error")
        print_status("  Start with: python event_api_server.py", "info")
        return False

def main():
    print("=" * 60)
    print("  POSTER EXTRACTION FEATURE - DIAGNOSTIC CHECK")
    print("=" * 60)
    print()
    
    all_ok = True
    
    # Check Python
    print("🐍 Python Environment:")
    check_python_version()
    print()
    
    # Check core dependencies
    print("📦 Core Dependencies:")
    all_ok &= check_module("fastapi")
    all_ok &= check_module("pydantic")
    all_ok &= check_module("PIL", required=False)
    print()
    
    # Check AI dependencies
    print("🤖 AI/ML Dependencies:")
    paddleocr_ok = check_module("paddleocr", required=False)
    transformers_ok = check_module("transformers", required=False)
    spacy_ok = check_module("spacy", required=False)
    dateutil_ok = check_module("dateutil", required=False)
    print()
    
    # Check if spaCy model is downloaded
    if spacy_ok:
        try:
            import spacy
            nlp = spacy.load("en_core_web_sm")
            print_status("spaCy English model (en_core_web_sm) installed", "ok")
        except:
            print_status("spaCy English model NOT downloaded", "warning")
            print_status("  Download with: python -m spacy download en_core_web_sm", "info")
    print()
    
    # Check poster analysis module
    print("🔍 Poster Analysis Module:")
    poster_ok = check_api_imports()
    print()
    
    # Check backend server
    print("🖥️  Backend Server:")
    check_backend_running()
    print()
    
    # Summary
    print("=" * 60)
    print("  SUMMARY")
    print("=" * 60)
    print()
    
    if not paddleocr_ok or not transformers_ok or not spacy_ok:
        print_status("AI dependencies missing - using fallback methods", "warning")
        print()
        print("  To install AI dependencies:")
        print("  1. Run: python setup_poster_extraction.py")
        print("  OR")
        print("  2. Manually install:")
        if not paddleocr_ok:
            print("     pip install paddleocr paddlepaddle")
        if not transformers_ok:
            print("     pip install transformers torch")
        if not spacy_ok:
            print("     pip install spacy")
            print("     python -m spacy download en_core_web_sm")
        if not dateutil_ok:
            print("     pip install python-dateutil")
        print()
        print("  Note: The system will still work with rule-based fallbacks,")
        print("        but AI dependencies provide better accuracy.")
    else:
        print_status("All AI dependencies installed!", "ok")
    
    print()
    
    if poster_ok:
        print_status("✨ Poster extraction module is ready!", "ok")
    else:
        print_status("⚠️  Poster extraction needs setup", "warning")
    
    print()
    print("=" * 60)
    print()
    
    # Test suggestion
    print("📋 Next Steps:")
    print()
    print("1. If backend is not running:")
    print("   python event_api_server.py")
    print()
    print("2. Test the extraction:")
    print("   python test_poster_extraction.py")
    print()
    print("3. Use in frontend:")
    print("   - Open Event Management Dashboard")
    print("   - Click 'Upload Poster' tab")
    print("   - Upload a poster image")
    print()
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCheck cancelled.")
    except Exception as e:
        print(f"\n❌ Error during diagnostic: {e}")
        import traceback
        traceback.print_exc()
