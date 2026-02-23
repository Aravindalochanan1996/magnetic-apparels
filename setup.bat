@echo off
echo ============================================
echo   Magnetic Apparels - Setup Script (Windows)
echo ============================================
echo.

echo [1/4] Installing Node API dependencies...
cd magnetic-apparels-node
call npm install
cd ..

echo.
echo [2/4] Installing Vue dependencies...
cd magnetic-apparels-vue
call npm install
cd ..

echo.
echo [3/4] Installing React dependencies...
cd magnetic-apparels-react
call npm install
cd ..

echo.
echo [4/4] Installing Angular dependencies...
cd magnetic-apparels-angular
call npm install
cd ..

echo.
echo ============================================
echo   All dependencies installed successfully!
echo ============================================
echo.
echo Now open 4 terminal windows and run:
echo.
echo   Terminal 1 (Node API):
echo     cd magnetic-apparels-node ^&^& npm run dev
echo.
echo   Terminal 2 (Vue - Login/Cart/Payment):
echo     cd magnetic-apparels-vue ^&^& npm run dev
echo.
echo   Terminal 3 (React - Dashboard):
echo     cd magnetic-apparels-react ^&^& npm start
echo.
echo   Terminal 4 (Angular - Shell):
echo     cd magnetic-apparels-angular ^&^& npm start
echo.
echo   Then open: http://localhost:5173
echo ============================================
pause
