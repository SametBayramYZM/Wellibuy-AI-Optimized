# Wellibuy AI - Quick Start Script for Windows
# This script helps you set up and run Wellibuy AI

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Wellibuy AI - Quick Start" -ForegroundColor Cyan
Write-Host "  Version 2.0.0 Optimized" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Install from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host ""
Write-Host "Checking MongoDB..." -ForegroundColor Yellow

if (Test-Command "mongod") {
    Write-Host "✅ MongoDB installed" -ForegroundColor Green
    
    # Try to connect
    $mongoRunning = $false
    try {
        $result = mongosh --eval "db.adminCommand('ping')" --quiet 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MongoDB is running" -ForegroundColor Green
            $mongoRunning = $true
        }
    } catch {
        $mongoRunning = $false
    }
    
    if (-not $mongoRunning) {
        Write-Host "⚠️  MongoDB not running" -ForegroundColor Yellow
        $startMongo = Read-Host "Start MongoDB now? (Y/n)"
        
        if ($startMongo -ne "n" -and $startMongo -ne "N") {
            Write-Host "Starting MongoDB..." -ForegroundColor Yellow
            Start-Service MongoDB -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "✅ MongoDB started" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️  MongoDB not found locally" -ForegroundColor Yellow
    Write-Host "   You can use MongoDB Atlas (cloud)" -ForegroundColor Cyan
    Write-Host "   https://www.mongodb.com/cloud/atlas" -ForegroundColor Cyan
}

# Check if node_modules exists
Write-Host ""
Write-Host "Checking installation..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not installed" -ForegroundColor Yellow
    $install = Read-Host "Install dependencies now? (Y/n)"
    
    if ($install -ne "n" -and $install -ne "N") {
        Write-Host ""
        Write-Host "Installing dependencies (this may take 2-5 minutes)..." -ForegroundColor Yellow
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Installation failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Cannot proceed without dependencies" -ForegroundColor Red
        Write-Host "   Run: npm install" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Check .env file
Write-Host ""
Write-Host "Checking configuration..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        $createEnv = Read-Host "Create .env from .env.example? (Y/n)"
        
        if ($createEnv -ne "n" -and $createEnv -ne "N") {
            Copy-Item ".env.example" ".env"
            Write-Host "✅ .env file created" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANT: Edit .env file with your values!" -ForegroundColor Yellow
            Write-Host "   Required:" -ForegroundColor Cyan
            Write-Host "   - MONGODB_URI (your MongoDB connection string)" -ForegroundColor Cyan
            Write-Host "   - JWT_SECRET (generate random string)" -ForegroundColor Cyan
            Write-Host "   - OPENAI_API_KEY (from https://platform.openai.com)" -ForegroundColor Cyan
            Write-Host ""
            
            $editNow = Read-Host "Open .env file for editing? (Y/n)"
            if ($editNow -ne "n" -and $editNow -ne "N") {
                notepad .env
            }
        }
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check if it's configured
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "your-.*-here" -or $envContent -match "change-this") {
        Write-Host "⚠️  .env needs configuration" -ForegroundColor Yellow
        Write-Host "   Edit required values before running" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .env appears configured" -ForegroundColor Green
    }
}

# Run verification script
Write-Host ""
Write-Host "Running setup verification..." -ForegroundColor Yellow
Write-Host ""

node verify-setup.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  Setup verification found issues" -ForegroundColor Yellow
    Write-Host "   Please fix errors before proceeding" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Offer to start servers
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$startServers = Read-Host "Start servers now? (Y/n)"

if ($startServers -ne "n" -and $startServers -ne "N") {
    Write-Host ""
    Write-Host "Starting servers..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  This will open 2 terminal windows:" -ForegroundColor Yellow
    Write-Host "   1. Backend server (port 5001)" -ForegroundColor Cyan
    Write-Host "   2. Frontend server (port 3001)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    # Start backend in new window
    Write-Host ""
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Backend Server (Port 5001)' -ForegroundColor Green; npm run server"
    
    Start-Sleep -Seconds 2
    
    # Start frontend in new window
    Write-Host "Starting frontend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server (Port 3001)' -ForegroundColor Green; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "✅ Servers starting..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Access application:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3001" -ForegroundColor Yellow
    Write-Host "  Backend:  http://localhost:5001/api" -ForegroundColor Yellow
    Write-Host "  Health:   http://localhost:5001/api/health" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3001"
    
} else {
    Write-Host ""
    Write-Host "To start servers manually:" -ForegroundColor Cyan
    Write-Host "  Terminal 1: npm run server" -ForegroundColor Yellow
    Write-Host "  Terminal 2: npm run dev" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Useful Commands" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "npm run server     - Start backend" -ForegroundColor Yellow
Write-Host "npm run dev        - Start frontend" -ForegroundColor Yellow
Write-Host "npm run seed       - Seed database" -ForegroundColor Yellow
Write-Host "npm run lint       - Check code" -ForegroundColor Yellow
Write-Host "node verify-setup  - Verify setup" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   README.md, FAQ.md, DEPLOYMENT.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
