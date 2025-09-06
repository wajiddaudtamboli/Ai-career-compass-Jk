# J&K Career Navigator - Database Setup & Automation

## 🚀 Quick Start

### Automated Setup (Recommended)
```bash
# Windows
setup-database.bat

# Linux/Mac
chmod +x setup-database.sh
./setup-database.sh
```

### Manual Setup

1. **Environment Configuration**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   npm run setup-db
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## 📊 Database Management Commands

### Setup & Health
```bash
npm run setup-db          # Complete database setup
npm run check-db           # Health check
npm run test-connection    # Test database connection
```

### Data Management
```bash
npm run db-stats           # Show table statistics
npm run db-backup          # Create backup
npm run db-reset           # Reset database (WARNING: deletes data)
npm run maintenance        # Run maintenance tasks
```

### Advanced Commands
```bash
node db/database-manager.js setup    # Full setup
node db/database-manager.js stats    # Statistics
node db/database-manager.js backup   # Create backup
node db/database-manager.js reset    # Reset database
```

## 🗄️ Database Schema

### Core Tables
- **user_profiles** - User information synced with Clerk
- **careers** - Career opportunities in J&K
- **colleges** - Educational institutions
- **quiz_questions** - Adaptive assessment questions
- **quiz_results** - User quiz responses and recommendations
- **testimonials** - User success stories
- **articles** - Career guidance articles
- **contact_messages** - User inquiries
- **analytics** - Usage tracking

### Features
- ✅ Full-text search capabilities
- ✅ Optimized indexes for performance
- ✅ Automated backup system
- ✅ Health monitoring
- ✅ Migration support
- ✅ Mock data fallback

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# API Keys
GEMINI_API_KEY=your_gemini_key
CLERK_SECRET_KEY=your_clerk_key

# Server
PORT=5002
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX_REQUESTS=100
```

### Database URL Format
```
postgresql://username:password@host:port/database?sslmode=require
```

## 📈 Monitoring & Health

### Health Check Endpoints
```bash
GET /health                # Server health
GET /api/health           # Database + API health
```

### Database Statistics
```bash
npm run db-stats
```

### Logs
- Server logs: `logs/server.log`
- Database logs: `logs/database.log`
- Error logs: `logs/error.log`

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check DATABASE_URL format
   # Verify Neon database is active
   # Test connection manually
   npm run test-connection
   ```

2. **Missing Tables**
   ```bash
   # Recreate schema
   npm run db-reset
   npm run setup-db
   ```

3. **Performance Issues**
   ```bash
   # Check table statistics
   npm run db-stats
   
   # Run maintenance
   npm run maintenance
   ```

4. **Port Already in Use**
   ```bash
   # Change PORT in .env file
   PORT=5003
   ```

### Environment Issues

1. **Missing .env File**
   ```bash
   cp .env.example .env
   # Edit with your values
   ```

2. **Invalid API Keys**
   - Verify Gemini API key at Google AI Studio
   - Check Clerk keys in Clerk dashboard
   - Ensure DATABASE_URL is from Neon console

### Database Issues

1. **Schema Mismatch**
   ```bash
   # Reset and recreate
   npm run db-reset
   ```

2. **Connection Timeout**
   - Check internet connection
   - Verify Neon database status
   - Check firewall settings

## 🔄 Backup & Recovery

### Automatic Backups
- Created during setup
- Stored in `database/backups/`
- Includes all data and schema

### Manual Backup
```bash
npm run db-backup
```

### Restore from Backup
```bash
# Reset database first
npm run db-reset

# Then run setup to restore structure
npm run setup-db
```

## 📊 Analytics & Insights

### Usage Tracking
- API endpoint usage
- Quiz completions
- Career searches
- College inquiries

### Performance Metrics
- Response times
- Database query performance
- Error rates
- User engagement

## 🚦 API Endpoints

### Core Data
```
GET /api/careers          # Career opportunities
GET /api/colleges         # Educational institutions
GET /api/testimonials     # Success stories
```

### Interactive Features
```
GET /api/quiz/questions   # Assessment questions
POST /api/quiz/submit     # Submit responses
POST /api/contact         # Contact form
POST /api/chat           # AI counselor
```

### System
```
GET /health              # Server health
GET /api/health          # Full system health
```

## 🔐 Security Features

- Rate limiting (100 requests/15 minutes)
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention
- Error message sanitization

## 🎯 Performance Optimizations

- Database indexes for fast queries
- Full-text search capabilities
- Response compression
- Request caching
- Connection pooling
- Query optimization

## 📱 Mobile & Frontend Integration

### CORS Configuration
Supports multiple frontend ports:
- localhost:3000-3006
- localhost:5173-5174

### API Response Format
```json
{
  "status": "success",
  "data": [...],
  "count": 10,
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test database changes
4. Submit pull request

## 📞 Support

- Documentation: Check this README
- Issues: GitHub Issues
- Email: support@jk-career-navigator.com

---

## 🎉 Success!

After completing setup, you should have:
- ✅ Database connected and populated
- ✅ API server running on http://localhost:5002
- ✅ Health checks passing
- ✅ All endpoints functional
- ✅ Backup system ready
- ✅ Monitoring active

Your J&K Career Navigator backend is now ready to help students find their perfect career path! 🚀
