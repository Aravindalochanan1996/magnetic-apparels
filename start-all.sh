#!/bin/bash

# Magnetic Apparels - Start All Apps
# This script starts all 4 applications in parallel

echo ""
echo "============================================"
echo "  🧲 Magnetic Apparels - Start All Apps"
echo "============================================"
echo ""
echo "Starting all 4 applications in parallel..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all applications..."
    kill $NODE_PID $VUE_PID $REACT_PID $ANGULAR_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Start Node API Server (Port 5000)
echo "[1/4] Starting Node API (Port 5000)..."
cd magnetic-apparels-node && npm run dev &
NODE_PID=$!

# Give Node API time to start
sleep 2

# Start Vue App (Port 5173)
echo "[2/4] Starting Vue App (Port 5173)..."
cd ../magnetic-apparels-vue && npm run dev &
VUE_PID=$!

# Start React App (Port 3000)
echo "[3/4] Starting React App (Port 3000)..."
cd ../magnetic-apparels-react && npm start &
REACT_PID=$!

# Start Angular App (Port 4200)
echo "[4/4] Starting Angular App (Port 4200)..."
cd ../magnetic-apparels-angular && npm start &
ANGULAR_PID=$!

echo ""
echo "============================================"
echo "  ✅ All applications are starting..."
echo "============================================"
echo ""
echo "Services will be available at:"
echo "  • Node API:     http://localhost:5000/api"
echo "  • Vue App:      http://localhost:5173"
echo "  • React App:    http://localhost:3000"
echo "  • Angular App:  http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for all background processes
wait