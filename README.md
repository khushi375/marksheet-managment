# 🎓 University Examination Management System

A full-stack web application for managing university examination records, students, marks and marksheets through a centralized class-wise portal.

## ✨ Features

- 🔐 Admin Login & Authentication
- 🏫 Class-wise Examination Management
- 👨‍🎓 Add, Edit, Delete & Search Students
- 📤 Bulk Student List Upload
- 📝 Subject-wise Marks Management
- 📊 Automatic Marks, Percentage & Grade Calculation
- ✅ Automatic PASS / FAIL Result
- 📄 Professional Single-Page Marksheet Generation
- 🖨️ Print / Save Marksheet as PDF
- 📈 Class Dashboard with Student Statistics

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- jQuery

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication & Utilities
- JWT
- bcryptjs
- Multer
- XLSX

## 🏗️ Project Structure

```text
university-examination-management-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── classes.html
│   ├── index.html
│   ├── students.html
│   ├── add-student.html
│   ├── add-marks.html
│   ├── upload-students.html
│   └── marksheet.html
│
├── .gitignore
└── README.md
```

🔄 Workflow
```
Admin Login
     ↓
Select / Create Class
     ↓
Class Dashboard
     ↓
Manage Students
     ↓
Upload / Add Students
     ↓
Enter Marks
     ↓
Calculate Results
     ↓
Generate Marksheet
```
⚙️ Installation

Clone the repository:
```
git clone https://github.com/YOUR_USERNAME/university-examination-management-system.git
cd university-examination-management-system
```
Install backend dependencies:
```  
cd backend
npm install
```
Create .env:
```
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
JWT_SECRET=YOUR_SECRET_KEY
```
Run the backend:
```
npm run dev
```
📚 Learning Outcomes

This project demonstrates:

Full-Stack Web Development
REST API Development
MongoDB Database Management
Authentication & Authorization
CRUD Operations
File Upload & Excel Processing
Dynamic UI with jQuery
Automated Result Calculation
Marksheet Generation

👩‍💻 Author

Khushi Jain
B.Tech Computer Science & Engineering

⭐ If you like this project, consider giving it a star!
