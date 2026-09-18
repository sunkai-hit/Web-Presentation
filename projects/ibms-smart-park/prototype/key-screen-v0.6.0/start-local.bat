@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PORT=8092
echo.
echo ========================================
echo  IBMS Smart Park V0.6.0 BIM
echo ========================================
echo Local URL: http://127.0.0.1:%PORT%/
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%/"
  py -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%/"
  python -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)
echo Python not found. Please install Python 3 or use another local HTTP server.
pause
