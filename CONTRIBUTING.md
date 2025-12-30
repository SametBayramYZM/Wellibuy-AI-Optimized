# 🤝 CONTRIBUTING GUIDE

Thank you for considering contributing to Wellibuy AI! This document provides guidelines and instructions for contributors.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability
- Ethnicity, gender identity
- Level of experience
- Nationality, personal appearance
- Race, religion, sexual orientation

### Our Standards

**Positive behavior:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what's best for the community
- ✅ Showing empathy towards others

**Unacceptable behavior:**
- ❌ Trolling, insulting, or derogatory comments
- ❌ Personal or political attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information
- ❌ Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: conduct@wellibuy.com

---

## Getting Started

### Prerequisites

```bash
# Required
Node.js v18+
MongoDB v6+
Git v2.0+

# Recommended
VS Code (with extensions)
Postman (API testing)
MongoDB Compass (database GUI)
```

### Fork & Clone

```bash
# 1. Fork repository on GitHub
# Click "Fork" button

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/Wellibuy-AI-Optimized.git
cd Wellibuy-AI-Optimized

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/Wellibuy-AI-Optimized.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/... (your fork)
# upstream  https://github.com/ORIGINAL-OWNER/... (original)
```

### Setup Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env
# Edit .env with your values

# 3. Start MongoDB
# Windows: Services > MongoDB > Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 4. Seed database
npm run seed

# 5. Run servers
npm run server  # Terminal 1
npm run dev     # Terminal 2

# 6. Verify
curl http://localhost:5001/api/health
# Should return: {"status":"healthy","database":"connected"}
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# 1. Update main branch
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# Naming conventions:
# feature/   - New features
# fix/       - Bug fixes
# docs/      - Documentation
# refactor/  - Code refactoring
# test/      - Adding tests
# chore/     - Maintenance tasks
```

### Making Changes

```bash
# 1. Make your changes
# 2. Test locally
npm run server
npm run dev

# 3. Check for errors
npm run lint

# 4. Stage changes
git add .

# 5. Commit (see Commit Guidelines below)
git commit -m "feat: add user profile picture upload"

# 6. Push to your fork
git push origin feature/your-feature-name
```

### Syncing with Upstream

```bash
# Keep your fork updated
git checkout main
git pull upstream main
git push origin main

# Update feature branch
git checkout feature/your-feature-name
git rebase main
```

---

## Coding Standards

### General Principles

1. **KISS** - Keep It Simple, Stupid
2. **DRY** - Don't Repeat Yourself
3. **YAGNI** - You Aren't Gonna Need It
4. **SOLID** - Single responsibility, Open/closed, Liskov, Interface, Dependency

### TypeScript/JavaScript

```typescript
// ✅ Good: Descriptive names
const getUserById = async (userId: string): Promise<User> => {
  return await User.findById(userId);
};

// ❌ Bad: Unclear names
const get = async (id: string) => {
  return await User.findById(id);
};

// ✅ Good: Type safety
interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ❌ Bad: Any type
const filterProducts = (filter: any) => { };

// ✅ Good: Error handling
try {
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ error: 'Server error' });
}

// ❌ Bad: Silent failures
const user = await getUserById(id);
```

### React/TSX

```tsx
// ✅ Good: Functional components with TypeScript
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product._id)}>
        Add to Cart
      </button>
    </div>
  );
};

// ❌ Bad: Class components, no types
class ProductCard extends React.Component {
  render() {
    return <div>{this.props.product.name}</div>;
  }
}

// ✅ Good: Hooks
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchProducts();
}, []);

// ❌ Bad: Direct state mutation
products.push(newProduct);  // Never do this!
```

### File Organization

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Buttons, inputs, etc.
│   ├── layout/        # Header, Footer, etc.
│   └── features/      # Feature-specific
├── pages/             # Next.js pages
├── lib/               # Utilities, helpers
├── types/             # TypeScript types
├── hooks/             # Custom React hooks
└── services/          # API services
```

### Naming Conventions

```typescript
// Files
// ✅ PascalCase for components
ProductCard.tsx
Header.tsx

// ✅ camelCase for utilities
api-service.ts
auth-helper.ts

// Variables & Functions
// ✅ camelCase
const userName = 'John';
const fetchUserData = () => {};

// Constants
// ✅ UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Types & Interfaces
// ✅ PascalCase
interface User {}
type ProductFilter = {};

// Private functions
// ✅ Prefix with underscore
const _internalHelper = () => {};
```

### Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Retry 3 times because API is occasionally unstable
const MAX_RETRIES = 3;

// ❌ Bad: Stating the obvious
// Set max retries to 3
const MAX_RETRIES = 3;

