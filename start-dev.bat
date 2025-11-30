@echo off
setlocal
cd /d %~dp0
where node >nul 2>nul || (echo 未检测到 Node.js & pause & exit /b 1)
where npm >nul 2>nul || (echo 未检测到 npm & pause & exit /b 1)
IF NOT EXIST node_modules (
  call npm install
)
start "" cmd /c "npm run dev"
timeout /t 2 >nul
start "" http://localhost:5173/
exit /b 0
