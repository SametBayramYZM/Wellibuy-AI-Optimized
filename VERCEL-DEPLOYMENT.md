# Vercel Deployment Guide - Wellibuy AI

## 🚀 Vercel'e Backend Bağlama Kılavuzu

Bu kılavuz, Wellibuy AI projesinin backend kısmını Vercel'e nasıl deploy edeceğinizi adım adım açıklar.

---

## 📋 Ön Koşullar

- ✅ Vercel hesabı ([vercel.com](https://vercel.com))
- ✅ GitHub deposu (public veya private)
- ✅ MongoDB Atlas hesabı (cloud database)
- ✅ OpenAI API anahtarı

---

## 1️⃣ GitHub'a Push Edin

```bash
git add .
git commit -m "Vercel deployment configuration"
git push origin main
```

---

## 2️⃣ Vercel Dashboard'da Proje Oluşturun

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. **"Add New Project"** butonuna tıklayın
3. GitHub repository'nizi seçin
4. **Framework Preset**: Next.js olarak seçili kalmalı
5. **Deploy** butonuna tıklayın

---

## 3️⃣ Environment Variables Ayarlayın

Vercel Dashboard'da şu adımları izleyin:

1. Projeyi seçin
2. **Settings** → **Environment Variables** bölümüne gidin
3. Aşağıdaki değişkenleri ekleyin:

### Gerekli Environment Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellibuy
JWT_SECRET=your-secure-random-string-minimum-32-characters
OPENAI_API_KEY=sk-...your-openai-key
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
PORT=3001
```

### MongoDB Atlas Bağlantısı:

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) açın
2. **Database** → **Connect** butonuna tıklayın
3. **Connect your application** seçeneğini tıklayın
4. Connection string'i kopyalayın:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/wellibuy
   ```
5. `username` ve `password` yerine gerçek değerleri yazın

---

## 4️⃣ Backend Deployment (Opsiyonel)

Eğer backend'i ayrı olarak Vercel'e deploy etmek istiyorsanız:

### Seçenek A: Aynı Vercel Projesinde (API Routes)

✅ Zaten yapılandırılmıştır! 
- `app/api/route.ts` dosyası backend requests'lerini proxy eder
- No additional setup needed

### Seçenek B: Ayrı Vercel Projesinde

Backend'i ayrı bir Vercel projesine deploy etmek için:

1. `server/` klasörü için yeni bir `vercel-api.json` oluşturun:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/index.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "OPENAI_API_KEY": "@openai_api_key"
  }
}
```

2. Backend projesini Vercel'e deploy edin
3. Generated URL'i not edin (örn: `https://api-wellibuy.vercel.app`)
4. Frontend'in `BACKEND_URL` env var'ını bu URL'e ayarlayın

---

## 5️⃣ Production Optimizations

### A. CORS Ayarları

`server/index.js` dosyasında CORS'u güncelleyin:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
```

### B. Rate Limiting

Rate limiters zaten yapılandırılmıştır:
- General API: 100 requests / 15 minutes
- Auth endpoints: 5 requests / 15 minutes
- Search/AI: 30 requests / minute

### C. Security Headers

`next.config.js` dosyasında security headers zaten ayarlanmıştır:
- X-Frame-Options
- X-Content-Type-Options
- X-DNS-Prefetch-Control

---

## 6️⃣ Monitoring & Logs

### Vercel Dashboard'da Logs Görüntüleyin

1. **Deployments** sekmesine gidin
2. Son deployment'ı seçin
3. **Logs** sekmesine tıklayın
4. Hatalar ve warning'leri kontrol edin

### MongoDB Atlas Monitoring

1. MongoDB Atlas Dashboard'da
2. **Monitoring** → **Server Status** seçeneğine gidin
3. Connection metrics'leri kontrol edin

---

## 7️⃣ Common Issues & Solutions

### ❌ 502 Bad Gateway Hatası

**Çözüm:**
- Environment variables'ları kontrol edin
- MongoDB connection string'ini doğrulayın
- Backend URL'inin doğru olduğunu kontrol edin

```bash
# Backend URL formatı şöyle olmalı:
https://your-domain.com (trailing slash yok)
```

### ❌ CORS Hatası

**Çözüm:**
- `FRONTEND_URL` environment variable'ını kontrol edin
- Frontend URL ve Backend CORS origin'inin eşleştiğinden emin olun

### ❌ Database Connection Timeout

**Çözüm:**
- MongoDB Atlas IP whitelist'ine Vercel IP'lerini ekleyin:
  1. MongoDB Atlas → Security → Network Access
  2. **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
  
  ⚠️ Production'da belirli IP'leri whitelist etmeyi dikkate alın

### ❌ API Requests Fail

**Çözüm:**
- `app/api/route.ts` proxy'sinin çalışıp çalışmadığını kontrol edin
- Browser console'da network tab'ı kontrol edin
- Vercel logs'da hataları arayın

---

## 8️⃣ Performance Tips

1. **Image Optimization**: Next.js Image component kullanın
2. **Code Splitting**: Dynamic imports kullanın
3. **Caching**: Appropriate cache headers ayarlayın
4. **Database Indexing**: MongoDB'de frequent queries için index'ler oluşturun

---

## 9️⃣ Rollback Procedure

Eğer yeni deployment'ta sorun yaşarsanız:

1. Vercel Dashboard → **Deployments**
2. Önceki başarılı deployment'ı bulun
3. **Redeploy** butonuna tıklayın

---

## 🔟 Continuous Deployment

Vercel otomatik olarak GitHub'a her push'ta deploy eder.

### CI/CD Pipeline

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

Her pull request için otomatik preview URL'si oluşturulur.

---

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/learn/basics/deploying-nextjs-app)
- [MongoDB Atlas Connection](https://docs.atlas.mongodb.com/troubleshoot-connection/)

---

## ✅ Deployment Checklist

- [ ] GitHub'a push ettim
- [ ] Vercel'de project oluşturdum
- [ ] MongoDB Atlas bağlantı string'i aldım
- [ ] Environment variables'ları Vercel'e ekledim
- [ ] OpenAI API anahtarını ekledim
- [ ] CORS settings'i doğruladım
- [ ] Production build'i lokal'de test ettim
- [ ] Logs'ları kontrol ettim
- [ ] API endpoints'ini test ettim
- [ ] Database connectivity'yi doğruladım

---

**Last Updated:** December 31, 2025  
**Version:** 2.0.0-optimized
