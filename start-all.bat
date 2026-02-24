@echo off
REM Magnetic Apparels - Start All Apps
REM This script starts all 4 applications in parallel

echo.
echo ============================================
echo  🧲 Magnetic Apparels - Start All Apps
echo ============================================
echo.
echo Starting all 4 applications in separate windows...
echo.

REM Start Node API Server (Port 5000)
echo [1/4] Starting Node API (Port 5000)...
start "Node API" cmd /k cd "magnetic-apparels-node" && npm run dev

REM Give Node API time to start
timeout /t 2 /nobreak

REM Start Vue App (Port 5173)
echo [2/4] Starting Vue App (Port 5173)...
start "Vue App" cmd /k cd "magnetic-apparels-vue" && npm run dev

REM Start React App (Port 3000)
echo [3/4] Starting React App (Port 3000)...
start "React App" cmd /k cd "magnetic-apparels-react" && npm start

REM Start Angular App (Port 4200)
echo [4/4] Starting Angular App (Port 4200)...
start "Angular App" cmd /k cd "magnetic-apparels-angular" && npm start

echo.
echo ============================================
echo  ✅ All applications are starting...
echo ============================================
echo.
echo Services will be available at:
echo   • Node API:     http://localhost:5000/api
echo   • Vue App:      http://localhost:5173
echo   • React App:    http://localhost:3000
echo   • Angular App:  http://localhost:4200
echo.
echo Note: Each app will open in a separate terminal window.
echo Close the individual windows to stop each service.
echo.
pause