# SmartCare+ 🏥

> **Integrated AI Healthcare Ecosystem** — A complete client-side healthcare platform with Firebase authentication, cloud storage, doctor consultations, and virtual meetings.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://creativedragon1.github.io/SmartCare-/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://creativedragon1.github.io/SmartCare-/)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-orange)](https://firebase.google.com/)

---

## 🚀 Quick Start

### Live Demo
Visit **[SmartCare+ Live Demo](https://creativedragon1.github.io/SmartCare-/)** to try it instantly!

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/CreativeDragon1/SmartCare-.git
   cd SmartCare-
   ```

2. Set up Firebase (for full features):
   - Update `firebase-config.js` with your Firebase credentials
   - Enable Authentication and Firestore in Firebase Console

3. Open `index.html` in your browser or serve via GitHub Pages

---

## ✨ Features

### 🔍 **AI Symptom Checker**
- Smart symptom analysis with confidence scoring
- AI-powered condition prediction
- Medication recommendations based on analysis
- Community suggestions for support

### 👨‍⚕️ **Doctor Portal**
- **Patient View:** Browse real doctors from Firestore, book appointments, join virtual meetings
- **Doctor View:** Auto-detect doctor accounts, manage appointments, view patient history, add medical notes
- Slot-based booking system with double-booking prevention
- Status tracking (confirmed/cancelled)

### 📹 **Virtual Consultations**
- In-site video meetings via Jitsi integration
- Doctor-initiated meetings with automatic patient invite
- Deep-link support for easy access
- Same meeting room for doctor and patient
- Full camera/microphone/screen sharing support

### 💊 **Smart Pharmacy**
- Condition-based medication filtering
- Shopping cart with checkout flow
- Price display and quantity management
- Timeline tracking for purchases

### 💬 **Wellness Community**
- 12+ health topic communities
- Post and share experiences
- Member count and activity tracking
- Request new communities

### 📊 **Health Tracker**
- Complete health history timeline
- Profile management with photo upload
- Appointment history
- Community activity log
- Data export capability

### 🔐 **Authentication & Security**
- Firebase Authentication (Email/Password)
- Unified login for patients and doctors
- Auto-detection of doctor accounts
- Secure cloud data storage
- Per-user data isolation


---

## 📁 File Structure

```
SmartCare-/
├── index.html              # Main HTML file
├── styles.css              # All styles with animations
├── app.js                  # Core application logic
├── firebase-config.js      # Firebase configuration
└── README.md               # This file
```

---

## 🔥 Firebase Collections

### **users** (Patient accounts)
```javascript
{
  name: string,
  email: string,
  patientId: string,        // Auto-generated (e.g., PT123456789)
  joinedCommunities: array,
  photoURL: string,
  createdAt: timestamp
}
```

### **doctors** (Doctor accounts)
```javascript
{
  name: string,
  email: string,
  specialty: string,
  license: string,
  createdAt: timestamp
}
```

### **appointments**
```javascript
{
  doctorId: string,
  doctorName: string,
  doctorSpecialty: string,
  patientId: string,
  patientName: string,
  patientEmail: string,
  slot: string,
  date: string,
  status: 'confirmed' | 'cancelled',
  meetingLink: string,      // Set when doctor starts meeting
  meetingId: string,
  meetingStatus: 'active' | 'ended',
  createdAt: timestamp
}
```

### **healthHistory**
```javascript
{
  events: [
    {
      action: string,       // 'symptom-check', 'book-appointment', 'pharmacy', 'doctor-note'
      time: timestamp,
      payload: object       // Varies by action type
    }
  ],
  updatedAt: timestamp
}
```

### **meetings**
```javascript
{
  id: string,
  doctor: string,
  patient: string,
  link: string,
  appointmentId: string,
  status: 'active' | 'ended',
  createdAt: timestamp
}
```

### **communities**
```javascript
{
  id: string,
  members: number,
  posts: [
    {
      user: string,
      text: string,
      time: string,
      timestamp: timestamp
    }
  ]
}
```
**Made with ❤️ for accessible healthcare**
