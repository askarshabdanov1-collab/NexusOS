@echo off
echo ==============================================
echo Nexus Academy - GitHub Push Helper
echo ==============================================
echo.
echo Running: git push -u origin main
echo.
git push -u origin main
echo.
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Make sure you logged in when prompted.
) else (
    echo [SUCCESS] Code successfully pushed to GitHub!
)
echo.
pause
