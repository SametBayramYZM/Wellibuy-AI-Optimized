# 📚 API DOCUMENTATION

**Base URL:** `http://localhost:5001/api`  
**Production:** `https://your-domain.com/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Products](#products)
3. [Categories](#categories)
4. [AI Features](#ai-features)
5. [User Management](#user-management)
6. [Health Check](#health-check)
7. [Error Codes](#error-codes)

---

## Authentication

### Register New User

**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No  
**Rate Limit:** 5 requests/15min

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-30T12:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Password must be at least 6 characters"
}

// 400 - Duplicate Email
{
  "error": "User already exists"
}
```

---

### Login

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**Rate Limit:** 5 requests/15min

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{
  "error": "Invalid email or password"
}

// 429 - Rate Limit Exceeded
{
  "error": "Too many requests, please try again later"
}
```

---

### Logout

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes  
**Rate Limit:** 100 requests/15min

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Products

### Get All Products

**Endpoint:** `GET /api/products`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Query Parameters:**
- `limit` (optional): Number of products (default: all)
- `skip` (optional): Number to skip (pagination)
- `sort` (optional): Sort field (default: -createdAt)

**Example:**
```
GET /api/products?limit=20&skip=0&sort=-price
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "category": "Laptop",
    "brand": "ASUS",
    "inStock": true,
    "specifications": {
      "cpu": "Intel i7-12700H",
      "ram": "16GB DDR5",
      "storage": "512GB NVMe SSD",
      "gpu": "RTX 3060"
    },
    "images": [
      "https://example.com/image1.jpg"
    ],
    "rating": 4.5,
    "reviews": []
  }
]
```

---

### Search Products

**Endpoint:** `GET /api/products/search`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Query Parameters:**
- `query` (required): Search term
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `brand` (optional): Filter by brand

**Example:**
```
GET /api/products/search?query=laptop&category=Laptop&maxPrice=1500
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "price": 1299.99,
    "category": "Laptop",
    "brand": "ASUS",
    "inStock": true,
    "rating": 4.5
  }
]
```

---

### Get Product by ID

**Endpoint:** `GET /api/products/:id`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Example:**
```
GET /api/products/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 3060",
  "price": 1299.99,
  "category": "Laptop",
  "brand": "ASUS",
  "inStock": true,
  "specifications": {
    "cpu": "Intel i7-12700H",
    "ram": "16GB DDR5",
    "storage": "512GB NVMe SSD",
    "gpu": "NVIDIA RTX 3060",
    "display": "15.6\" FHD 144Hz",
    "weight": "2.3kg"
  },
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "rating": 4.5,
  "reviews": [
    {
      "user": "Alice",
      "rating": 5,
      "comment": "Excellent laptop!",
      "date": "2025-12-25"
    }
  ],
  "createdAt": "2025-12-01T00:00:00.000Z",
  "updatedAt": "2025-12-30T00:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "Product not found"
}

// 400 - Invalid ID
{
  "error": "Invalid product ID"
}
```

---

## Categories

### Get All Categories

**Endpoint:** `GET /api/categories`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Success Response (200):**
```json
[
  {
    "name": "Laptop",
    "slug": "laptop",
    "description": "Portable computers",
    "icon": "💻",
    "productCount": 45
  },
  {
    "name": "Desktop",
    "slug": "desktop",
    "description": "Desktop computers",
    "icon": "🖥️",
    "productCount": 32
  }
]
```

---

### Get Products by Category

**Endpoint:** `GET /api/categories/:name/products`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Example:**
```
GET /api/categories/laptop/products
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "price": 1299.99,
    "category": "Laptop",
    "brand": "ASUS",
    "inStock": true
  }
]
```

---

## AI Features

### AI Chat

**Endpoint:** `POST /api/ai/chat`  
**Auth Required:** Yes (recommended) or No  
**Rate Limit:** 100 requests/15min

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "What's the best laptop for programming under $1500?",
  "context": {
    "page": "search",
    "query": "laptop",
    "filters": {
      "maxPrice": 1500,
      "category": "Laptop"
    }
  },
  "history": [
    {
      "role": "user",
      "content": "I need a laptop"
    },
    {
      "role": "assistant",
      "content": "What's your budget?"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "response": "Based on your $1500 budget for programming, I recommend the ASUS ROG Zephyrus G14. It features an AMD Ryzen 9 processor, 16GB RAM, and excellent battery life. Perfect for development work with powerful compilation capabilities.",
  "suggestedProducts": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "ASUS ROG Zephyrus G14",
      "price": 1449.99,
      "relevance": 0.95
    }
  ],
  "followUpQuestions": [
    "Would you like more RAM?",
    "Do you need a dedicated GPU?",
    "What programming languages will you use?"
  ]
}
```

---

### AI Product Recommendations

**Endpoint:** `POST /api/ai/recommendations`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Request Body:**
```json
{
  "preferences": {
    "category": "laptop",
    "budget": 1000,
    "usage": "gaming",
    "brand": "ASUS",
    "specifications": {
      "minRam": 16,
      "minStorage": 512,
      "gpu": "RTX"
    }
  },
  "limit": 5
}
```

