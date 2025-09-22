# 🧭 AI Career Compass J&K - Intelligent Career Guidance Platform
**Team AIspire Navigators**

A comprehensive full-stack AI-powered career guidance platform specifically designed for students in Jammu & Kashmir, featuring Google Gemini AI integration, real-time career insights, and personalized learning pathways.

## 🎓 Institution

**N.K. Orchid College of Engineering and Technology, Solapur**

## 🌟 Key Features

### 🤖 **AI-Powered Career Guidance**
- **Google Gemini Pro API** integration for intelligent career recommendations
- **Adaptive Quiz System** with personalized career path suggestions
- **AI Chatbot Counselor** for real-time career guidance and mentorship
- **Dynamic Content Generation** based on student responses and regional context

### 📊 **Comprehensive Data Management**
- **Real-time Career Database** with J&K specific opportunities
- **College Information System** with detailed institutional profiles
- **Industry Trends Analysis** and job market insights
- **Mock Interview Platform** with AI feedback and scoring

### 🎨 **Modern User Experience**
- **Responsive Design** optimized for all devices and screen sizes
- **Glassmorphism UI** with modern aesthetic and smooth animations
- **Dark/Light Theme** toggle for personalized user experience
- **Progressive Web App (PWA)** capabilities for offline access

### 🌍 **Localization & Accessibility**
- **Multi-language Support** (English, Hindi, Kashmiri)
- **Regional Content** tailored for Jammu & Kashmir students
- **Accessibility Features** for inclusive user experience
- **Cultural Context Integration** in career recommendations

### 📱 **Interactive Components**
- **Dynamic Dashboard** with personalized career roadmaps
- **Career Exploration Tools** with detailed role analysis
- **Skill Assessment Modules** with gap analysis and improvement plans
- **Achievement System** with gamification elements

## 🛠️ Technology Stack

### **Frontend Architecture**
```javascript
Framework: React 18 with Vite
Styling: Tailwind CSS + PostCSS
UI Library: Headless UI + Hero Icons
Animations: Framer Motion
Charts: Chart.js + React Chart.js 2
State Management: React Context + Hooks
Routing: React Router DOM v6
Forms: React Hook Form + Yup validation
Notifications: React Hot Toast
```

### **Backend Infrastructure**
```javascript
Runtime: Node.js with Express.js
API Architecture: RESTful with enhanced middleware
Database: PostgreSQL with pg library
Authentication: JWT + bcrypt (Clerk integration)
AI Integration: Google Gemini Pro API
File Handling: Multer for uploads
Security: CORS, Helmet, Rate limiting
Environment: dotenv configuration
```

### **AI & Analytics**
```javascript
AI Engine: Google Gemini Pro (gemini-pro model)
Features: Adaptive questioning, career matching
Analytics: Custom tracking and user behavior analysis
Caching: In-memory caching for API optimization
Fallback: Mock data system for offline functionality
```

### **Development & Deployment**
```javascript
Build Tool: Vite with hot module replacement
Package Manager: npm with workspaces
Version Control: Git with conventional commits
Primary Deployment: Railway (Full-stack hosting platform)
Alternative Deployment: Vercel (Frontend) / Netlify (Frontend)
Database: PostgreSQL (Railway managed database)
```

## 🚀 Quick Start Guide

### **Prerequisites**
- Node.js 18+ and npm
- Google Gemini API key
- PostgreSQL database (optional - has mock mode)
- Git for version control

### **Installation Steps**

1. **Clone Repository**
   ```bash
   git clone https://github.com/wajiddaudtamboli/Ai-career-compass-Jk.git
   cd Ai-career-compass-Jk
   ```

2. **Automated Setup (Recommended)**
   ```bash
   # Windows
   setup-enhanced.bat
   
   # Linux/macOS
   chmod +x setup-enhanced.sh
   ./setup-enhanced.sh
   ```

