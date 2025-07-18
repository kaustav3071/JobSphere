# 🌐 JobSphere - AI-Powered Job Portal

**Live Website:** [https://job-sphere-ai.vercel.app](https://job-sphere-ai.vercel.app)

JobSphere is a modern, full-stack job portal application that connects job seekers with recruiters through an intelligent platform featuring real-time chat, AI-powered resume scoring, and comprehensive job management capabilities.

## ✨ Features

### 🔐 Authentication & Authorization
- **Dual User System**: Separate registration and login for Job Seekers and Recruiters
- **Email Verification**: Secure account verification process
- **Password Recovery**: Forgot password and reset functionality
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control

### 👥 For Job Seekers
- **Profile Management**: Complete profile setup with resume upload
- **Job Search & Filter**: Advanced job search with multiple filters
- **Job Applications**: Easy one-click job applications
- **Resume Scoring**: AI-powered resume analysis and scoring
- **Application Tracking**: Track application status and history
- **Real-time Chat**: Direct communication with recruiters

### 🏢 For Recruiters
- **Company Profile**: Comprehensive recruiter/company profiles
- **Job Posting**: Create and manage job listings
- **Application Management**: Review and manage job applications
- **Candidate Evaluation**: AI-assisted candidate screening
- **Real-time Chat**: Direct communication with candidates
- **Dashboard Analytics**: Track job postings and applications

### 💬 Communication
- **Real-time Chat**: Socket.IO powered instant messaging
- **Chat History**: Persistent chat conversations
- **Online Status**: Real-time user presence indicators
- **Message Notifications**: Instant notification system

### 🤖 AI-Powered Features
- **Resume Scoring**: Intelligent resume analysis using Hugging Face API
- **Job Matching**: Smart job recommendations
- **Skills Assessment**: Automated skill evaluation

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Nodemailer** - Email sending functionality
- **Hugging Face API** - AI/ML model integration

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **File Storage**: Local/Cloud storage

## 📱 Screenshots

### Login
![Login](frontend/public/login.png)

### Register
![Register](frontend/public/register.png)

### Dashboard
![Dashboard](frontend/public/dashboard.png)

### Job Post
![Job Post](frontend/public/job%20post.png)

### Browse Job
![Browse Job](frontend/public/browse_job.png)

### My Application
![My application](frontend/public/my%20application.png)

### Profile
![profile](/frontend/public/profile.png)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/kaustav3071/JobSphere.git
cd jobsphere
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobsphere?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
HUGGINGFACE_API_KEY=your-huggingface-api-key
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📂 Project Structure

```
JobSphere/
├── backend/
│   ├── controllers/         # Request handlers
│   ├── models/             # Database schemas
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middleware
│   ├── uploads/           # File upload directory
│   ├── test/              # Test files
│   ├── app.js             # Express app configuration
│   └── server.js          # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── index.html         # HTML template
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - Register job seeker
- `POST /recruiters/register` - Register recruiter
- `POST /users/login` - Job seeker login
- `POST /recruiters/login` - Recruiter login
- `POST /users/forgot-password` - Forgot password
- `POST /users/reset-password/:token` - Reset password

### Jobs
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job by ID
- `POST /jobs` - Create new job (recruiters only)
- `PUT /jobs/:id` - Update job (recruiters only)
- `DELETE /jobs/:id` - Delete job (recruiters only)

### Applications
- `POST /applications` - Apply for job
- `GET /applications` - Get user applications
- `GET /applications/:id` - Get application by ID

### Chat
- `GET /chats` - Get user chats
- `POST /chats` - Create new chat
- `GET /chats/:id` - Get chat messages
- `POST /chats/:id/message` - Send message

### Resume Scoring
- `GET /resume-scores/:applicationId` - Get resume score
- `POST /resume-scores` - Generate resume score

## 🌟 Key Features Explained

### Real-time Chat System
The application implements a robust real-time chat system using Socket.IO that allows instant communication between job seekers and recruiters. Features include:
- Instant message delivery
- Online presence indicators
- Chat history persistence
- Message status tracking

### AI-Powered Resume Scoring
Utilizing Hugging Face's machine learning models, the platform provides intelligent resume analysis:
- Skill extraction and matching
- Experience level assessment
- Resume quality scoring
- Improvement suggestions

### Advanced Job Search
Sophisticated job search functionality with:
- Multiple filter options (location, salary, type, etc.)
- Real-time search results
- Saved searches
- Job recommendations

## 🔒 Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication system
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Properly configured cross-origin requests
- **Rate Limiting**: API rate limiting to prevent abuse
- **File Upload Security**: Secure file upload with type validation

## 📊 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized image delivery
- **Caching**: Strategic caching implementation
- **Bundle Splitting**: Optimized JavaScript bundles
- **CDN Integration**: Fast content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kaustav Das**
- Website: [https://kaustav-das.vercel.app/](https://kaustav-das.vercel.app/)
- GitHub: [@kaustav3071](https://github.com/kaustav3071)
- LinkedIn: [kaustavdas1703](https://www.linkedin.com/in/kaustavdas1703/)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for AI/ML capabilities
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Vercel](https://vercel.com/) for frontend deployment
- [Render](https://render.com/) for backend deployment
- All the amazing open-source libraries used in this project

## 📞 Support

If you have any questions or need support, please:
1. Check the [Issues](https://github.com/kaustav3071/jobsphere/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact me directly through the website

---

⭐ **Star this repo if you found it helpful!**

Made with ❤️ and lots of ☕

