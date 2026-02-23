# 🎨 Hero Section Effects - Usage Guide

All hero section effects have been successfully added to your NEXiFY project! Here's how to use them.

---

## ✅ **What's Already Installed**

### **In `globals.css`:**
- ✅ Keyframes: `fade-in`, `gradient-shift`, `float`
- ✅ Gradient backgrounds: `.gradient-hero`, `.gradient-accent`
- ✅ Shadow effects: `.shadow-primary`, `.shadow-glow`
- ✅ Transitions: `.transition-smooth`, `.transition-bounce`
- ✅ Animation classes: `.animate-fade-in`, `.animate-gradient-shift`, `.animate-float`

### **In `page.tsx` (Hero Section):**
- ✅ Animated gradient background overlay
- ✅ Floating data sphere with `.animate-float`
- ✅ Fade-in animations on text elements
- ✅ Shadow-glow effects on buttons and cards
- ✅ Bounce animation on scroll indicator
- ✅ Gradient hero background

---

## 🚀 **Quick Copy-Paste Components**

### **1. Shining Moving Circle (Glowing Orb Effect)**

```jsx
<div className="relative w-full h-full animate-float">
  {/* Glowing circle that shines and moves */}
  <div className="absolute inset-0 gradient-accent blur-3xl opacity-20 rounded-full" />
  
  {/* Your content */}
  <div className="relative z-10">
    <img src="/your-image.png" alt="Content" className="w-full rounded-2xl shadow-primary" />
  </div>
</div>
```

### **2. Animated Gradient Background (Wave Effect)**

```jsx
<section className="relative min-h-screen gradient-hero">
  {/* Animated shifting gradient overlay */}
  <div className="absolute inset-0 opacity-30">
    <div 
      className="absolute inset-0 bg-[size:200%_200%] animate-gradient-shift" 
      style={{ background: 'linear-gradient(45deg, transparent, rgba(0, 217, 255, 0.2), transparent)' }}
    />
  </div>
  
  {/* Your content */}
  <div className="relative z-10">
    <h1>Your Content</h1>
  </div>
</section>
```

### **3. Bounce Scroll Indicator**

```jsx
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
  <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
    <div className="w-1.5 h-3 bg-white/60 rounded-full" />
  </div>
</div>
```

### **4. Fade-In Text Animation**

```jsx
<div className="space-y-8 animate-fade-in">
  <h1 className="text-5xl font-bold">
    Your Heading
  </h1>
  <p className="text-xl">
    Your description text
  </p>
</div>
```

### **5. Gradient Text Effect**

```jsx
<span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
  Highlighted Text
</span>

{/* OR using NEXiFY colors */}
<span className="bg-gradient-to-r from-[#8B5CF6] via-[#14F1D9] to-[#FFB800] bg-clip-text text-transparent">
  NEXiFY Text
</span>
```

### **6. Button with Hover Effects**

```jsx
<button className="px-6 py-3 rounded-lg gradient-accent text-white font-semibold shadow-glow hover:shadow-primary hover:scale-105 transition-bounce">
  Click Me
</button>
```

### **7. Card with Glow Effect**

```jsx
<div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-primary hover:shadow-glow transition-bounce">
  {/* Card content */}
  <h3 className="text-2xl font-bold text-white">Card Title</h3>
  <p className="text-white/70">Card description</p>
</div>
```

### **8. Floating Icon/Badge**

```jsx
<div className="animate-float">
  <div className="w-20 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#14F1D9] rounded-2xl flex items-center justify-center shadow-glow">
    <YourIcon className="w-10 h-10 text-white" />
  </div>
</div>
```

---

## 🎨 **NEXiFY Color Palette**

Use these colors for consistency:

```jsx
// Electric Violet
className="text-[#8B5CF6]"

// Cyber Teal
className="text-[#14F1D9]"

// Neon Amber
className="text-[#FFB800]"

// Deep Space (backgrounds)
className="bg-[#0A0F1E]"
className="bg-[#151E2F]"
```

---

## 🎬 **Complete Effect Combinations**

### **Hero Section Pattern**

