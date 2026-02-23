#!/bin/bash
echo "============================================"
echo "  Magnetic Apparels - Setup Script (Mac/Linux)"
echo "============================================"
echo ""

echo "[1/4] Installing Node API dependencies..."
cd magnetic-apparels-node && npm install && cd ..

echo ""
echo "[2/4] Installing Vue dependencies..."
cd magnetic-apparels-vue && npm install && cd ..

echo ""
echo "[3/4] Installing React dependencies..."
cd magnetic-apparels-react && npm install && cd ..

echo ""
echo "[4/4] Installing Angular dependencies..."
cd magnetic-apparels-angular && npm install && cd ..

echo ""
echo "============================================"
echo "  All dependencies installed!"
echo "============================================"
echo ""
echo "Open 4 terminals and run:"
echo ""
echo "  Terminal 1 → cd magnetic-apparels-node && npm run dev"
echo "  Terminal 2 → cd magnetic-apparels-vue  && npm run dev"
echo "  Terminal 3 → cd magnetic-apparels-react && npm start"
echo "  Terminal 4 → cd magnetic-apparels-angular && npm start"
echo ""
echo "  Then open: http://localhost:5173"
echo "============================================"
