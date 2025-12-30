# 🧪 TESTING GUIDE

## Overview

This guide covers manual and automated testing for the Wellibuy AI platform.

---

## Quick Test

```bash
# 1. Start servers
npm run server  # Terminal 1
npm run dev     # Terminal 2

# 2. Basic health check
curl http://localhost:5001/api/health
# Expected: {"status":"healthy","database":"connected","timestamp":"..."}

# 3. Open browser
# Navigate to: http://localhost:3001
```

---

## Manual Testing

### 1. Authentication Tests

#### Register New User
```bash
# Test 1: Valid registration
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test1234!"
}

# Expected: 201 Created
# Response: { "token": "...", "user": {...} }

# Test 2: Duplicate email
# Use same email again
# Expected: 400 Bad Request
# Response: { "error": "User already exists" }

# Test 3: Weak password
{
  "name": "Test",
  "email": "test2@example.com",
  "password": "123"
}
# Expected: 400 Bad Request
```

#### Login
```bash
# Test 1: Valid login
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234!"
}

# Expected: 200 OK
# Response: { "token": "...", "user": {...} }

# Test 2: Wrong password
{
  "email": "test@example.com",
  "password": "WrongPassword"
}
# Expected: 401 Unauthorized

# Test 3: Non-existent user
{
  "email": "nobody@example.com",
  "password": "Test1234!"
}
# Expected: 401 Unauthorized
```

---

### 2. Product Tests

#### Get All Products
```bash
GET http://localhost:5001/api/products

# Expected: 200 OK
# Response: [{ "_id": "...", "name": "...", ... }]
```

#### Search Products
```bash
GET http://localhost:5001/api/products/search?query=laptop

# Expected: 200 OK
# Response: Filtered product list
```

#### Get Product by ID
```bash
GET http://localhost:5001/api/products/[product-id]

# Expected: 200 OK
# Response: { "_id": "...", "name": "...", ... }
```

---

### 3. AI Feature Tests

#### AI Chat
```bash
POST http://localhost:5001/api/ai/chat
Content-Type: application/json
Authorization: Bearer [your-jwt-token]

{
  "message": "What's the best laptop for programming?",
  "context": {
    "page": "search",
    "query": "laptop"
  }
}

# Expected: 200 OK
# Response: { "response": "AI recommendation..." }
```

#### AI Recommendations
```bash
POST http://localhost:5001/api/ai/recommendations
Content-Type: application/json

{
  "preferences": {
    "category": "laptop",
    "budget": 1000,
    "usage": "programming"
  }
}

# Expected: 200 OK
# Response: { "products": [...], "reasoning": "..." }
```

#### PC Builder
```bash
POST http://localhost:5001/api/ai/pc-builder
Content-Type: application/json

{
  "budget": 1500,
  "purpose": "gaming",
  "preferences": {
    "brand": "NVIDIA",
    "rgb": true
  }
}

# Expected: 200 OK
# Response: { "build": {...}, "totalPrice": 1450, ... }
```

---

### 4. User Profile Tests

#### Get Profile (Protected)
```bash
GET http://localhost:5001/api/users/profile
Authorization: Bearer [your-jwt-token]

# Expected: 200 OK
# Response: { "user": {...} }

# Test without token:
GET http://localhost:5001/api/users/profile

# Expected: 401 Unauthorized
```

#### Update Profile
```bash
PUT http://localhost:5001/api/users/profile
Authorization: Bearer [your-jwt-token]
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}

# Expected: 200 OK
# Response: { "user": {...} }
```

#### Change Password
```bash
PUT http://localhost:5001/api/users/password
Authorization: Bearer [your-jwt-token]
Content-Type: application/json

{
  "currentPassword": "Test1234!",
  "newPassword": "NewTest1234!"
}

# Expected: 200 OK
# Response: { "message": "Password updated" }
```

---

### 5. Security Tests

#### Rate Limiting
```bash
# Test auth rate limit (5 requests/15min)
for i in {1..7}; do
  curl -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "\nRequest $i"
done

# Expected: First 5 succeed, 6th and 7th return 429 Too Many Requests
```

#### CORS
```bash
# Test from different origin
curl -H "Origin: http://malicious-site.com" \
  http://localhost:5001/api/health

# Expected: CORS error or blocked
```

