# 🚀 WELLIBUY AI - OPTIMIZED

**Ultra-lightweight, production-ready e-commerce platform with AI integration**

## ✨ Features

### Core Features
- 🔍 **Smart Search** - AI-powered product search
- 🤖 **AI Assistant** - Natural language shopping assistant
- 💻 **PC Builder** - Intelligent PC configuration recommendations
- 🛒 **Product Catalog** - Fast product browsing and filtering
- 👤 **User Authentication** - Secure JWT-based auth
- 📱 **Responsive Design** - Mobile-first approach

### Security Features (8 Core)
1. **JWT Authentication** - Secure token-based auth
2. **bcrypt Hashing** - Password encryption (10 rounds)
3. **Helmet.js** - Security headers
4. **Rate Limiting** - Brute force protection
5. **CORS Protection** - Cross-origin security
6. **Input Validation** - Data sanitization
7. **NoSQL Injection Prevention** - MongoDB sanitization
8. **XSS Protection** - Cross-site scripting prevention

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **TailwindCSS** - Utility-first CSS
- **Lucide Icons** - Beautiful icons

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **OpenAI API** - AI integration

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.x
MongoDB >= 6.x
NPM >= 9.x
```

### Installation

1. **Clone and install dependencies**
```bash
cd Wellibuy-AI-Optimized
npm install
```

2. **Configure environment variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your values
MONGODB_URI=mongodb://localhost:27017/wellibuy
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001
```

3. **Seed database (optional)**
```bash
npm run seed
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3001
- Backend: http://localhost:5001
- Health Check: http://localhost:5001/api/health

## 📁 Project Structure

```
Wellibuy-AI-Optimized/
├── app/                      # Next.js pages
│   ├── page.tsx             # Homepage
│   ├── auth/                # Authentication pages
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── profile/            # User profile
│   ├── search/             # Search results
│   ├── products/[id]/      # Product detail
│   ├── categories/[name]/  # Category page
│   ├── pc-builder/         # PC Builder tool
│   └── ai-assistant/       # AI chat
├── components/              # React components
│   ├── home/               # Homepage components
│   ├── layout/             # Layout components
│   └── search/             # Search components
├── lib/                     # Utilities
│   ├── api.ts              # API helpers
│   └── ai-service.ts       # AI services
├── server/                  # Backend
│   ├── index.js            # Main server
│   └── routes/             # API routes
│       ├── products.js     # Product endpoints
│       ├── ai.js           # AI endpoints
│       ├── categories.js   # Category endpoints
│       ├── auth.js         # Auth endpoints
│       └── users.js        # User endpoints
├── types/                   # TypeScript types
├── public/                  # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔐 Security

This optimized version includes essential security features:

### Authentication
- JWT token-based authentication
- bcrypt password hashing (10 rounds)
- Secure cookie handling
- Token expiration (24h default)

### Network Security
- Helmet.js for security headers
- CORS with whitelist
- Rate limiting (100 req/15min general, 5 req/15min auth)
- Request size limits (10MB)

### Data Protection
- Input validation and sanitization
- NoSQL injection prevention
- XSS protection
- MongoDB sanitization

### Error Handling
- Graceful error handling
- No sensitive data in error responses
- Detailed logging (development only)
- Uncaught exception handling

## 📚 API Endpoints

### Authentication
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - User login
POST /api/auth/logout     - User logout
```

### Users
```
GET  /api/users/profile   - Get user profile
PUT  /api/users/profile   - Update profile
PUT  /api/users/password  - Change password
```

### Products
```
GET  /api/products        - List all products
GET  /api/products/:id    - Get single product
GET  /api/products/search - Search products
```

### Categories
```
GET  /api/categories             - List categories
GET  /api/categories/:name       - Get category products
```

### AI
```
POST /api/ai/recommendations     - Get AI recommendations
POST /api/ai/pc-builder         - Build PC configuration
POST /api/ai/chat               - Chat with AI assistant
POST /api/ai/smart-search       - Smart search query
```

### Health
```
GET  /api/health                - Server health check
```

## 🎯 Performance

### Optimizations
- Tree-shaking and code splitting
- Lazy loading components
- Image optimization
- API response caching
- Minimal dependencies

### Metrics
- **Build time:** ~30 seconds
- **Bundle size:** ~1.8 MB (minified)
- **API response:** <150ms average
- **Page load:** <2 seconds

## 🛠️ Scripts

```bash
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm run start      # Start production server
npm run server     # Start backend server
npm run seed       # Seed database with sample data
npm run lint       # Run ESLint
```

## 🌍 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/wellibuy

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Server
NODE_ENV=development
PORT=5001

# Frontend
FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow functional programming principles
- Write clean, self-documenting code
- Keep components small and focused

### Security Best Practices
- Never commit sensitive data (.env files)
- Always validate user input
- Use parameterized queries
- Keep dependencies updated
- Follow OWASP guidelines

### Performance Tips
- Use React Server Components when possible
- Implement pagination for large datasets
- Cache API responses
- Optimize images
- Minimize bundle size

## 🚢 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (min 32 chars)
3. Enable MongoDB authentication
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Use process manager (PM2)

### Recommended Hosting
- **Frontend:** Vercel, Netlify
- **Backend:** Railway, Render, DigitalOcean
- **Database:** MongoDB Atlas

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Response
```json
{
  "success": true,
  "message": "Wellibuy API is running",
  "timestamp": "2025-12-30T...",
  "database": "connected",
  "uptime": 3600
}
```

## 🤝 Contributing

This is an optimized production version. For feature additions:
1. Test thoroughly
2. Maintain security standards
3. Keep code clean and documented
4. Update this README

## 📄 License

Private - All Rights Reserved

## 💡 Tips

### Database
- Use indexes for better performance
- Regular backups
- Monitor query performance

### Security
- Regular security audits
- Keep dependencies updated
- Use environment variables
- Never expose API keys

### Performance
- Enable compression
- Use CDN for static assets
- Implement caching strategies
- Monitor server metrics

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [OpenAI API](https://platform.openai.com/docs)

---

**Built with ❤️ by Wellibuy Team**

**Version:** 2.0.0 Optimized  
**Status:** 🟢 Production Ready  
**Last Updated:** December 30, 2025
