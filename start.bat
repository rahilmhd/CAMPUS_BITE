@echo off
title CampusBite Launcher
echo ========================================================
echo        CAMPUSBITE - SMART CAMPUS FOOD PLATFORM
echo ========================================================
echo Starting Backend API and Frontend Web Client...

set "PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%PATH%"

start "CampusBite Backend (Port 5000)" cmd /k "set PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%%PATH%% && cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

start "CampusBite Frontend (Port 5173)" cmd /k "set PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%%PATH%% && cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo ========================================================
echo Both servers are now running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================================