#### XSS Prevention
```bash
# Try XSS in registration
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "<script>alert('XSS')</script>",
  "email": "xss@test.com",
  "password": "Test1234!"
}

# Expected: Input sanitized, no script execution
```

#### NoSQL Injection
```bash
# Try NoSQL injection in login
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}

# Expected: 400 Bad Request or sanitized
```

---

## Frontend Testing

### Page Tests

#### Home Page
1. Open http://localhost:3001
2. Check hero section loads
3. Verify categories display
4. Check featured products load
5. Test AI recommendations section

#### Search Page
1. Navigate to http://localhost:3001/search
2. Enter search query "laptop"
3. Verify results display
4. Click product card → should navigate to product page
5. Test AI toggle button
6. Test AI chat modal

#### Product Page
1. Click any product
2. Verify product details load
3. Check image display
4. Test specifications tab
5. Test reviews section

#### Authentication Pages
1. Go to http://localhost:3001/login
2. Test form validation
3. Submit valid credentials
4. Verify redirect to profile
5. Test logout
6. Go to http://localhost:3001/register
7. Test registration form
8. Verify email validation
9. Test password strength indicator

#### Profile Page
1. Login first
2. Go to http://localhost:3001/profile
3. Test profile info display
4. Test edit mode
5. Update name/email
6. Test password change
7. Verify validation

---

## Automated Testing

### Setup Jest (Optional)

```bash
npm install --save-dev jest supertest @types/jest
```

### Test Examples

#### 1. Auth Tests
```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test1234!'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User 1',
          email: 'duplicate@test.com',
          password: 'Test1234!'
        });

      // Try duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User 2',
          email: 'duplicate@test.com',
          password: 'Test1234!'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Register user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test',
          email: 'login@test.com',
          password: 'Test1234!'
        });

      // Login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'Test1234!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
    });
  });
});
```

#### 2. Product Tests
```javascript
// __tests__/products.test.js
describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/products/search', () => {
    it('should search products', async () => {
      const res = await request(app)
        .get('/api/products/search')
        .query({ query: 'laptop' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
```

#### 3. Security Tests
```javascript
// __tests__/security.test.js
describe('Security', () => {
  describe('Rate Limiting', () => {
    it('should block after max requests', async () => {
      const requests = [];
      
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'wrong' })
        );
      }

      const responses = await Promise.all(requests);
      const blocked = responses.filter(r => r.status === 429);
      
      expect(blocked.length).toBeGreaterThan(0);
    });
  });

  describe('Authentication', () => {
    it('should require token for protected routes', async () => {
      const res = await request(app).get('/api/users/profile');
      
      expect(res.status).toBe(401);
    });
  });
});
```

---

## Performance Testing

### Load Testing with Artillery (Optional)

```bash
npm install -g artillery
```

Create `artillery.yml`:
```yaml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Product search"
    flow:
      - get:
          url: "/api/products/search?query=laptop"
```

Run test:
```bash
artillery run artillery.yml
```

---

## Database Testing

### Seed Test Data

```bash
npm run seed
```

### Manual MongoDB Queries

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/wellibuy

# Check collections
show collections

# Count products
db.products.countDocuments()

# Find user
db.users.findOne({ email: "test@example.com" })

# Check indexes
db.products.getIndexes()
```

---

## Continuous Testing

### Pre-commit Checklist

- [ ] All manual tests pass
- [ ] No console errors
- [ ] Security tests pass
- [ ] Performance acceptable
- [ ] Code formatted
- [ ] No hardcoded secrets

### Automated CI/CD (GitHub Actions Example)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm test
      - run: npm run lint
```

---

## Troubleshooting

### Test Failures

**Connection Refused**
```bash
# Check if servers are running
curl http://localhost:5001/api/health
curl http://localhost:3001

# Restart servers
npm run server
npm run dev
```

**Database Errors**
```bash
# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
# Windows: Services > MongoDB > Restart
# Mac/Linux: brew services restart mongodb-community
```

**Rate Limit Issues**
```bash
# Wait 15 minutes or restart server to reset
npm run server
```

---

## Test Coverage Goals

- ✅ Authentication: 100%
- ✅ Product API: 100%
- ✅ AI Features: 80%
- ✅ Security: 90%
- ✅ User Management: 100%

---

**Testing is crucial for production readiness!**

Last Updated: December 30, 2025  
Version: 2.0.0 Optimized