3. **Manual Setup**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   **Backend (.env)**
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Database (Optional - uses mock mode if not provided)
   DATABASE_URL=postgresql://username:password@host/database
   MOCK_MODE=false
   
   # AI Integration
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Authentication (Optional)
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Contact Information
   CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
   CONTACT_PHONE=9667033839
   CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur
   ```

   **Frontend (.env)**
   ```env
   # API Configuration
   VITE_BACKEND_URL=http://localhost:5001
   
   # Contact Information
   VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
   VITE_CONTACT_PHONE=9667033839
   VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur
   
   # App Configuration
   VITE_APP_NAME=AI Career Compass J&K
   VITE_APP_VERSION=2.0.0
   ```

5. **Database Setup (Optional)**
   ```bash
   # Automated database setup
   cd backend
   npm run setup-db
   
   # Manual database setup
   psql $DATABASE_URL -f ../database/schema.sql
   psql $DATABASE_URL -f ../database/sample_data.sql
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend (Port 5001)
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend (Port 3008)
   cd frontend
   npm run dev
   ```

7. **Access Application**
   - **Frontend**: http://localhost:3008
   - **Backend API**: http://localhost:5001
   - **API Health**: http://localhost:5001/api/health

## 🔑 API Key Setup

### **Google Gemini API Configuration**

1. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Create new API key
   - Copy the generated key

2. **Security Best Practices**
   - Never commit API keys to version control
   - Use environment variables for all keys
   - Rotate keys regularly
   - Set up usage quotas and monitoring

3. **Fallback Mode**
   - Application functions without API key using mock data
   - Graceful degradation ensures full functionality
   - Perfect for development and testing

## 📊 API Endpoints

### **Core Endpoints**
```
GET  /api/health              - Server health check and status
GET  /api/contact             - Contact information display
GET  /api/careers             - Career opportunities with filtering
GET  /api/colleges            - College information with search
POST /api/contact/submit      - Submit contact form
```

### **Assessment & AI**
```
GET  /api/quiz/questions      - Adaptive career assessment questions
POST /api/quiz/submit         - Submit quiz and get career recommendations
POST /api/chat                - AI chatbot career counseling
GET  /api/roadmap/:career     - Personalized career roadmap
```

### **Authentication & User Management**
```
POST /auth/register           - User registration
POST /auth/login              - User authentication
GET  /auth/me                 - Get user profile
PUT  /auth/profile            - Update user profile
```

### **Analytics & Insights**
```
GET  /api/analytics/trends    - Career market trends
GET  /api/analytics/skills    - In-demand skills analysis
GET  /api/insights/industry   - Industry-specific insights
```

## 🎯 Core Features Deep Dive

### **1. Adaptive Career Assessment**
- **Dynamic Questioning**: AI generates personalized questions based on previous answers
- **Multi-dimensional Analysis**: Evaluates interests, skills, personality, and goals
- **Regional Context**: Considers J&K specific opportunities and challenges
- **Instant Results**: Real-time career matching with detailed explanations

### **2. AI-Powered Career Counseling**
- **24/7 Availability**: Always-on AI counselor for student guidance
- **Context-Aware Responses**: Understands student background and preferences
- **Personalized Recommendations**: Tailored advice based on individual profiles
- **Follow-up Support**: Continuous guidance throughout career journey

### **3. Comprehensive Career Database**
- **Local Opportunities**: J&K specific career paths and opportunities
- **Industry Insights**: Detailed information about various career fields
- **Salary Trends**: Regional salary data and growth projections
- **Success Stories**: Local success stories and case studies

### **4. Educational Institution Mapping**
- **College Profiles**: Detailed information about educational institutions
- **Course Alignment**: Mapping courses to career outcomes
- **Admission Guidance**: Requirements and application processes
- **Alumni Networks**: Connect with successful alumni

### **5. Skill Development Platform**
- **Gap Analysis**: Identify skills needed for target careers
- **Learning Pathways**: Curated learning resources and courses
- **Progress Tracking**: Monitor skill development over time
- **Certification Support**: Guidance on relevant certifications

## 🌟 Advanced Features

### **Real-time Analytics Dashboard**
- User engagement metrics and behavior analysis
- Career trend tracking and market insights
- Success rate monitoring and optimization
- Regional employment data visualization

### **Personalized Learning Paths**
- AI-generated study plans and resource recommendations
- Adaptive content delivery based on learning style
- Progress tracking with milestone achievements
- Integration with external learning platforms

### **Industry Connection Hub**
- Direct connections with industry professionals
- Mentorship matching and networking opportunities
- Job placement assistance and interview preparation
- Industry-specific workshops and webinars

### **Government Scheme Integration**
- Automatic matching with relevant government schemes
- Application assistance and document preparation
- Status tracking and update notifications
- Policy change alerts and opportunities

## 📱 Deployment Options

### **🚀 Railway Deployment (Primary & Recommended)**
Railway provides the most seamless full-stack deployment experience for this project.

```bash
# Quick Railway Deployment
# 1. Fork/Clone repository: https://github.com/wajiddaudtamboli/Ai-career-compass-Jk.git
# 2. Connect GitHub repository to Railway (railway.app)
# 3. Add PostgreSQL database service in Railway dashboard
# 4. Configure environment variables (CRITICAL - see RAILWAY_ENV_SETUP.md)
# 5. Deploy automatically - Railway handles build and deployment

