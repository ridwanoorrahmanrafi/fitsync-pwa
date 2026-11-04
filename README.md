# FitSync PWA ⚡

A modern, responsive Progressive Web Application built on the MERN stack with Google Gemini AI and Firebase services. It dynamically generates personalized workout routines and culturally adapted diet plans based on biometrics, equipment, religious dietary laws, regional food availability, and kitchen pantry inventory. It tracks daily caloric balance and dispatches automated in-app and push alerts with corrective MET-based exercise tasks ("Balance Boost") when caloric surpluses occur.

---

## 🛠 Stack Architecture

- **Frontend:** React 18+ (Vite), Tailwind CSS, Zustand, TanStack Query, Recharts, Lottie-React, Lucide-React, `vite-plugin-pwa`, Firebase Client SDK.
- **Backend:** Node.js (v20 ESM), Express.js, Mongoose ODM, Zod, Node-Cron, Google Gemini API, Firebase Admin.
- **Database:** MongoDB Atlas (Live Document Store with compound indexes).
- **AI Engine:** Google Gemini AI (`gemini-3.5-flash`) for AI nutrition estimation and custom pantry recipe generation.
- **Auth & Cloud Messaging:** Firebase Authentication (Google OAuth) & Firebase Cloud Messaging (FCM).

---

## 📱 Responsive Across All Devices

- **Mobile Viewport (375px–430px):** Ergonomic bottom navigation, single-column touch cards, $\ge 44\text{px}$ touch targets.
- **Tablet / iPad Viewport (768px–1024px):** Dual-column gym studio workout display, 2-column diet and progress charts.
- **Desktop Viewport (1024px–1920px+):** Sticky glassmorphic top navbar, 12-column analytics dashboard, 4-column cultural meal planner, and side-by-side Recharts.

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

Configure `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/fitsync?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key
DEV_AUTH_BYPASS=true
SURPLUS_THRESHOLD=150
CLIENT_URL=http://localhost:5173
```

Seed initial exercises (30+) and culturally diverse foods (40+):
```bash
npm run seed
```

Run unit tests (17/17 passing):
```bash
npm test tests/unit.test.js
```

Start the API server (http://localhost:5000):
```bash
npm run dev
```

---

### 2. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
```

Start the client (http://localhost:5173):
```bash
npm run dev
```

Build production PWA bundle:
```bash
npm run build
```

---

## ⚡ Core Features Implemented

1. **Biometrics & Onboarding Engine:**
   - Captures age, biological sex, height, weight, target weight, goal (`weight_loss`, `maintenance`, `muscle_gain`), fitness level, equipment, days, region, religion, and household pantry.
   - Computes BMI, Mifflin-St Jeor BMR, TDEE, and 30P / 45C / 25F macro splits.
2. **Interactive Workout Generator & Studio Player:**
   - Full Body (1–3 days), Upper/Lower (4 days), Push/Pull/Legs (5–7 days).
   - Zustand state machine (`PREPARE` 10s $\to$ `WORK` $\to$ `REST`), audio beeps at 3, 2, 1s, Screen Wake Lock API, +15s Rest, Pause/Resume, and Next Exercise controls.
3. **Cultural & Pantry Diet Engine with Gemini AI:**
   - 4-meal distribution: Breakfast 25%, Lunch 35%, Snack 15%, Dinner 25%.
   - Filtered strictly by region and religious dietary laws (Halal, Kosher, Vegetarian, Vegan, Jain, Hindu_No_Beef).
   - Prioritizes household pantry inventory matches with one-tap meal swap.
   - 1-tap "AI Estimate" button powered by Google Gemini to analyze custom meals and calculate calories and macros.
4. **Caloric Balance & Automated Burn Task ("Balance Boost"):**
   - Logging food checks caloric surplus (> +150 kcal threshold).
   - Computes corrective duration using user weight and MET formula: $\text{Duration} = \lceil \frac{\Delta\text{kcal} \times 200}{\text{MET} \times 3.5 \times \text{Weight (kg)}} \rceil$.
   - Interactive live Burn Timer modal with countdown audio cues.
5. **Progress & Analytics:**
   - Weight trend line chart, daily calorie adherence chart, hydration tracker, and 35-day streak calendar.
