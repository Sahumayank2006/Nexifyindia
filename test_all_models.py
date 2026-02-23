"""
Comprehensive test script to check all models and backend status
"""
import os
import sys
from pathlib import Path

def check_files():
    """Check if model files exist"""
    print("="*60)
    print("FILE EXISTENCE CHECK")
    print("="*60)
    
    # Traditional ML Models
    print("\n1. TRADITIONAL ML MODELS (.pkl files):")
    pkl_files = [
        'recommendation_model.pkl',
        'satisfaction_model.pkl',
        'scaler.pkl',
        'label_encoders.pkl',
        'model_metadata.pkl'
    ]
    
    for pkl in pkl_files:
        exists = os.path.exists(pkl)
        size = os.path.getsize(pkl) if exists else 0
        status = "✓" if exists else "✗"
        print(f"   {status} {pkl:30s} ({size:,} bytes)")
    
    # Transformer Models
    print("\n2. TRANSFORMER MODELS:")
    
    print("\n   A. Category Classifier (models/category_classifier/):")
    cat_files = [
        'models/category_classifier/config.json',
        'models/category_classifier/model.safetensors',
        'models/category_classifier/tokenizer.json',
        'models/category_classifier/tokenizer_config.json',
        'models/category_classifier/label_mapping.json'
    ]
    cat_complete = True
    for file in cat_files:
        exists = os.path.exists(file)
        cat_complete = cat_complete and exists
        status = "✓" if exists else "✗"
        size = os.path.getsize(file) if exists else 0
        print(f"      {status} {Path(file).name:30s} ({size:,} bytes)")
    
    print(f"\n   → Category Classifier: {'COMPLETE ✓' if cat_complete else 'INCOMPLETE ✗'}")
    
    print("\n   B. School Classifier (models/school_classifier/ or trained checkpoint):")
    school_dirs = ['models/school_classifier', 'models/school_classifier_temp']
    school_trained = False
    for dir_path in school_dirs:
        if os.path.exists(dir_path):
            files = list(Path(dir_path).rglob('*.safetensors'))
            if files:
                print(f"      ✓ Found in {dir_path}")
                for f in files:
                    print(f"        - {f.name} ({f.stat().st_size:,} bytes)")
                school_trained = True
            else:
                print(f"      ✗ {dir_path} exists but no model weights found")
    
    if not school_trained:
        print(f"      ✗ No school classifier model found")
    
    print(f"\n   → School Classifier: {'COMPLETE ✓' if school_trained else 'NOT TRAINED ✗'}")
    
    # NER Model
    print("\n   C. NER Model (models/ner_model/):")
    ner_path = 'models/ner_model'
    if os.path.exists(ner_path):
        ner_files = list(Path(ner_path).rglob('*.safetensors'))
        if ner_files:
            print(f"      ✓ Found NER model")
            for f in ner_files:
                print(f"        - {f.name} ({f.stat().st_size:,} bytes)")
            ner_trained = True
        else:
            print(f"      ✗ Directory exists but no model weights")
            ner_trained = False
    else:
        print(f"      ✗ models/ner_model/ does not exist")
        ner_trained = False
    
    print(f"\n   → NER Model: {'COMPLETE ✓' if ner_trained else 'NOT TRAINED ✗'}")
    
    return {
        'pkl_models': all(os.path.exists(p) for p in pkl_files),
        'category_classifier': cat_complete,
        'school_classifier': school_trained,
        'ner_model': ner_trained
    }

