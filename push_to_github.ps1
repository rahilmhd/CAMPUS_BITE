Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       CAMPUSBITE - GitHub Remote Push Utility" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$env:Path = "C:\Users\HP\AppData\Local\Programs\Git\cmd;C:\Users\HP\AppData\Local\Programs\Git\mingw64\bin;" + $env:Path

try {
    $gitVer = & git --version
    Write-Host "Using Git: $gitVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git binary could not be located." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "1. Pushing 'main' branch to https://github.com/rahilmhd/CAMPUS_BITE.git ..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "2. Pushing all feature branches (PR and commit graph overview) ..." -ForegroundColor Yellow
git push origin --all

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Push completed! Check your repository and GitHub profile:" -ForegroundColor Green
Write-Host "https://github.com/rahilmhd/CAMPUS_BITE" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
