# SnapStudy

**Transform your study materials into interactive flashcards**

---

## Overview
SnapStudy is a full-stack web application that revolutionizes the way students create study materials. Simply upload a PDF document, and our AI-powered system automatically extracts key concepts and generates interactive flashcards to enhance your learning experience.

---

## ✨ Features

### 🤖 **AI-Powered Content Extraction**
- Upload PDF documents and let Google's Gemini AI analyze the content
- Automatically extract key terms, concepts, and definitions
- Generate contextually relevant practice questions and answers

### 📋 **Interactive Flashcard System**
- Smooth flip animations with responsive design
- Progress tracking with visual indicators
- Mark cards as "known" or "unknown" for personalized learning
- Retake mode for focusing on challenging concepts

### 💾 **Persistent Storage**
- Save flashcard decks to local storage for future study sessions
- Archive system to organize multiple study sets
- Session-based storage for immediate study after upload

### 📧 **Email Integration**
- Share flashcard sets via email using SendGrid integration
- Send study links to classmates or save for later access
- Professional email templates with branded messaging

### 🎨 **Modern User Interface**
- Clean, responsive design built with Bootstrap
- Intuitive navigation with React Router
- Loading states and error handling for better UX
- Mobile-friendly interface for studying on-the-go

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MatDawit/hackUMBC2025.git
   cd hackUMBC2025
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend_app
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   # Add your API keys and configuration
   ```

 5. **Run the application**
   ```bash
   # Start backend (from backend directory)
   python server.py
   
   # Start frontend (from frontend_app directory)
   npm run dev
   ```

   
