#!/bin/bash

# Start MongoDB
mkdir -p /tmp/mongodb-data
mongod --dbpath /tmp/mongodb-data --port 27017 --bind_ip 127.0.0.1 --fork --logpath /tmp/mongodb.log

echo "[start] MongoDB started"

# Start backend on port 5001
node server/src/server.js &
BACKEND_PID=$!
echo "[start] Backend started (PID $BACKEND_PID)"

# Wait for backend to be ready
sleep 2

# Start Vite frontend on port 5000
exec npx vite --port 5000 --host 0.0.0.0
