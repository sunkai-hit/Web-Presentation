@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo IBMS Smart Park V0.3.1
echo Starting local server at http://127.0.0.1:8080/
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8080/"
  py -m http.server 8080 --bind 127.0.0.1
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8080/"
  python -m http.server 8080 --bind 127.0.0.1
  goto :eof
)
echo Python not found.
echo Install Python or run any local HTTP server in this directory.
pause
