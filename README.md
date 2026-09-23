# OperatorOS — Intelligent Heavy Machinery In-Cab Dashboard

**OperatorOS** is an intelligent, high-contrast cab dashboard designed for Caterpillar (CAT) heavy machinery operators (excavators and wheel loaders). Designed for tablet and in-cab rugged displays, it synthesizes live assumed machine telemetry and task logs to provide real-time situational awareness, predictive task duration estimation, proactive safety alerts, anomaly scoring, predictive maintenance, and an in-cab AI co-pilot.

---

## Key Features

1. **High-Contrast Industrial Cab UI**
   - Caterpillar signature colorway (`#FFCD11` CAT Yellow on dark charcoal/black).
   - Touch targets designed for rugged, gloved operation (minimum 48px height).
   - High visibility status indicators for all critical functions (Green = Safe, Amber = Warning, Red = Danger).

2. **Daily Task Dashboard (Weather-Aware)**
   - Priority task queue sorted dynamically based on current site weather conditions (e.g. holding slope grading during high mud / wet conditions).
   - Real-time status toggles (`In Progress`, `Pending`, `Completed`).
   - Planned nominal duration vs. ML predicted duration.

3. **Safety Module & 360° Proximity Radar**
   - Live seatbelt interlock status with instant interactive cab simulation.
   - 360° animated radar sweep with LiDAR/ultrasonic obstacle detection (Personnel, Light Vehicles, Drop-off hazards, Overhead lines).
   - Interactive "Simulate Proximity Breach" trigger that fires audible and visual alarms.
   - Auto-updating telematics safety incident log.

4. **Anomaly Detection & Operator Scorecard**
   - Rule-based detection of excessive idling (>22% benchmark) and seatbelt compliance breaches.
   - Safety letter grade (`A+`, `A`, `B`, `C`, `D`) and overall score out of 100.
   - Recharts 5-day historical trend chart of safety score versus idling ratio.
   - Immediate dollar and fuel waste impact calculations.

5. **Machine Learning Task Time Estimation (Scikit-Learn)**
   - Regression model trained on hundreds of realistic task records.
   - Considers task type, weather conditions, operator skill, and machine age.
   - Transparent factor explainer attributing delays and accelerations.

6. **In-Cab Natural Language AI Co-Pilot**
   - Deterministic keyword and intent matching engine connected directly to live Pandas operational data.
   - Answers operator questions: *"How much have I idled today?"*, *"What is my safety score?"*, *"When is next maintenance?"*, *"What are my high risk tasks?"*.
   - Includes quick-prompt chips and simulated cab radio voice trigger.

7. **Predictive Maintenance Nudge**
   - Countdown to next 500-hour comprehensive service based on cumulative engine hours and fuel consumption rate.
   - Diagnostic health meters for engine oil life, hydraulic filter delta pressure, air restriction, and track shoe wear.

8. **End-of-Shift Automated Recap**
   - Auto-generated shift ticket: active vs. idle hours, fuel consumed, eco-mode savings, tasks executed, and SHA-256 telematic signature.
   - Printable shift ticket and digital sign-off.

9. **Gamified Operator Leaderboard**
   - Site-wide operator ranking based on composite safety and eco-efficiency score.
   - Podium ranking with CAT badge achievements (*"Site Veteran"*, *"Master Operator"*, *"Apprentice"*).

10. **Offline Fallback Architecture**
    - Seamless fallback to `mockData.ts` in case of backend interruption, ensuring zero demo failure during live presentations.

---

## Project Structure

```
hack_cat/
├── backend/
│   ├── main.py                     # FastAPI backend application
│   ├── requirements.txt            # Python dependencies
│   ├── data/
│   │   ├── telemetry_log.csv       # 600+ synthetic telemetry records across 10 days
│   │   ├── task_log.csv            # 500 synthetic task records for ML
│   │   └── training_modules.json   # Curated CAT curriculum & skill badges
│   ├── scripts/
│   │   └── generate_data.py        # Reproducible dataset seed generator
│   └── ml/
│       ├── __init__.py
│       └── estimator.py            # Scikit-learn regression model & explainer
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.tsx                 # Main dashboard view
│   │   ├── api.ts                  # API client with polling & offline fallback
│   │   ├── mockData.ts             # Offline demo data snapshot
│   │   ├── types.ts                # TypeScript domain models
│   │   └── components/
│   │       ├── CabHeader.tsx
│   │       ├── MaintenanceBanner.tsx
│   │       ├── TaskDashboard.tsx
│   │       ├── SafetyRadarModule.tsx
│   │       ├── AnomalyScorecard.tsx
│   │       ├── TaskEstimator.tsx
│   │       ├── AiAssistantPanel.tsx
│   │       ├── TrainingHub.tsx
│   │       ├── Leaderboard.tsx
│   │       └── ShiftRecapModal.tsx
└── README.md
```

---

## Quick Start / Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ (tested on Node v24)
- npm 10+

### 1. Backend Setup & Run

Open a terminal in the project root:

```bash
cd backend
python -m pip install -r requirements.txt

# (Optional) Regenerate synthetic datasets:
python scripts/generate_data.py

# Start the FastAPI server:
python main.py
```
The backend will start at **`http://localhost:8000`**. You can verify interactive Swagger API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup & Run

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start at **`http://localhost:5173`**.

---

## Interactive Demo Flow for Judges

1. **Machine & Operator Switching**:
   - In the top header, switch the operator from **Dave Miller** (Intermediate, prone to high idling) to **Marcus Vance** (Novice, seatbelt infractions) or **Elena Rostova** (Expert, Top Leaderboard).
   - Observe the scorecards, trends, and task predictions immediately update.

2. **Weather-Aware Task Scheduling**:
   - Change site weather from **Muddy/Wet** to **Sunny** or **High Wind** using the header dropdown.
   - Notice the Task Queue re-order and recalculate risk warnings (e.g. slope grading held in mud).

3. **Live Seatbelt & Proximity Safety Simulation**:
   - Click **"Simulate Unbuckling"** in the Safety Module: the indicator turns red, an alarm sounds, an incident is auto-appended to the log, and the safety score updates.
   - Click **"Simulate Proximity Breach Alert"**: observe the 360° radar blip flash red and a high-priority incident get recorded.

4. **Interactive ML Duration Estimator**:
   - In the Task Estimator panel, adjust the sliders for task type, weather, skill level, and equipment age.
   - Notice the real-time Scikit-Learn prediction and transparent factor attribution cards explaining the exact minutes added by weather or hydraulic wear.

5. **In-Cab AI Co-Pilot**:
   - In the AI Co-Pilot panel, click any of the suggestion chips or type:
     - *"How much have I idled today?"*
     - *"What is my safety score?"*
     - *"When is next maintenance?"*
     - *"What are my high risk tasks?"*
   - Or click the radio microphone icon to simulate in-cab voice input.

6. **Training Hub & Skill Badges**:
   - Click **"Training Hub"** in the header.
   - Check off skill modules (e.g., *Pre-Shift Walkaround*, *Trench Safety Pro*) to unlock badges and watch your operator certification progress update.

7. **End-of-Shift Sign-Off**:
   - Click **"Shift Recap"** in the header.
   - Review the auto-generated shift performance recap, eco fuel savings, and click **"Sign-Off & Submit Shift"** to cryptographically lock the shift record.