# IMPORTANT: Set these environment variables in Railway:
# NODE_ENV=production
# PORT=8080
# GEMINI_API_KEY=your_gemini_api_key
# JWT_SECRET=your_secure_jwt_secret

# Railway Features:
# ✅ Automatic builds on git push
# ✅ Managed PostgreSQL database
# ✅ Environment variable management
# ✅ Custom domain support
# ✅ Zero-downtime deployments
# ✅ Integrated monitoring and logs

# See RAILWAY_DEPLOYMENT.md for detailed step-by-step guide
# See RAILWAY_ENV_SETUP.md for environment variables setup
```

### **Alternative Deployment Options**

#### **Vercel Deployment (Frontend Only)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### **Other Backend Hosting (Alternative to Railway)**
```bash
# For Render
# Connect GitHub repo to Render dashboard
# Configure build and start commands

# For Heroku (Legacy)
# heroku create your-app-name
# git push heroku main
```

### **Database Hosting Options**

#### **Railway PostgreSQL (Recommended)**
```bash
# Automatically provisioned with Railway deployment
# Managed backups and scaling
# Built-in connection pooling
# No additional configuration required
```

#### **Alternative Database Providers**
```bash
# Neon (Serverless PostgreSQL)
# Create database at https://neon.tech
# Copy connection string to DATABASE_URL

# Supabase (Open source Firebase alternative)
# Create project at https://supabase.com
# Use provided PostgreSQL connection string

# AWS RDS / Google Cloud SQL (Enterprise)
# For high-traffic production deployments
```

## 🔮 Roadmap & Future Enhancements

### **Phase 1: Foundation** ✅
- ✅ Core platform development
- ✅ AI integration and testing
- ✅ Basic user interface
- ✅ Essential API endpoints

### **Phase 2: Enhancement** 🚧
- 🚧 Advanced analytics and reporting
- 🚧 Mobile application development
- 🚧 Enhanced AI capabilities
- 🚧 Industry partnership integration

### **Phase 3: Scale** 📋
- 📋 Multi-region expansion
- 📋 Advanced personalization
- 📋 Enterprise features
- 📋 Government integration

### **Phase 4: Innovation** 🔄
- 🔄 VR/AR career exploration
- 🔄 Blockchain certification
- 🔄 Advanced AI mentoring
- 🔄 Global career opportunities

## 🛡️ Security & Privacy

### **Data Protection**
- End-to-end encryption for sensitive data
- GDPR compliant data handling
- Secure API authentication
- Regular security audits

### **Privacy Features**
- Anonymous usage analytics
- Opt-in data collection
- User data export/deletion
- Transparent privacy policy

## 👥 Meet Our Team - AIspire Navigators

### **Team Members**

| Avatar | Name | Role | Specialization |
|--------|------|------|----------------|
| 👨‍💼 | **Wajid Tamboli** | Team Leader | Full-Stack Development & AI Integration |
| 👩‍💻 | **Pooja Mallelor** | Team Member | Frontend Development & UI/UX Design |
| 👩‍🎨 | **Sneha Khairate** | Team Member | UI/UX Design & User Experience |
| 👩‍🔬 | **Vijayalaxmi Kamble** | Team Member | Data Analysis & Research |
| 👩‍💼 | **Sanjana Waghmare** | Team Member | Project Management & Testing |
| 👩‍🎓 | **Priyanka Dhule** | Team Member | Content Strategy & Documentation |
| 👨‍🏫 | **Prof. V. D. Gaikwad** | Mentor | Technical Guidance & Project Supervision |

### **Team Contributions**

- **Wajid Tamboli (Team Leader)**: Architecture design, backend development, AI integration, deployment setup
- **Pooja Mallelor**: React components, responsive design, frontend optimization
- **Sneha Khairate**: UI/UX design, user interface components, design system
- **Vijayalaxmi Kamble**: Career data analysis, database design, research methodologies
- **Sanjana Waghmare**: Quality assurance, project coordination, testing strategies
- **Priyanka Dhule**: Content creation, documentation, user guides
- **Prof. V. D. Gaikwad**: Technical mentorship, project guidance, academic supervision

### **Team Philosophy**
> *"Empowering students through collaborative innovation and AI-driven career guidance solutions."*

## 🤝 Contributing

### **Development Setup**
```bash
# Fork the repository
git clone https://github.com/your-fork/jk-career-navigator.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run test