```jsx
<section className="relative min-h-screen gradient-hero overflow-hidden">
  {/* Animated gradient overlay */}
  <div className="absolute inset-0 opacity-30">
    <div 
      className="absolute inset-0 bg-[size:200%_200%] animate-gradient-shift" 
      style={{ background: 'linear-gradient(45deg, transparent, rgba(0, 217, 255, 0.2), transparent)' }}
    />
  </div>
  
  <div className="container mx-auto px-6 py-20 relative z-10">
    {/* Content with fade-in */}
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-6xl font-bold text-white">
        Amazing{" "}
        <span className="bg-gradient-to-r from-[#8B5CF6] via-[#14F1D9] to-[#FFB800] bg-clip-text text-transparent">
          NEXiFY
        </span>
      </h1>
      
      <button className="px-8 py-3 rounded-lg gradient-accent text-white font-semibold shadow-glow hover:shadow-primary hover:scale-105 transition-bounce">
        Get Started →
      </button>
    </div>
    
    {/* Floating element */}
    <div className="absolute top-20 right-20 animate-float">
      <div className="w-48 h-48 bg-gradient-to-br from-[#8B5CF6]/20 to-[#14F1D9]/20 backdrop-blur-xl rounded-3xl shadow-glow" />
    </div>
  </div>
  
  {/* Scroll indicator */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
      <div className="w-1.5 h-3 bg-white/60 rounded-full" />
    </div>
  </div>
</section>
```

---

## ⚡ **Customization Tips**

### **Change Animation Speed:**

```css
/* In globals.css, modify the animation duration: */

.animate-float {
  animation: float 5s ease-in-out infinite;  /* Slower float */
}

.animate-gradient-shift {
  animation: gradient-shift 12s ease infinite;  /* Slower shift */
}
```

### **Change Colors:**

```css
/* In globals.css, modify the gradient colors: */

.gradient-hero {
  background: linear-gradient(135deg, #your-color-1, #your-color-2, #your-color-3);
}

.gradient-accent {
  background: linear-gradient(120deg, #your-accent-1, #your-accent-2);
}
```

### **Adjust Blur Intensity:**

```jsx
{/* blur-3xl = heavy, blur-2xl = medium, blur-xl = light */}
<div className="blur-2xl opacity-30" />
```

### **Adjust Shadow Glow:**

```css
/* In globals.css, modify shadow intensity: */

.shadow-glow {
  box-shadow: 0 0 50px hsl(190 100% 50% / 0.4);  /* Stronger glow */
}
```

---

## ✨ **Where These Effects Are Already Applied**

In your NEXiFY landing page (`page.tsx`):

1. **Hero Section Background**: `.gradient-hero` with animated overlay
2. **Logo Badge**: `.shadow-glow` effect
3. **Subtitle Text**: `.animate-fade-in` animation
4. **CTA Buttons**: `.shadow-glow`, `.hover:shadow-primary`, `.transition-bounce`
5. **Floating Data Sphere**: `.animate-float` with `.shadow-glow`
6. **Scroll Indicator**: `.animate-bounce`
7. **Main Headline Divider**: `.shadow-glow`
8. **Trust Badge**: `.transition-smooth` hover effect
9. **Live Stats Widget**: `.shadow-glow`, `.hover:shadow-primary`, `.transition-smooth`
10. **NEXiFY Effect Cards**: `.shadow-primary`, `.hover:shadow-glow`, `.transition-bounce`
11. **Card Icons**: `.transition-bounce` with `.shadow-glow`

---

## 🎯 **Best Practices**

1. **Use `.animate-fade-in`** for text content that should appear smoothly
2. **Use `.animate-float`** for floating elements like badges, icons, or cards
3. **Use `.shadow-glow`** for primary interactive elements (buttons, cards)
4. **Use `.transition-bounce`** for hover effects that should feel playful
5. **Use `.gradient-hero`** for section backgrounds
6. **Use `.gradient-accent`** for buttons and highlights

---

## 🚀 **Quick Start Examples**

### **Add a Floating Feature Card:**

```jsx
<div className="animate-float">
  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-glow">
    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#14F1D9] rounded-xl mb-4 shadow-glow" />
    <h3 className="text-xl font-bold text-white">Feature Title</h3>
    <p className="text-white/70">Feature description</p>
  </div>
</div>
```

### **Add an Animated Section:**

```jsx
<section className="relative py-20 gradient-hero">
  <div className="absolute inset-0 opacity-30">
    <div 
      className="absolute inset-0 bg-[size:200%_200%] animate-gradient-shift" 
      style={{ background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.2), transparent)' }}
    />
  </div>
  
  <div className="relative z-10 container mx-auto animate-fade-in">
    {/* Your content here */}
  </div>
</section>
```

---

**That's it! All effects are ready to use. Just copy and paste the components you need! ✨**

*Built with NEXiFY - Where Intelligence Meets Interaction*
