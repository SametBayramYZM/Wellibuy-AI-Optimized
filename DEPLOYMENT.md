# 🎯 DEPLOYMENT GUIDE

## Quick Deploy Checklist

### 1. Environment Setup
```bash
# Copy and configure environment variables
cp .env.example .env

# Edit .env with production values
nano .env
```

### 2. Security Configuration

**CRITICAL: Change these before deployment**
- ✅ JWT_SECRET - Use minimum 32 character random string
- ✅ MONGODB_URI - Use MongoDB Atlas or secure instance
- ✅ OPENAI_API_KEY - Add your OpenAI API key
- ✅ NODE_ENV - Set to `production`
- ✅ FRONTEND_URL - Set to your production domain

### 3. Database Setup
```bash
# Install MongoDB or use MongoDB Atlas
# Connection string example:
# mongodb+srv://username:password@cluster.mongodb.net/wellibuy

# Seed database with initial data
npm run seed
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Build Application
```bash
npm run build
```

### 6. Start Production Server
```bash
# Start backend
npm run server

# Start frontend (in separate terminal)
npm start
```

## Production Recommendations

### Hosting Providers

**Frontend (Next.js)**
- Vercel (Recommended) - Zero config deployment
- Netlify - Easy deployment
- AWS Amplify - Enterprise solution

**Backend (Express.js)**
- Railway - Simple deployment
- Render - Free tier available
- DigitalOcean App Platform - Scalable
- AWS EC2 - Full control

**Database**
- MongoDB Atlas - Managed MongoDB
- AWS DocumentDB - Compatible with MongoDB
- DigitalOcean Managed MongoDB

### Process Manager

Use PM2 for production:
```bash
npm install -g pm2

# Start backend with PM2
pm2 start server/index.js --name wellibuy-api

# Start with auto-restart
pm2 startup
pm2 save
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

### SSL Certificate

```bash
# Using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

### Health Check
```bash
curl https://yourdomain.com/api/health
```

### PM2 Monitoring
```bash
pm2 logs
pm2 monit
pm2 status
```

## Backup Strategy

### Database Backup
```bash
# Daily backup script
mongodump --uri="$MONGODB_URI" --out=/backup/$(date +%Y%m%d)
```

### Automated Backups
- Set up MongoDB Atlas automated backups
- Configure retention policy
- Test restore procedures

## Security Checklist

- ✅ Strong JWT_SECRET (min 32 characters)
- ✅ MongoDB authentication enabled
- ✅ HTTPS/SSL certificate installed
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Firewall rules configured
- ✅ Regular security updates
- ✅ Environment variables secured
- ✅ No sensitive data in logs
- ✅ Regular backups scheduled

## Performance Optimization

### CDN Setup
- Use Cloudflare or similar CDN
- Cache static assets
- Enable compression

### Database Optimization
- Create indexes for frequently queried fields
- Use MongoDB Atlas auto-scaling
- Monitor slow queries

### Application
- Enable Node.js clustering
- Use Redis for caching (optional)
- Optimize images
- Minimize bundle size

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port
lsof -ti:5001 | xargs kill -9
```

**MongoDB Connection Failed**
- Check connection string
- Verify network access
- Check firewall rules

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Review health endpoint
3. Check MongoDB connection
4. Verify environment variables

---

**Ready for Production!** 🚀