// ✅ Good: JSDoc for functions
/**
 * Fetches user by ID with error handling
 * @param userId - The user's unique identifier
 * @returns Promise<User | null>
 * @throws {APIError} If request fails
 */
const getUserById = async (userId: string): Promise<User | null> => {
  // Implementation
};

// ✅ Good: TODO comments
// TODO: Add pagination support (Issue #123)
// FIXME: Memory leak in large datasets (Issue #456)
// HACK: Temporary workaround for Safari bug
```

---

## Testing Guidelines

### Writing Tests

```typescript
// __tests__/auth.test.ts

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'Pass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });
  });
});
```

### Test Checklist

- [ ] Unit tests for new functions
- [ ] Integration tests for API endpoints
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Security tests for auth features
- [ ] Performance tests for heavy operations
- [ ] All tests passing: `npm test`

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, missing semicolons)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
# ✅ Good
feat(auth): add password reset functionality

Implement password reset via email with secure token generation.
Tokens expire after 1 hour for security.

Closes #123

# ✅ Good
fix(api): resolve rate limiting issue on auth endpoints

Previously, rate limiter was not working correctly for /api/auth/*
endpoints due to middleware order. Fixed by moving rate limiter
before route handlers.

Fixes #456

# ❌ Bad
update stuff

# ❌ Bad
fixed bug
```

### Rules

1. **Subject line:**
   - Use imperative mood ("add" not "added")
   - Don't capitalize first letter
   - No period at the end
   - Max 50 characters

2. **Body:**
   - Explain WHAT and WHY, not HOW
   - Wrap at 72 characters
   - Separate from subject with blank line

3. **Footer:**
   - Reference issues: `Closes #123`, `Fixes #456`
   - Breaking changes: `BREAKING CHANGE: ...`

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console.log() statements
- [ ] No merge conflicts

### Creating Pull Request

1. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub:**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out template

3. **PR Title Format:**
```
[Type] Brief description

Examples:
[Feature] Add user profile picture upload
[Fix] Resolve product search pagination bug
[Docs] Update API documentation
```

4. **PR Description Template:**
```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] Self-reviewed
- [ ] No breaking changes

## Related Issues
Closes #123
Fixes #456
```

### Review Process

1. **Automated checks:**
   - Linting
   - Tests
   - Build

2. **Code review:**
   - 1-2 reviewers required
   - Address feedback
   - Make requested changes

3. **Approval:**
   - All checks passing
   - Approved by reviewers
   - Maintainer merges

### After Merge

```bash
# Update your main branch
git checkout main
git pull upstream main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## Issue Guidelines

### Bug Reports

```markdown
**Bug Description**
Clear and concise description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: Windows 11
- Node: v18.17.0
- Browser: Chrome 120
- Version: 2.0.0

**Additional Context**
Any other relevant information
```

### Feature Requests

```markdown
**Feature Description**
Clear and concise description of the feature

**Problem**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives**
Other solutions considered

**Priority**
High / Medium / Low

**Additional Context**
Mockups, examples, etc.
```

---

## Style Guide

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Run Formatting

```bash
# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Format with Prettier (if configured)
npx prettier --write .
```

---

## Documentation

### Code Documentation

```typescript
/**
 * Fetches products with advanced filtering
 * 
 * @param {ProductFilter} filter - Filter criteria
 * @param {number} limit - Maximum results (default: 20)
 * @param {number} skip - Results to skip for pagination
 * @returns {Promise<Product[]>} Filtered products
 * 
 * @example
 * const products = await fetchProducts({
 *   category: 'laptop',
 *   maxPrice: 1500
 * }, 10, 0);
 */
export const fetchProducts = async (
  filter: ProductFilter,
  limit: number = 20,
  skip: number = 0
): Promise<Product[]> => {
  // Implementation
};
```

### README Updates

When adding features, update README.md:
- [ ] Feature list
- [ ] Usage examples
- [ ] Configuration options
- [ ] API endpoints (if applicable)

---

## Getting Help

### Resources

- **Documentation:** README.md, API.md, FAQ.md
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** dev@wellibuy.com

### Questions?

1. Check FAQ.md first
2. Search existing issues
3. Ask in Discussions
4. Create new issue if needed

---

## Recognition

### Contributors

All contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in community updates

### Contribution Types

We value all contributions:
- 💻 Code
- 📝 Documentation
- 🐛 Bug reports
- 💡 Feature ideas
- 🎨 Design
- 🌍 Translations
- 📢 Community support

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Wellibuy AI!** 🎉

Your contributions make this project better for everyone.

Last Updated: December 30, 2025  
Version: 2.0.0-optimized
