# 🎮 GPU-Accelerated Model Training Guide

## 🎯 Your Hardware
- **GPU:** NVIDIA GeForce RTX 3050 6GB Laptop GPU
- **CUDA:** 12.6
- **Driver:** 561.00
- **VRAM:** 6 GB

## ⚡ GPU vs CPU Training Speed

| Task | CPU Time | GPU Time | Speedup |
|------|----------|----------|---------|
| Category Classifier | ~20-30 min | ~5-8 min | **4x faster** |
| School Classifier | ~20-30 min | ~5-8 min | **4x faster** |
| **Total** | **40-60 min** | **10-15 min** | **4x faster** |

## 📥 Installation

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
setup_gpu.bat
```

### Option 2: Manual Installation
```bash
# Install PyTorch with CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install Transformers
pip install transformers accelerate

# Verify installation
python -c "import torch; print('CUDA:', torch.cuda.is_available())"
```

**Note:** PyTorch GPU package is ~2.4 GB. Make sure you have:
- ✅ Good internet connection
- ✅ ~5 GB free disk space
- ✅ 10-15 minutes for download & installation

## 🚀 Training with GPU

### Start GPU Training
```bash
# Make sure you're in the project directory
cd campus-memory-main

# Train all models with GPU
python train_models_gpu.py
```

### What the GPU Script Does:
1. ✅ Auto-detects your NVIDIA GPU
2. ✅ Uses mixed precision (FP16) for faster training
3. ✅ Optimized batch sizes for 6GB VRAM
4. ✅ Shows real-time GPU memory usage
5. ✅ Trains both Category and School classifiers
6. ✅ Automatically saves best models

### Expected Output:
```
🚀 GPU-ACCELERATED MODEL TRAINING
✅ PyTorch version: 2.5.1+cu121
✅ CUDA available: 12.6
✅ GPU count: 1
✅ GPU name: NVIDIA GeForce RTX 3050 6GB Laptop GPU
✅ GPU memory: 6.00 GB

🔧 TRAINING CATEGORY CLASSIFIER
   Train samples: 79,996
   Val samples: 19,999
   Classes: 7
   Batch size (train): 32
   Batch size (eval): 64
   Mixed precision (FP16): True

🏋️  Training started...
   Epoch 1/3: [██████████████████] 100%
   Validation accuracy: 0.9234 (92.34%)
   
✅ Training completed!
   Max GPU memory used: 3.24 GB
```

## 🎛️ GPU Training Configuration

### Optimized for RTX 3050 6GB:
- **Batch Size (Training):** 32 (can handle 32 samples at once)
- **Batch Size (Evaluation):** 64 (larger for inference)
- **Mixed Precision (FP16):** Enabled (saves memory, faster)
- **Max Sequence Length:** 128 tokens (balanced)
- **Gradient Accumulation:** 1 (no accumulation needed)
- **Workers:** 4 parallel data loaders

### Memory Usage:
- **Model:** ~1.5 GB
- **Training batch:** ~1-2 GB
- **Total used:** ~3-4 GB out of 6 GB
- **Safe margin:** ~2 GB free

## 📊 Monitoring GPU Usage

### During Training:
The script automatically shows:
- GPU memory allocated
- Peak GPU memory used
- Training progress

### Manual Monitoring:
Open a new terminal and run:
```bash
# Watch GPU usage in real-time
nvidia-smi -l 1
```

You'll see:
- GPU utilization (should be 80-100% during training)
- Memory usage
- Temperature
- Power consumption

## 🔧 Troubleshooting

### Issue: "CUDA out of memory"
**Solution:** Reduce batch size in `train_models_gpu.py`:
```python
per_device_train_batch_size=16,  # Reduce from 32
per_device_eval_batch_size=32,   # Reduce from 64
```

### Issue: GPU not detected
**Solution:** 
1. Update NVIDIA drivers
2. Reinstall PyTorch with CUDA:
```bash
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Issue: Training still slow
**Solution:**
1. Close other GPU applications (games, video editors)
2. Check GPU utilization: `nvidia-smi`
3. Enable FP16 mixed precision (should be enabled by default)

## 🎯 After Training

### Verify Models:
```bash
# Check trained models
dir models\category_classifier
dir models\school_classifier

# You should see:
# - model.safetensors (~255 MB)
# - config.json
# - tokenizer files
# - label_mapping.json
```

### Test Trained Models:
```python
# Test category classifier
python -c "from transformers import pipeline; clf = pipeline('text-classification', model='models/category_classifier'); print(clf('Tech workshop on AI and ML'))"
```

## 💡 Tips for Best Performance

1. **Close background apps** - Free up GPU memory
2. **Keep drivers updated** - Latest NVIDIA drivers
3. **Monitor temperature** - Keep laptop cool
4. **Use power mode** - Set to "High Performance"
5. **Don't interrupt** - Let training complete fully

## 📈 Expected Results

After GPU training completes:

### Category Classifier:
- **Accuracy:** >90%
- **Training time:** ~5-8 minutes
- **Classes:** 7 categories

### School Classifier:
- **Accuracy:** >85%
- **Training time:** ~5-8 minutes
- **Classes:** 12 schools

## 🔄 Re-training

If you want to retrain from scratch:
```bash
# Delete existing models
rmdir /s models\category_classifier
rmdir /s models\school_classifier

# Train again
python train_models_gpu.py
```

## 🆚 Comparison: CPU vs GPU

| Metric | CPU Training | GPU Training |
|--------|-------------|-------------|
| Speed | 1x | **4x** |
| Time | 40-60 min | **10-15 min** |
| Batch Size | 8-16 | **32-64** |
| Memory | RAM (8-16GB) | VRAM (6GB) |
| Precision | FP32 | **FP16 mixed** |
| Efficiency | 100% CPU | **80-100% GPU** |

## 📞 Need Help?

If you encounter issues:
1. Check GPU with: `nvidia-smi`
2. Verify CUDA: `python -c "import torch; print(torch.cuda.is_available())"`
3. Check the error logs in `models/*/logs/`

---

**Ready to train?** Run: `setup_gpu.bat` then `python train_models_gpu.py` 🚀
