"""
Model Training Script for Category, School Classifiers and NER
Phase 2: Train DistilBERT and spaCy models
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, f1_score
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print("🧠 AI Model Training Pipeline")
print("=" * 70)

# ========================================
# PART 1: Train Category & School Classifiers
# ========================================

print("\n📊 PART 1: Training DistilBERT Classifiers")
print("-" * 70)

try:
    from transformers import (
        AutoTokenizer,
        AutoModelForSequenceClassification,
        TrainingArguments,
        Trainer,
        DataCollatorWithPadding
    )
    import torch
    from torch.utils.data import Dataset
    
    TRANSFORMERS_AVAILABLE = True
    print("✅ Transformers library loaded")
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("⚠️  Transformers not installed. Install with: pip install transformers torch")

if TRANSFORMERS_AVAILABLE:
    
    class PosterDataset(Dataset):
        """Custom dataset for poster texts"""
        
        def __init__(self, texts, labels, tokenizer, max_length=256):
            self.texts = texts
            self.labels = labels
            self.tokenizer = tokenizer
            self.max_length = max_length
        
        def __len__(self):
            return len(self.texts)
        
        def __getitem__(self, idx):
            text = str(self.texts[idx])
            label = self.labels[idx]
            
            encoding = self.tokenizer(
                text,
                max_length=self.max_length,
                padding='max_length',
                truncation=True,
                return_tensors='pt'
            )
            
            return {
                'input_ids': encoding['input_ids'].flatten(),
                'attention_mask': encoding['attention_mask'].flatten(),
                'labels': torch.tensor(label, dtype=torch.long)
            }
    
    def train_classifier(train_file, val_file, label_column, model_name, output_dir):
        """Train a DistilBERT classifier"""
        
        print(f"\n🔧 Training {label_column} classifier...")
        
        # Load data
        train_df = pd.read_csv(train_file)
        val_df = pd.read_csv(val_file)
        
        # Create label mapping
        unique_labels = sorted(train_df[label_column].unique())
        label2id = {label: idx for idx, label in enumerate(unique_labels)}
        id2label = {idx: label for label, idx in label2id.items()}
        
        print(f"   📋 Number of classes: {len(unique_labels)}")
        print(f"   📋 Training samples: {len(train_df)}")
        print(f"   📋 Validation samples: {len(val_df)}")
        
        # Map labels to IDs
        train_labels = train_df[label_column].map(label2id).values
        val_labels = val_df[label_column].map(label2id).values
        
        # Initialize tokenizer and model
        tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
        model = AutoModelForSequenceClassification.from_pretrained(
            'distilbert-base-uncased',
            num_labels=len(unique_labels),
            id2label=id2label,
            label2id=label2id
        )
        
        # Create datasets
        train_dataset = PosterDataset(train_df['text'].values, train_labels, tokenizer)
        val_dataset = PosterDataset(val_df['text'].values, val_labels, tokenizer)
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=3,
            per_device_train_batch_size=16,
            per_device_eval_batch_size=32,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir=f'{output_dir}/logs',
            logging_steps=100,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
        )
        
        # Trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            tokenizer=tokenizer,
        )
        
        # Train
        print("   🚀 Starting training...")
        trainer.train()
        
        # Evaluate
        print("   📊 Evaluating...")
        eval_results = trainer.evaluate()
        
        # Save model
        print(f"   💾 Saving model to {output_dir}")
        model.save_pretrained(output_dir)
        tokenizer.save_pretrained(output_dir)
        
        # Save label mappings
        with open(f"{output_dir}/label_mapping.json", "w") as f:
            json.dump({
                "label2id": label2id,
                "id2label": id2label
            }, f, indent=2)
        
        # Calculate accuracy on validation set
        predictions = trainer.predict(val_dataset)
        pred_labels = np.argmax(predictions.predictions, axis=1)
        accuracy = (pred_labels == val_labels).mean()
        
        print(f"   ✅ {label_column} Classifier Trained!")
        print(f"   📈 Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        
        return accuracy
    
    # Train Category Classifier
    if os.path.exists("training_data/classifier_train.csv"):
        category_acc = train_classifier(
            "training_data/classifier_train.csv",
            "training_data/classifier_val.csv",
            "category",
            "category_classifier",
            "./models/category_classifier"
        )
    else:
        print("⚠️  Training data not found. Run generate_synthetic_training_data.py first")
        category_acc = 0
    
    # Train School Classifier
    if os.path.exists("training_data/classifier_train.csv"):
        school_acc = train_classifier(
            "training_data/classifier_train.csv",
            "training_data/classifier_val.csv",
            "school",
            "school_classifier",
            "./models/school_classifier"
        )
    else:
        school_acc = 0

else:
    print("⏭️  Skipping DistilBERT training (transformers not available)")
    category_acc = 0
    school_acc = 0

# ========================================
# PART 2: Train NER Model (spaCy)
# ========================================

print("\n" + "=" * 70)
print("📊 PART 2: Training spaCy NER Model")
print("-" * 70)

try:
    import spacy
    from spacy.training import Example
    from spacy.util import minibatch, compounding
    import random
    
    SPACY_AVAILABLE = True
    print("✅ spaCy library loaded")
except ImportError:
    SPACY_AVAILABLE = False
    print("⚠️  spaCy not installed. Install with: pip install spacy")

if SPACY_AVAILABLE and os.path.exists("training_data/ner_train.json"):
    
    print("\n🔧 Training NER model...")
    
    # Load training data
    with open("training_data/ner_train.json", "r") as f:
        train_data = json.load(f)
    
    with open("training_data/ner_val.json", "r") as f:
        val_data = json.load(f)
    
    print(f"   📋 Training samples: {len(train_data)}")
    print(f"   📋 Validation samples: {len(val_data)}")
    
    # Create blank English model
    nlp = spacy.blank("en")
    
    # Add NER pipe
    if "ner" not in nlp.pipe_names:
        ner = nlp.add_pipe("ner")
    else:
        ner = nlp.get_pipe("ner")
    
    # Add labels
    labels = ["DATE", "TIME", "LOCATION", "ORG", "DEADLINE"]
    for label in labels:
        ner.add_label(label)
    
    # Get names of pipes to disable during training
    pipe_exceptions = ["ner"]
    unaffected_pipes = [pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]
    
    # Train the model
    print("   🚀 Starting NER training...")
    
    with nlp.disable_pipes(*unaffected_pipes):
        optimizer = nlp.begin_training()
        
        for epoch in range(30):  # 30 epochs
            random.shuffle(train_data)
            losses = {}
            
            # Batch up the examples
            batches = minibatch(train_data, size=compounding(4.0, 32.0, 1.001))
            
            for batch in batches:
                examples = []
                for item in batch:
                    doc = nlp.make_doc(item["text"])
                    example = Example.from_dict(doc, {"entities": item["entities"]})
                    examples.append(example)
                
                nlp.update(examples, drop=0.35, losses=losses)
            
            # Print progress every 5 epochs
            if (epoch + 1) % 5 == 0:
                print(f"   📊 Epoch {epoch + 1}/30 - Loss: {losses.get('ner', 0):.4f}")
    
    # Evaluate on validation set
    print("   📊 Evaluating NER model...")
    
    correct = 0
    total = 0
    
    for item in val_data[:100]:  # Sample 100 for quick eval
        doc = nlp(item["text"])
        predicted_entities = set([(ent.start_char, ent.end_char, ent.label_) for ent in doc.ents])
        true_entities = set(item["entities"])
        
        # Calculate F1-like metric
        if len(true_entities) > 0:
            correct += len(predicted_entities.intersection(true_entities))
            total += len(true_entities)
    
    f1 = correct / total if total > 0 else 0
    
    # Save model
    output_dir = "./models/ner_model"
    os.makedirs(output_dir, exist_ok=True)
    nlp.to_disk(output_dir)
    
    print(f"   ✅ NER Model Trained!")
    print(f"   📈 F1 Score: {f1:.4f} ({f1*100:.2f}%)")
    print(f"   💾 Model saved to {output_dir}")
    
    ner_f1 = f1

else:
    if not SPACY_AVAILABLE:
        print("⏭️  Skipping NER training (spaCy not available)")
    else:
        print("⚠️  NER training data not found. Run generate_synthetic_training_data.py first")
    ner_f1 = 0

# ========================================
# SUMMARY
# ========================================

print("\n" + "=" * 70)
print("🎉 Training Complete!")
print("=" * 70)

print("\n📊 Model Performance Summary:")
print("-" * 70)

if category_acc > 0:
    status = "✅ PASS" if category_acc >= 0.85 else "⚠️  BELOW TARGET"
    print(f"Category Classifier:  {category_acc*100:.2f}% {status} (Target: >85%)")
else:
    print("Category Classifier:  ⏭️  Skipped")

if school_acc > 0:
    status = "✅ PASS" if school_acc >= 0.85 else "⚠️  BELOW TARGET"
    print(f"School Classifier:    {school_acc*100:.2f}% {status} (Target: >85%)")
else:
    print("School Classifier:    ⏭️  Skipped")

if ner_f1 > 0:
    status = "✅ PASS" if ner_f1 >= 0.80 else "⚠️  BELOW TARGET"
    print(f"NER Model:            {ner_f1*100:.2f}% F1 {status} (Target: >80%)")
else:
    print("NER Model:            ⏭️  Skipped")

print("\n📁 Trained Models Location:")
print("   - ./models/category_classifier/")
print("   - ./models/school_classifier/")
print("   - ./models/ner_model/")

print("\n📝 Next Steps:")
print("   1. Start the API server: python event_api_server.py")
print("   2. Models will be automatically loaded")
print("   3. Test poster analysis: POST /analyze/poster")
print("   4. Create events from posters: POST /events/from-poster")

print("\n" + "=" * 70)
