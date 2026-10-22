@echo off
rem Double-click to run the Karin Travel site locally, then open http://localhost:3000
cd /d "%~dp0"
if not exist node_modules call npm install
start "" http://localhost:3000
call npm run dev

