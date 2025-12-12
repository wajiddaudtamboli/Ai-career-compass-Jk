# 🧭 AI Career Compass J&K

**AI-Powered Career Guidance Platform for Jammu & Kashmir Students**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wajiddaudtamboli/Ai-career-compass-Jk)

## 🌟 Features

- 🤖 **AI-Powered Career Guidance** - Google Gemini Pro integration
- 📊 **Comprehensive Career Database** - J&K specific opportunities
- 🎓 **College Information System** - Detailed institutional profiles
- 📝 **Interactive Career Quiz** - Personalized recommendations
- 💬 **AI Chatbot Counselor** - Real-time guidance
- 🌐 **Multi-language Support** - English, Hindi, Kashmiri
- 📱 **Progressive Web App** - Offline access
- 🎨 **Modern UI** - Glassmorphism design with dark/light mode

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Chart.js

**Backend:**
- Node.js + Express
- PostgreSQL (with mock mode)
- Google Gemini AI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/wajiddaudtamboli/Ai-career-compass-Jk.git
cd Ai-career-compass-Jk

# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

### Environment Variables

**Frontend (`frontend/.env`):**
```env
VITE_BACKEND_URL=http://localhost:5001
VITE_APP_NAME=AI Career Compass J&K
```

**Backend (`backend/.env`):**
```env
PORT=5001
NODE_ENV=development
MOCK_MODE=true
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wajiddaudtamboli/Ai-career-compass-Jk)

### Manual Deployment

```bash
# Build frontend
cd frontend && npm run build

# The dist folder is ready for deployment
```

## 📁 Project Structure

```
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
├── backend/            # Express.js API server
│   ├── routes/
│   ├── services/
│   └── db/
└── database/           # SQL schemas
```

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/careers` | GET | Get career listings |
| `/api/colleges` | GET | Get college listings |
| `/api/quiz/questions` | GET | Get quiz questions |
| `/api/chat` | POST | AI chatbot |

## 👨‍💻 Author

**Wajid Daud Tamboli**
- Team AIspire Navigators
- N.K. Orchid College of Engineering and Technology, Solapur

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

⭐ Star this repo if you find it helpful!
