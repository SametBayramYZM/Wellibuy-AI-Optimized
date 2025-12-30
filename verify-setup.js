#!/usr/bin/env node

/**
 * Installation Verification Script
 * Checks if Wellibuy AI is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Wellibuy AI - Installation Verification\n');

let errors = 0;
let warnings = 0;

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => {
    console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
    warnings++;
  },
  error: (msg) => {
    console.log(`${colors.red}❌ ${msg}${colors.reset}`);
    errors++;
  },
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

// Check Node.js version
console.log('📦 Checking Dependencies...\n');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 18) {
  log.success(`Node.js version: ${nodeVersion}`);
} else {
  log.error(`Node.js version ${nodeVersion} - Required: v18.0.0 or higher`);
}

// Check if package.json exists
if (fs.existsSync('package.json')) {
  log.success('package.json found');
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check critical dependencies
  const criticalDeps = [
    'next',
    'react',
    'express',
    'mongoose',
    'openai',
    'jsonwebtoken',
    'bcryptjs'
  ];
  
  console.log('\n📚 Checking Critical Dependencies...\n');
  
  criticalDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      log.success(`${dep}: ${pkg.dependencies[dep]}`);
    } else {
      log.error(`Missing dependency: ${dep}`);
    }
  });
} else {
  log.error('package.json not found');
}

// Check if node_modules exists
console.log('\n📁 Checking Installation...\n');

if (fs.existsSync('node_modules')) {
  log.success('node_modules directory exists');
  
  // Check if critical packages are installed
  const packagesToCheck = ['next', 'express', 'mongoose', 'openai'];
  packagesToCheck.forEach(pkg => {
    if (fs.existsSync(`node_modules/${pkg}`)) {
      log.success(`${pkg} installed`);
    } else {
      log.error(`${pkg} not installed - Run: npm install`);
    }
  });
} else {
  log.error('node_modules not found - Run: npm install');
}

// Check environment configuration
console.log('\n⚙️  Checking Configuration...\n');

if (fs.existsSync('.env')) {
  log.success('.env file exists');
  
  const envContent = fs.readFileSync('.env', 'utf8');
  
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'NODE_ENV',
    'PORT',
    'FRONTEND_URL',
    'NEXT_PUBLIC_API_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && match[1].trim() && !match[1].includes('your-') && !match[1].includes('change-this')) {
        log.success(`${varName} configured`);
      } else {
        log.warning(`${varName} needs configuration`);
      }
    } else {
      log.error(`${varName} missing in .env`);
    }
  });
} else {
  log.error('.env file not found');
  log.info('Copy .env.example to .env and configure values');
}

// Check project structure
console.log('\n🏗️  Checking Project Structure...\n');

const requiredDirs = [
  'app',
  'components',
  'lib',
  'server',
  'server/routes',
  'types'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    log.success(`${dir}/ exists`);
  } else {
    log.error(`${dir}/ directory missing`);
  }
});

// Check API routes
console.log('\n🛣️  Checking API Routes...\n');

const requiredRoutes = [
  'server/routes/products.js',
  'server/routes/ai.js',
  'server/routes/categories.js',
  'server/routes/auth.js',
  'server/routes/users.js'
];

requiredRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    log.success(path.basename(route));
  } else {
    log.error(`${route} missing`);
  }
});

// Check configuration files
console.log('\n⚙️  Checking Configuration Files...\n');

const configFiles = [
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log.success(file);
  } else {
    log.error(`${file} missing`);
  }
});

// Check documentation
console.log('\n📚 Checking Documentation...\n');

const docs = [
  'README.md',
  'DEPLOYMENT.md',
  'API.md',
  'SECURITY.md',
  'TESTING.md',
  'FAQ.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE'
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    log.success(doc);
  } else {
    log.warning(`${doc} missing`);
  }
});

// Check for common issues
console.log('\n🔍 Checking for Common Issues...\n');

// Check if .gitignore exists
if (fs.existsSync('.gitignore')) {
  log.success('.gitignore exists');
  
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  if (gitignoreContent.includes('.env') && gitignoreContent.includes('node_modules')) {
    log.success('.gitignore properly configured');
  } else {
    log.warning('.gitignore might be incomplete');
  }
} else {
  log.warning('.gitignore not found');
}

// Check package-lock.json
if (fs.existsSync('package-lock.json')) {
  log.success('package-lock.json exists');
} else {
  log.warning('package-lock.json not found - Run: npm install');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY\n');

if (errors === 0 && warnings === 0) {
  console.log(`${colors.green}✨ Perfect! Everything is set up correctly.${colors.reset}\n`);
  console.log('Next steps:');
  console.log('1. Start backend:  npm run server');
  console.log('2. Start frontend: npm run dev');
  console.log('3. Open browser:   http://localhost:3001');
} else {
  if (errors > 0) {
    console.log(`${colors.red}❌ ${errors} error(s) found${colors.reset}`);
    console.log('   Please fix errors before running the application.\n');
  }
  
  if (warnings > 0) {
    console.log(`${colors.yellow}⚠️  ${warnings} warning(s) found${colors.reset}`);
    console.log('   Application might work, but check warnings.\n');
  }
  
  console.log('Common solutions:');
  if (!fs.existsSync('node_modules')) {
    console.log('• Run: npm install');
  }
  if (!fs.existsSync('.env')) {
    console.log('• Run: copy .env.example .env');
    console.log('• Then edit .env with your values');
  }
}

console.log('\n📖 For help, check:');
console.log('   - README.md');
console.log('   - FAQ.md');
console.log('   - DEPLOYMENT.md');
console.log('='.repeat(50) + '\n');

process.exit(errors > 0 ? 1 : 0);
