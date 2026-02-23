# 🚀 GPU Training Setup Guide

## What You Need to Install for GPU Training (Instead of CPU)

### Quick Answer:
To train ML models on **GPU instead of CPU**, you need:
1. **NVIDIA GPU Drivers**
2. **PyTorch with CUDA** (GPU-enabled version)
3. **ML Training Libraries**

---

## 🎯 Quick Setup (Easiest Way)

### Option 1: Automated Setup
```bash
cd campus-memory-main
python setup_gpu_training.py
```

This script will:
- ✅ Check if you have NVIDIA GPU
- ✅ Auto-install PyTorch with CUDA
- ✅ Install all ML training packages
- ✅ Verify GPU is working

### Option 2: Batch Script (Windows)
```bash
setup_gpu.bat
```

### Option 3: Manual Installation (see below)

---

## 📋 Detailed Manual Setup

### Step 1: Check Your GPU

**Windows:**
```bash
nvidia-smi
```

**Expected Output:**
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 537.13       Driver Version: 537.13       CUDA Version: 12.6     |
|-------------------------------+----------------------+----------------------+
| GPU  Name            TCC/WDDM | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ... WDDM  | 00000000:01:00.0  On |                  N/A |
```

If you don't see this:
- ❌ No NVIDIA GPU detected
- Install drivers from: https://www.nvidia.com/download/index.aspx

---

### Step 2: Install PyTorch with CUDA

**Current Problem:**  
You likely have CPU-only PyTorch:
```bash
pip install torch  # ❌ This installs CPU version
```

**Solution - Install GPU Version:**

#### For CUDA 12.1 (Recommended):
```bash
pip uninstall torch torchvision torchaudio  # Remove CPU version
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### For CUDA 11.8 (if CUDA 12.1 doesn't work):
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**Download Size:** ~2.4 GB  
**Time:** 5-10 minutes

---

### Step 3: Install ML Training Libraries

```bash
pip install transformers
pip install datasets
pip install accelerate
pip install scikit-learn
```

---

### Step 4: Verify GPU Setup

```bash
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU Name: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"N/A\"}')"
```

**Expected Output:**
```
CUDA Available: True
GPU Name: NVIDIA GeForce RTX 3050
```

If you see `False`:
- ❌ GPU-enabled PyTorch not installed correctly
- Reinstall using Step 2

---

## 🎮 Your GPU Specs

Based on your system:
- **GPU:** NVIDIA GeForce RTX 3050
- **Memory:** 6GB VRAM
- **CUDA:** 12.6
- **Recommended:** CUDA 12.1 PyTorch

---

## 📦 Complete Installation Commands

### For Your System (CUDA 12.1):

```bash
# 1. Remove CPU-only PyTorch (if installed)
pip uninstall torch torchvision torchaudio -y

# 2. Install GPU-enabled PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# 3. Install ML libraries
pip install transformers datasets accelerate scikit-learn

# 4. Verify
python -c "import torch; print('✅ GPU Ready!' if torch.cuda.is_available() else '❌ GPU Not Available')"
```

---

## 🚀 Run GPU Training

### Once Setup is Complete:

#### Option 1: GPU-Optimized Training Script
```bash
cd campus-memory-main
python train_models_gpu.py
```

#### Option 2: Fast Training (Auto-detects GPU)
```bash
python train_all_models_fast.py
```

#### Option 3: Poster Model Training
```bash
python train_ai_models.py
```

---

## 📊 Performance Comparison

| Operation | CPU | GPU (RTX 3050) | Speedup |
|-----------|-----|----------------|---------|
| Model Training | 30-45 min | 3-5 min | **10x faster** |
| Inference | 2-3 sec | 0.2-0.3 sec | **10x faster** |
| Batch Processing | 10 min | 1 min | **10x faster** |

---

## 🔍 Troubleshooting

### Issue 1: "CUDA not available" after installation

