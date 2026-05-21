@echo off
color 0A
echo =====================================================================
echo                CREWFLOW GIT PUSH AUTOMATION SCRIPT
echo =====================================================================
echo.

:: Ensure we are working inside the script's directory
cd /d "%~dp0"

echo [1/6] Initializing Local Git Repository...
git init
echo.

echo [2/6] Staging Project Files (Respecting .gitignore boundaries)...
git add .
echo.

echo [3/6] Creating Initial Production Commit...
git config user.email >nul 2>&1
if errorlevel 1 (
    git config user.email "aastha@example.com"
    git config user.name "Aastha"
)
git commit -m "feat: initial commit for CrewFlow team task manager"
echo.

echo [4/6] Setting Default Branch to Main...
git branch -M main
echo.

echo [5/6] Linking Workspace to GitHub Repository...
:: Clear existing remote if present to avoid collisions
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Aastha-debug/CrewFlow.git
echo Remote linked to: https://github.com/Aastha-debug/CrewFlow.git
echo.

echo [6/6] Pushing codebase to GitHub (Auth prompt may appear)...
git push -u origin main
echo.

echo =====================================================================
echo   Process completed! Your files are now being pushed to GitHub.
echo =====================================================================
echo.
pause