**Success Response (200):**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "ASUS TUF Gaming A15",
      "price": 999.99,
      "matchScore": 0.92,
      "reasoning": "Excellent value for gaming with RTX 3050, 16GB RAM"
    }
  ],
  "reasoning": "These laptops match your gaming requirements within budget, featuring strong GPUs and sufficient RAM for modern games.",
  "alternativeSuggestions": [
    "Consider increasing budget by $200 for RTX 3060",
    "Check refurbished options for better specs"
  ]
}
```

---

### PC Builder AI

**Endpoint:** `POST /api/ai/pc-builder`  
**Auth Required:** No  
**Rate Limit:** 100 requests/15min

**Request Body:**
```json
{
  "budget": 1500,
  "purpose": "gaming",
  "preferences": {
    "brand": "NVIDIA",
    "rgb": true,
    "overclocking": false,
    "formFactor": "ATX"
  },
  "prioritize": "performance"
}
```

**Success Response (200):**
```json
{
  "build": {
    "cpu": {
      "id": "...",
      "name": "AMD Ryzen 5 5600X",
      "price": 199.99
    },
    "gpu": {
      "id": "...",
      "name": "NVIDIA RTX 3060 Ti",
      "price": 449.99
    },
    "motherboard": {
      "id": "...",
      "name": "MSI B550 Gaming Plus",
      "price": 139.99
    },
    "ram": {
      "id": "...",
      "name": "Corsair Vengeance 16GB DDR4",
      "price": 79.99
    },
    "storage": {
      "id": "...",
      "name": "Samsung 970 EVO 1TB NVMe",
      "price": 129.99
    },
    "psu": {
      "id": "...",
      "name": "Corsair RM750 750W",
      "price": 109.99
    },
    "case": {
      "id": "...",
      "name": "NZXT H510 Elite",
      "price": 149.99
    }
  },
  "totalPrice": 1459.93,
  "savings": 40.07,
  "performance": {
    "gaming": "Excellent - 1440p 60-100fps",
    "productivity": "Very Good",
    "futureProof": "3-4 years"
  },
  "compatibility": {
    "verified": true,
    "warnings": [],
    "powerConsumption": "450W typical"
  },
  "reasoning": "This build prioritizes gaming performance within your $1500 budget. The RTX 3060 Ti provides excellent 1440p gaming, paired with a capable Ryzen 5600X."
}
```

---

## User Management

### Get User Profile

**Endpoint:** `GET /api/users/profile`  
**Auth Required:** Yes  
**Rate Limit:** 100 requests/15min

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-01T00:00:00.000Z",
    "preferences": {
      "newsletter": true,
      "notifications": true
    }
  }
}
```

**Error Response:**
```json
// 401 - Unauthorized
{
  "error": "Access denied. No token provided"
}
```

---

### Update User Profile

**Endpoint:** `PUT /api/users/profile`  
**Auth Required:** Yes  
**Rate Limit:** 100 requests/15min

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "preferences": {
    "newsletter": false
  }
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.new@example.com",
    "updatedAt": "2025-12-30T12:00:00.000Z"
  }
}
```

---

### Change Password

**Endpoint:** `PUT /api/users/password`  
**Auth Required:** Yes  
**Rate Limit:** 5 requests/15min

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
```json
// 401 - Wrong Current Password
{
  "error": "Current password is incorrect"
}

// 400 - Weak New Password
{
  "error": "New password must be at least 6 characters"
}
```

---

## Health Check

### Server Health

**Endpoint:** `GET /api/health`  
**Auth Required:** No  
**Rate Limit:** None

**Success Response (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-30T12:00:00.000Z",
  "uptime": 3600,
  "version": "2.0.0"
}
```

**Error Response:**
```json
// 503 - Service Unavailable
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Cannot connect to MongoDB"
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server not ready |

---

### Common Error Response Format

```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "issue": "Invalid format"
  }
}
```

---

## Rate Limiting

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth endpoints | 5 requests | 15 minutes |
| Password change | 5 requests | 15 minutes |
| Health check | Unlimited | - |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1735560000
```

---

## Authentication

### JWT Token

**Format:** Bearer token in Authorization header

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTczNTU2MDAwMCwiZXhwIjoxNzM1NjQ2NDAwfQ.signature
```

**Token Payload:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "iat": 1735560000,
  "exp": 1735646400
}
```

**Expiration:** 24 hours

---

## Pagination

### Query Parameters

```
?limit=20&skip=0
```

- `limit`: Number of items per page
- `skip`: Number of items to skip

### Response Headers

```
X-Total-Count: 150
X-Page: 1
X-Per-Page: 20
```

---

## Best Practices

### 1. Always Use HTTPS in Production
```
https://your-domain.com/api
```

### 2. Handle Errors Gracefully
```javascript
try {
  const response = await fetch('/api/products');
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
}
```

### 3. Store Tokens Securely
- Use HttpOnly cookies (recommended)
- Or localStorage (less secure but acceptable for MVP)
- Never expose in URLs

### 4. Respect Rate Limits
- Implement exponential backoff
- Cache responses when possible
- Use pagination for large datasets

### 5. Validate Input
- Client-side validation for UX
- Server-side validation for security
- Never trust client data

---

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "Wellibuy AI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Test1234!\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5001"
    }
  ]
}
```

---

**API Version:** 2.0.0  
**Last Updated:** December 30, 2025  
**Support:** Check GitHub issues or README.md
