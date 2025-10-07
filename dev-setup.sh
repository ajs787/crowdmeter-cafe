#!/bin/bash

# CrowdMeter Auto-Setup Script
# This script starts the backend server and automatically seeds/refreshes cafe data

echo "🚀 Starting CrowdMeter Backend..."

# Start the backend server in the background
npm run dev &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 3

echo "🌱 Seeding cafe data..."
curl -X POST http://localhost:5175/api/cafes/seed

echo "⏳ Waiting before refreshing popularity data..."
sleep 5

echo "🔄 Refreshing live popularity data..."
curl -X POST http://localhost:5175/api/cafes/refresh

echo ""
echo "✅ Setup complete! Your backend is running with fresh data."
echo "🌐 Backend: http://localhost:5175"
echo "📊 API: http://localhost:5175/api/cafes"
echo "🔄 Auto-refreshing popularity data every 7 minutes..."
echo ""
echo "Press Ctrl+C to stop the server"

# Function to refresh data
refresh_data() {
    local current_time=$(date +"%H:%M:%S")
    echo ""
    echo "⏰ [$current_time] Auto-refreshing popularity data..."
    curl -X POST http://localhost:5175/api/cafes/refresh
    echo "✅ [$current_time] Refresh completed"
}

# Set up auto-refresh every 7 minutes (420 seconds)
while true; do
    sleep 420  # 7 minutes
    refresh_data
done &

# Wait for the server process
wait $SERVER_PID