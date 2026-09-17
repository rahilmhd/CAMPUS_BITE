@echo off
setlocal
echo ========================================================
echo       CAMPUSBITE - GitHub Remote Push Utility
echo ========================================================
echo.

set "PATH=C:\Users\HP\AppData\Local\Programs\Git\cmd;C:\Users\HP\AppData\Local\Programs\Git\mingw64\bin;%PATH%"

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git binary could not be located.
    pause
    exit /b 1
)

echo Checking Git status...
git status
echo.
echo Pushing 'main' branch to https://github.com/rahilmhd/CAMPUS_BITE.git...
git push -u origin main

echo.
echo Pushing feature branches to GitHub to display PR history and branch graph...
git push origin --all

echo.
echo ========================================================
echo [SUCCESS] Push completed! Check your repository:
echo https://github.com/rahilmhd/CAMPUS_BITE
echo ========================================================
pause
