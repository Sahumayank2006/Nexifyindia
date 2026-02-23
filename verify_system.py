#!/usr/bin/env python3
"""
System Verification Script
Checks if all components are properly configured and working
"""

import sys
import os
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80)

def print_status(check, passed, message=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"  [{status}] {check}")
    if message:
        print(f"         {message}")

def check_python_version():
    version = sys.version_info
    passed = version.major == 3 and version.minor >= 8
    print_status(
        "Python Version", 
        passed,
        f"Found: {version.major}.{version.minor}.{version.micro}" + 
        ("" if passed else " (Need 3.8+)")
    )
    return passed

def check_python_packages():
    required = [
        'pandas', 'numpy', 'sklearn', 'xgboost', 
        'joblib', 'fastapi', 'uvicorn', 'pydantic'
    ]
    missing = []
    
    for package in required:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    passed = len(missing) == 0
    print_status(
        "Python Packages",
        passed,
        f"Missing: {', '.join(missing)}" if missing else "All installed"
    )
    return passed

def check_ml_models():
    models = [
        'recommendation_model.pkl',
        'satisfaction_model.pkl',
        'scaler.pkl',
        'label_encoders.pkl',
        'model_metadata.pkl'
    ]
    
    missing = [m for m in models if not Path(m).exists()]
    passed = len(missing) == 0
    
    print_status(
        "ML Model Files",
        passed,
        f"Missing: {', '.join(missing)}" if missing else "All present"
    )
    return passed

def check_dataset():
    passed = Path('event_feedback_dataset.csv').exists()
    print_status(
        "Training Dataset",
        passed,
        "event_feedback_dataset.csv found" if passed else "Dataset missing"
    )
    return passed

def check_nodejs():
    try:
        result = subprocess.run(
            ['node', '--version'], 
            capture_output=True, 
            text=True
        )
        version = result.stdout.strip()
        passed = result.returncode == 0
        print_status(
            "Node.js",
            passed,
            f"Found: {version}" if passed else "Not found"
        )
        return passed
    except:
        print_status("Node.js", False, "Not found in PATH")
        return False

def check_frontend_deps():
    node_modules = Path('CampusMemory/CampusMemory/node_modules')
    passed = node_modules.exists()
    print_status(
        "Frontend Dependencies",
        passed,
        "node_modules found" if passed else "Run: npm install"
    )
    return passed

def check_env_file():
    env_file = Path('CampusMemory/CampusMemory/.env.local')
    passed = env_file.exists()
    print_status(
        "Environment Config",
        passed,
        ".env.local found" if passed else "File missing"
    )
    return passed

def check_api_files():
    files = [
        'backend_server.py',
        'recommendation_system.py',
        'event_guidance_system.py',
        'event_management.py'
    ]
    
    missing = [f for f in files if not Path(f).exists()]
    passed = len(missing) == 0
    
    print_status(
        "Backend Files",
        passed,
        f"Missing: {', '.join(missing)}" if missing else "All present"
    )
    return passed

def check_frontend_files():
    files = [
        'CampusMemory/CampusMemory/src/lib/api.ts',
        'CampusMemory/CampusMemory/src/components/Events.tsx',
        'CampusMemory/CampusMemory/src/app/page.tsx'
    ]
    
    missing = [f for f in files if not Path(f).exists()]
    passed = len(missing) == 0
    
    print_status(
        "Frontend Files",
        passed,
        f"Missing: {', '.join(missing)}" if missing else "All present"
    )
    return passed

def check_backend_running():
    try:
        import requests
        response = requests.get('http://localhost:8000/health', timeout=2)
        passed = response.status_code == 200
        print_status(
            "Backend Server",
            passed,
            "Running on http://localhost:8000" if passed else "Not responding"
        )
        return passed
    except:
        print_status(
            "Backend Server",
            False,
            "Not running (run: python backend_server.py)"
        )
        return False

def check_frontend_running():
    try:
        import requests
        response = requests.get('http://localhost:3000', timeout=2)
        passed = response.status_code == 200
        print_status(
            "Frontend Server",
            passed,
            "Running on http://localhost:3000" if passed else "Not responding"
        )
        return passed
    except:
        print_status(
            "Frontend Server",
            False,
            "Not running (run: npm run dev)"
        )
        return False

def main():
    print_header("Campus Memory + ML Integration - System Check")
    
    results = {}
    
    # Prerequisites
    print("\n📋 Prerequisites:")
    results['python'] = check_python_version()
    results['python_packages'] = check_python_packages()
    results['nodejs'] = check_nodejs()
    
    # ML Components
    print("\n🤖 ML Components:")
    results['models'] = check_ml_models()
    results['dataset'] = check_dataset()
    results['backend_files'] = check_api_files()
    
    # Frontend Components
    print("\n🎨 Frontend Components:")
    results['frontend_deps'] = check_frontend_deps()
    results['frontend_files'] = check_frontend_files()
    results['env_file'] = check_env_file()
    
    # Running Services
    print("\n🚀 Running Services:")
    results['backend'] = check_backend_running()
    results['frontend'] = check_frontend_running()
    
    # Summary
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    print_header("Summary")
    print(f"\n  Checks Passed: {passed}/{total}")
    
    if passed == total:
        print("\n  ✅ System is fully operational!")
    elif passed >= total * 0.7:
        print("\n  ⚠️  System is mostly ready. Check failed items above.")
    else:
        print("\n  ❌ System needs setup. Follow the integration guide.")
    
    print("\n" + "="*80)
    
    # Recommendations
    if not results['python_packages']:
        print("\n💡 Fix: pip install -r requirements.txt")
    
    if not results['models']:
        print("\n💡 Fix: python train_model.py")
    
    if not results['frontend_deps']:
        print("\n💡 Fix: cd CampusMemory/CampusMemory && npm install")
    
    if not results['backend']:
        print("\n💡 Fix: python backend_server.py")
    
    if not results['frontend']:
        print("\n💡 Fix: cd CampusMemory/CampusMemory && npm run dev")
    
    print("\n📚 See INTEGRATION_GUIDE.md for detailed instructions\n")

if __name__ == "__main__":
    main()