# Submit pull request
```

### **Contribution Guidelines**
- Follow conventional commit standards
- Write comprehensive tests
- Update documentation
- Ensure accessibility compliance

## 👥 Team & Authors

### **Team AIspire Navigators**
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wajiddaudtamboli/Ai-career-compass-Jk)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

### **👨‍💼 Team Leader**
**Wajid Tamboli**
- Full-Stack Developer & AI Integration Specialist
- Project Architect & Technical Lead
- GitHub: [@wajiddaudtamboli](https://github.com/wajiddaudtamboli)
- LinkedIn: [Wajid Daud Tamboli](https://linkedin.com/in/wajiddaudtamboli)

### **👩‍💻 Development Team**
| Team Member | Role | Specialization |
|-------------|------|----------------|
| **Pooja Mallelor** | Frontend Developer | React.js, UI Components |
| **Sneha Khairate** | UI/UX Designer | User Experience, Design Systems |
| **Vijayalaxmi Kamble** | Data Analyst | Career Data, Research |
| **Sanjana Waghmare** | QA Engineer | Testing, Project Management |
| **Priyanka Dhule** | Content Strategist | Documentation, User Guides |

### **👨‍🏫 Academic Supervision**
**Prof. V. D. Gaikwad**
- Project Mentor & Technical Supervisor
- N.K. Orchid College of Engineering and Technology

### **🏫 Institution**
**N.K. Orchid College of Engineering and Technology, Solapur**

### **📞 Contact Information**
- **📧 Project Email**: [wajiddaudtamboli123@gmail.com](mailto:wajiddaudtamboli123@gmail.com)
- **� Phone**: [+91 9667033839](tel:+919667033839)
- **🏫 Institution**: N.K. Orchid College of Engineering and Technology, Solapur
- **🌐 Repository**: [github.com/wajiddaudtamboli/Ai-career-compass-Jk](https://github.com/wajiddaudtamboli/Ai-career-compass-Jk)
- **🚀 Live Demo**: Railway Deployment (Coming Soon)

## 💡 Project Philosophy

> *"Empowering every student in Jammu & Kashmir with intelligent career guidance, breaking geographical barriers, and creating opportunities through the power of artificial intelligence."*

### **Core Values**
- **Accessibility**: Making career guidance available to all students
- **Innovation**: Leveraging cutting-edge AI for personalized experiences
- **Inclusivity**: Supporting diverse backgrounds and learning styles
- **Impact**: Creating measurable positive change in career outcomes

### **Mission Statement**
To democratize career guidance in Jammu & Kashmir by providing AI-powered, personalized, and culturally relevant career counseling that helps students make informed decisions about their future.

## 🎖️ Achievements & Recognition

- 🏆 **Innovative Solution**: AI-powered career guidance for regional context
- 🌟 **Technical Excellence**: Modern full-stack architecture with best practices
- 🎯 **User-Centric Design**: Intuitive interface with accessibility focus
- 🚀 **Scalable Platform**: Ready for regional and national expansion

## 📈 Impact Metrics

| Metric | Target | Current Status |
|--------|--------|----------------|
| **Student Registrations** | 10,000+ | Growing 📈 |
| **Career Assessments** | 5,000+ | Active 🎯 |
| **Success Stories** | 100+ | Collecting 📝 |
| **Institution Partnerships** | 50+ | Expanding 🤝 |

## 🙏 Acknowledgments

Special thanks to:
- **N.K. Orchid College of Engineering and Technology** for institutional support
- **Google AI** for providing Gemini API access
- **Open Source Community** for tools and libraries
- **Student Beta Testers** for valuable feedback and insights

---

<div align="center">

### 🌟 **Built with ❤️ for the students of Jammu & Kashmir** 🌟

**"Transforming Career Guidance Through AI Innovation"**

*Developed by **Team AIspire Navigators** at N.K. Orchid College of Engineering and Technology, Solapur*

**Team Leader**: [Wajid Daud Tamboli](https://github.com/wajiddaudtamboli) | **Mentor**: Prof. V. D. Gaikwad

[![GitHub Stars](https://img.shields.io/github/stars/wajiddaudtamboli/Ai-career-compass-Jk?style=social)](https://github.com/wajiddaudtamboli/Ai-career-compass-Jk)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/wajiddaudtamboli)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue.svg)](https://ai.google.dev/)
[![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E.svg)](https://railway.app)

</div> 