def test_model_loading():
    """Test if models can actually be loaded"""
    print("\n" + "="*60)
    print("MODEL LOADING TEST")
    print("="*60)
    
    results = {}
    
    # Test Traditional ML Models
    print("\n1. TRADITIONAL ML MODELS:")
    try:
        import joblib
        print("   Attempting to load pkl files...")
        
        try:
            rec = joblib.load('recommendation_model.pkl')
            print("   ✓ recommendation_model.pkl loaded")
            results['recommendation'] = True
        except Exception as e:
            print(f"   ✗ recommendation_model.pkl failed: {e}")
            results['recommendation'] = False
        
        try:
            sat = joblib.load('satisfaction_model.pkl')
            print("   ✓ satisfaction_model.pkl loaded")
            results['satisfaction'] = True
        except Exception as e:
            print(f"   ✗ satisfaction_model.pkl failed: {e}")
            results['satisfaction'] = False
            
    except ImportError:
        print("   ✗ joblib not installed")
        results['recommendation'] = False
        results['satisfaction'] = False
    
    # Test Transformer Models
    print("\n2. TRANSFORMER MODELS:")
    try:
        from transformers import AutoModelForSequenceClassification, AutoTokenizer
        
        # Category Classifier
        try:
            model = AutoModelForSequenceClassification.from_pretrained('models/category_classifier')
            tokenizer = AutoTokenizer.from_pretrained('models/category_classifier')
            print("   ✓ Category Classifier loaded successfully")
            results['category_classifier'] = True
        except Exception as e:
            print(f"   ✗ Category Classifier failed: {str(e)[:100]}")
            results['category_classifier'] = False
        
        # School Classifier
        try:
            # Check if there's a trained checkpoint
            school_path = None
            if os.path.exists('models/school_classifier'):
                school_path = 'models/school_classifier'
            else:
                # Check for checkpoints in temp folder
                temp_path = Path('models/school_classifier_temp')
                if temp_path.exists():
                    checkpoints = list(temp_path.glob('checkpoint-*'))
                    if checkpoints:
                        school_path = str(sorted(checkpoints)[-1])  # Latest checkpoint
            
            if school_path:
                model = AutoModelForSequenceClassification.from_pretrained(school_path)
                tokenizer = AutoTokenizer.from_pretrained(school_path)
                print(f"   ✓ School Classifier loaded from {school_path}")
                results['school_classifier'] = True
            else:
                print("   ✗ School Classifier: No trained model found")
                results['school_classifier'] = False
        except Exception as e:
            print(f"   ✗ School Classifier failed: {str(e)[:100]}")
            results['school_classifier'] = False
            
    except ImportError:
        print("   ✗ transformers library not installed")
        results['category_classifier'] = False
        results['school_classifier'] = False
    
    return results

def check_backend_files():
    """Check if backend server files exist"""
    print("\n" + "="*60)
    print("BACKEND FILES CHECK")
    print("="*60)
    
    backend_files = {
        'Main Backend': 'backend_server.py',
        'Event API': 'event_api_server.py',
        'Event Guidance API': 'event_guidance_api.py',
        'Simple API': 'simple_api.py',
        'API Simple': 'api_simple.py',
        'Recommendation System': 'recommendation_system.py',
        'Event Management': 'event_management.py'
    }
    
    print("\nBackend Server Files:")
    all_exist = True
    for name, file in backend_files.items():
        exists = os.path.exists(file)
        all_exist = all_exist and exists
        status = "✓" if exists else "✗"
        print(f"   {status} {name:25s} ({file})")
    
    return all_exist

def main():
    print("\n" + "="*60)
    print("CAMPUS MEMORY - COMPLETE SYSTEM STATUS CHECK")
    print("="*60)
    
    # Check files
    file_status = check_files()
    
    # Test loading
    load_status = test_model_loading()
    
    # Check backend
    backend_exists = check_backend_files()
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    print("\n📊 MODEL STATUS:")
    print(f"   Traditional ML Models (pkl):    {'✓ TRAINED' if file_status['pkl_models'] else '✗ MISSING'}")
    print(f"   Category Classifier:            {'✓ TRAINED' if file_status['category_classifier'] else '✗ MISSING'}")
    print(f"   School Classifier:              {'✓ TRAINED' if file_status['school_classifier'] else '✗ NOT TRAINED'}")
    print(f"   NER Model:                      {'✓ TRAINED' if file_status['ner_model'] else '✗ NOT TRAINED'}")
    
    print("\n🔧 MODEL LOADING STATUS:")
    if load_status:
        for model, status in load_status.items():
            print(f"   {model:25s} {'✓ Working' if status else '✗ Failed'}")
    
    print(f"\n🖥️  BACKEND STATUS:")
    print(f"   Backend Server Files:           {'✓ PRESENT' if backend_exists else '✗ MISSING'}")
    
    # Overall status
    print("\n" + "="*60)
    all_models_exist = all(file_status.values())
    all_models_load = all(load_status.values()) if load_status else False
    
    if all_models_exist and all_models_load and backend_exists:
        print("✅ OVERALL STATUS: FULLY OPERATIONAL")
    elif all_models_exist and backend_exists:
        print("⚠️  OVERALL STATUS: MODELS EXIST BUT SOME MAY HAVE LOADING ISSUES")
    else:
        print("❌ OVERALL STATUS: INCOMPLETE - SOME MODELS NOT TRAINED")
    
    print("="*60)
    
    # Action items
    print("\n📋 ACTION ITEMS:")
    if not file_status['school_classifier']:
        print("   • Train School Classifier model")
    if not file_status['ner_model']:
        print("   • Train NER model")
    if not all_models_load:
        print("   • Fix model loading issues (possibly version mismatch)")
    if all_models_exist and all_models_load and backend_exists:
        print("   ✓ All systems ready - no action needed!")

if __name__ == "__main__":
    main()