**Cause:** CPU version of PyTorch installed  
**Fix:**
```bash
pip uninstall torch torchvision torchaudio -y
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Issue 2: "nvidia-smi not found"

**Cause:** NVIDIA drivers not installed  
**Fix:** Download and install from https://www.nvidia.com/download/index.aspx

### Issue 3: CUDA version mismatch

**Cause:** Wrong PyTorch CUDA version  
**Fix:** Check your CUDA version with `nvidia-smi` and install matching PyTorch:
- CUDA 12.x → `cu121`
- CUDA 11.x → `cu118`

### Issue 4: Out of memory error

**Cause:** Model too large for 6GB GPU  
**Fix:** Reduce batch size in training script:
```python
per_device_train_batch_size=4  # Reduce from 8 to 4
```

---

## 🎯 What Gets Installed

### PyTorch with CUDA (~2.4 GB)
- `torch` - PyTorch core with CUDA support
- `torchvision` - Vision models and utilities
- `torchaudio` - Audio processing

### ML Training Libraries (~500 MB)
- `transformers` - Hugging Face transformers (BERT, etc.)
- `datasets` - Dataset loading utilities
- `accelerate` - Multi-GPU training support
- `scikit-learn` - ML utilities

### Total Download: ~3 GB
### Total Installation Time: 10-15 minutes

---

## ✅ Verification Checklist

Before training, verify:

```bash
# 1. Check GPU detection
nvidia-smi

# 2. Check Python can see GPU
python -c "import torch; print(torch.cuda.is_available())"
# Should print: True

# 3. Check GPU details
python -c "import torch; print(torch.cuda.get_device_name(0))"
# Should print: NVIDIA GeForce RTX 3050

# 4. Check CUDA version
python -c "import torch; print(torch.version.cuda)"
# Should print: 12.1 (or your CUDA version)
```

All should pass before training!

---

## 🎓 Training Examples

### Basic GPU Training:
```bash
python train_models_gpu.py
```

### Output You'll See:
```
🚀 GPU-ACCELERATED MODEL TRAINING
================================================================================
✅ PyTorch version: 2.5.0+cu121
✅ CUDA available: 12.1
✅ GPU count: 1
✅ GPU name: NVIDIA GeForce RTX 3050
✅ GPU memory: 6.00 GB

Training Category Classifier...
  Model: distilbert-base-uncased
  Device: cuda
  Training samples: 200
  
Epoch 1/3: 100%|████████| 25/25 [00:15<00:00,  1.64it/s]
Training Loss: 0.4521
...
```

---

## 🔑 Key Points

1. **Must have NVIDIA GPU** - AMD or Intel won't work
2. **Install CUDA-enabled PyTorch** - Not regular PyTorch
3. **Check with nvidia-smi** - Before everything
4. **Verify with torch.cuda.is_available()** - After install
5. **Training is 10x faster** - Worth the setup!

---

## 📞 Need Help?

### Run diagnostics:
```bash
python setup_gpu_training.py
```

### Check what's wrong:
```bash
python -c "import torch; print('PyTorch:', torch.__version__); print('CUDA available:', torch.cuda.is_available()); print('CUDA version:', torch.version.cuda if torch.cuda.is_available() else 'N/A')"
```

### Common Issues:
- ❌ `torch.cuda.is_available() = False` → Reinstall GPU PyTorch
- ❌ `nvidia-smi fails` → Install GPU drivers
- ❌ `Out of memory` → Reduce batch size

---

## 🎉 After Setup

Once GPU is working, your AI model training will be:
- ✅ **10x faster**
- ✅ Auto-uses GPU in training scripts
- ✅ Better for larger models
- ✅ More efficient batch processing

**Start training:**
```bash
python train_models_gpu.py
```

And watch it train on GPU! 🚀

---

**Quick Command Summary:**
```bash
# Install GPU PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify
python -c "import torch; print(torch.cuda.is_available())"

# Train
python train_models_gpu.py
```
