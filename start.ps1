# CampusBite 1-Command Launcher for PowerShell
$env:Path = 'C:\Users\HP\AppData\Local\Programs\nodejs;' + $env:Path
$root = $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       CAMPUSBITE - SMART CAMPUS FOOD PLATFORM" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Backend API (Port 5000)..." -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = 'C:\Users\HP\AppData\Local\Programs\nodejs;' + `$env:Path; Set-Location '$root\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Client (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = 'C:\Users\HP\AppData\Local\Programs\nodejs;' + `$env:Path; Set-Location '$root\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "✓ Both servers launched successfully!" -ForegroundColor Green
