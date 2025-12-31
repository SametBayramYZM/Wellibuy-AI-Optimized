#!/usr/bin/env node

/**
 * Vercel Deployment Helper
 * Bu script Vercel deployment'ı için gereken environment setup'ını kontrol eder
 * 
 * Kullanım: node vercel-setup.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.blue}  Wellibuy AI - Vercel Deployment Setup${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

let errors = 0;
let warnings = 0;

// Check Node.js version
console.log('📦 Checking Prerequisites...\n');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 18) {
  log.success(`Node.js version: ${nodeVersion}`);
} else {
  log.error(`Node.js version ${nodeVersion} - Required: v18.0.0 or higher`);
  errors++;
}

// Check git
const { execSync } = require('child_process');
try {
  const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
  log.success(`Git installed: ${gitVersion}`);
} catch {
  log.error('Git not found - Required for Vercel deployment');
  errors++;
}

// Check package.json
console.log('\n📋 Checking Configuration Files...\n');

if (fs.existsSync('package.json')) {
  log.success('package.json found');
} else {
  log.error('package.json not found');
  errors++;
}

if (fs.existsSync('next.config.js')) {
  log.success('next.config.js found');
} else {
  log.error('next.config.js not found');
  errors++;
}

if (fs.existsSync('vercel.json')) {
  log.success('vercel.json found');
} else {
  log.warning('vercel.json not found - Vercel will use defaults');
  warnings++;
}

if (fs.existsSync('app/api/route.ts')) {
  log.success('app/api/route.ts found (API proxy configured)');
} else {
  log.warning('app/api/route.ts not found - Backend routing may not work');
  warnings++;
}

// Check environment files
console.log('\n🔐 Checking Environment Configuration...\n');

if (fs.existsSync('.env.example')) {
  log.success('.env.example found');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'OPENAI_API_KEY', 'BACKEND_URL'];
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!envExample.includes(varName)) {
      missing.push(varName);
    }
  });
  
  if (missing.length === 0) {
    log.success('All required environment variables in .env.example');
  } else {
    log.warning(`Missing environment variables: ${missing.join(', ')}`);
    warnings++;
  }
} else {
  log.error('.env.example not found');
  errors++;
}

if (fs.existsSync('.env.production')) {
  log.success('.env.production found');
} else {
  log.warning('.env.production not found - Create before production deployment');
  warnings++;
}

// Check project structure
console.log('\n🏗️  Checking Project Structure...\n');

const requiredDirs = [
  'app',
  'components',
  'lib',
  'server',
  'types',
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    log.success(`${dir}/ exists`);
  } else {
    log.error(`${dir}/ directory missing`);
    errors++;
  }
});

// Check dependencies
console.log('\n📚 Checking Dependencies...\n');

if (fs.existsSync('node_modules')) {
  log.success('node_modules exists');
  
  const criticalPackages = ['next', 'express', 'mongoose', 'openai', 'jsonwebtoken'];
  criticalPackages.forEach(pkg => {
    if (fs.existsSync(`node_modules/${pkg}`)) {
      log.success(`${pkg} installed`);
    } else {
      log.warning(`${pkg} not installed`);
      warnings++;
    }
  });
} else {
  log.warning('node_modules not found - Run: npm install');
  warnings++;
}

// Check Git
console.log('\n🔄 Checking Git Status...\n');

try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (gitStatus) {
    log.warning('Uncommitted changes detected - Commit before deploying');
    warnings++;
  } else {
    log.success('Git repository clean');
  }
} catch {
  log.warning('Not a Git repository - Initialize with: git init');
  warnings++;
}

// Check .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env') && gitignore.includes('node_modules')) {
    log.success('.gitignore properly configured');
  } else {
    log.warning('.gitignore might be incomplete');
    warnings++;
  }
} else {
  log.warning('.gitignore not found');
  warnings++;
}

// Summary
console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.blue}  SETUP VERIFICATION SUMMARY${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

if (errors === 0 && warnings === 0) {
  console.log(`${colors.green}✨ Perfect! Everything is ready for Vercel deployment.${colors.reset}\n`);
  console.log('Next steps:');
  console.log('1. Set environment variables in Vercel Dashboard');
  console.log('2. Connect your GitHub repository to Vercel');
  console.log('3. Configure MongoDB Atlas');
  console.log('4. Deploy!\n');
} else {
  if (errors > 0) {
    console.log(`${colors.red}❌ ${errors} error(s) found${colors.reset}`);
    console.log('   Fix errors before deploying.\n');
  }
  if (warnings > 0) {
    console.log(`${colors.yellow}⚠️  ${warnings} warning(s) found${colors.reset}`);
    console.log('   Warnings might affect functionality.\n');
  }
}

console.log('📖 For help, check:');
console.log('   - VERCEL-DEPLOYMENT.md');
console.log('   - DEPLOYMENT.md');
console.log('   - README.md\n');

console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

process.exit(errors > 0 ? 1 : 0);
