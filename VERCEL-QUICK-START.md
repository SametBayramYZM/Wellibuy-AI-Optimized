<!-- VERCEL DEPLOYMENT QUICK START GUIDE -->

# Vercel Deployment - Hızlı Başlangıç

## ✅ Yapılan Değişiklikler

Projeniz Vercel'e deploy etmeye hazır! Aşağıdaki dosyalar otomatik olarak konfigüre edilmiştir:

### 📁 Yeni Dosyalar
- ✅ **vercel.json** - Vercel deployment konfigürasyonu
- ✅ **VERCEL-DEPLOYMENT.md** - Detaylı deployment rehberi
- ✅ **.env.production** - Production environment variables örneği
- ✅ **app/api/route.ts** - Backend proxy API route'u
- ✅ **vercel-setup.js** - Deployment hazırlık kontrol script'i

### 📝 Güncellenen Dosyalar
- ✅ **next.config.js** - Vercel optimizasyonları eklendi
- ✅ **.env.example** - Vercel env variables eklendi

---

## 🚀 5 Adımda Deploy Edin

### 1. GitHub'a Push Edin
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Hazırlık Kontrolü Yapın
```bash
node vercel-setup.js
```

### 3. Vercel'e Bağlanın
- [vercel.com](https://vercel.com) açın
- GitHub repo'nuzu import edin
- Vercel otomatik olarak detecte edecek (Next.js project)

### 4. Environment Variables Ayarlayın

**Vercel Dashboard** → **Settings** → **Environment Variables** bölümüne gidin ve ekleyin:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellibuy
JWT_SECRET=your-secure-random-string
OPENAI_API_KEY=sk-xxxxx
BACKEND_URL=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 5. Deploy Edin
- **Deploy** butonuna tıklayın
- ~3-5 dakika bekleyin
- Vercel size URL'i verecek (örn: `https://yourapp.vercel.app`)

---

## 🔗 Gerekli Hesaplar & Setup

### MongoDB Atlas Setup (Database)
1. [Atlas.mongodb.com](https://www.mongodb.com/cloud/atlas) açın
2. Free tier cluster oluşturun
3. Connection string kopyalayın → `MONGODB_URI` olarak Vercel'e ekleyin
4. **Network Access**: `0.0.0.0/0` whitelist'e ekleyin (Vercel IP'ler için)

### OpenAI API Key
1. [openai.com/api](https://openai.com/api) açın
2. API key oluşturun
3. `OPENAI_API_KEY` olarak Vercel'e ekleyin

### JWT Secret Oluşturun
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Çıktıyı `JWT_SECRET` olarak Vercel'e ekleyin

---

## 📊 Architecture

```
Frontend (Next.js)
    ↓
app/api/route.ts (Proxy)
    ↓
Backend (Express.js)
    ↓
MongoDB
```

- **Frontend**: Vercel'de host
- **Backend API**: Aynı Vercel domaininde
- **Database**: MongoDB Atlas (cloud)

---

## ✨ Özellikler

- ✅ **Automatic Deployments**: Git push → Vercel otomatik deploy
- ✅ **Preview URLs**: PR'lar için otomatik preview
- ✅ **Performance**: SWC minify, image optimization
- ✅ **Security**: CORS, rate limiting, helmet.js headers
- ✅ **Monitoring**: Vercel dashboard'da logs ve metrics

---

## 🔍 Test Et

Deploy edildi mi kontrol etmek için:

```bash
# API health check
curl https://your-app-name.vercel.app/api/health

# Product endpoint
curl https://your-app-name.vercel.app/api/products

# Recommendations endpoint  
curl https://your-app-name.vercel.app/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"budget": 2000}'
```

---

## 📚 Detaylı Rehber

Daha fazla bilgi için: **VERCEL-DEPLOYMENT.md** dosyasına bakın

Önemli konular:
- Environment variables detayı
- Troubleshooting
- Database configuration
- Monitoring & logs
- Performance optimization

---

## 💡 Tips

1. **Lokal Test Et**: Deploy etmeden önce `npm run build && npm run start` çalıştırın
2. **Secrets Güvenliği**: `.env` dosyaları GitHub'a push'lanmasın (.gitignore'da var)
3. **Database Backup**: Production'da regular backups yapın
4. **Analytics**: Vercel dashboard'da performance metrics'leri izleyin
5. **CDN**: Vercel otomatik olarak global CDN kullanır

---

## ❓ Sorun Mu Yaşıyorsunuz?

### CORS Hatası
→ `FRONTEND_URL` ve `BACKEND_URL`'i kontrol edin

### 502 Bad Gateway
→ MongoDB connection string'ini ve API endpoint'leri doğrulayın

### Slow Performance
→ Vercel analytics'te bottleneck'i bulun

Daha fazla help: Detaylı rehberin **Troubleshooting** bölümüne bakın

---

## 🎯 Next Steps

- [ ] MongoDB Atlas setup
- [ ] OpenAI API key alın
- [ ] Vercel hesabı oluşturun
- [ ] GitHub repo connect
- [ ] Environment variables set
- [ ] Deploy!
- [ ] Test et
- [ ] Custom domain ekle (opsiyonel)

---

**Happy deploying! 🚀**

---

*Last Updated: December 31, 2025*
*Version: 2.0.0-optimized*
