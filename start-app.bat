@echo off

echo Starting Backend...
cd back_end
start cmd /k "npm run dev"

echo Starting Frontend...
cd ../client
start cmd /k "npm run dev"

echo All services started!
pause