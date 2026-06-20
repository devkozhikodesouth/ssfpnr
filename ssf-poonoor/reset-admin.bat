@echo off
REM Double-click this file to repair the Super Admin login.
REM It runs scripts\reset-admin.js against your MongoDB Atlas database
REM (same DB production uses) and then waits so you can read the output.
cd /d "%~dp0"
echo Running admin reset...
echo.
node scripts\reset-admin.js
echo.
echo ----------------------------------------------------------------
echo Done. Read the result above, then close this window.
pause
