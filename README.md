# MediQR 🏥⚡
**Reducing Medical Errors through Instant Health Data Access.**

MediQR is a digital health solution designed to assist emergency respondents by providing instant access to a patient's 
identity and medical history. By scanning a unique QR code, doctors can take immediate action during the "Golden Hour," 
eliminating time wasted searching for records and reducing life-threatening medical errors.

---

## 🚑 The Problem
In medical emergencies, every second counts. 
* **The Communication Gap:** Patients are often unconscious, unable to explain their history.
* **The Information Delay:** Searching for paper IDs or hospital files takes precious time.
* **Risk of Errors:** Administering medication without knowing allergies can be fatal.

## ✅ The Solution
**MediQR** provides a "Medical Identity" that speaks for the patient. 
* **Instant Scan:** A unique QR code (for wristbands, stickers, or ID cards).
* **Critical Data First:** Immediate display of blood type, allergies, and chronic conditions.
* **Flexible Records:** Powered by a NoSQL backend to store varied medical documents.

---

## 🛠️ Tech Stack
* **Frontend:** [e.g., React.js / HTML5 & CSS3]
* **Backend:** Node.js & Express
* **Database:** **MongoDB** (NoSQL)
* **Authentication:** [Currently in Development]

## 🛡️ Security Roadmap (Priority List)
The current version is a functional running model. To reach production standards, we are implementing:
1. **Data Encryption:** Using MongoDB's Field Level Encryption for sensitive PII (Personally Identifiable Information).
2. **JWT Authentication:** Secure login for patients to edit their profiles.
3. **Emergency "Break-Glass" Protocol:** A secure way for verified medical professionals to bypass privacy locks during a crisis.
4. **Environment Security:** Moving all database URI strings to `.env` files to prevent credential leaks.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB Compass

### Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Mitsuha-24/Mediqr.git](https://github.com/Mitsuha-24/Mediqr.git)
   cd Mediqr
