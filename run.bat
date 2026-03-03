@echo off
TITLE Sistema de Inscripcion - Manager
echo ==========================================
echo   Iniciando Sistema de Inscripcion
echo ==========================================

echo [1/2] Levantando Servidor Backend (Puerto 3001)...
start "Backend Server" cmd /k "cd backend && npx ts-node src/server.ts"

echo [2/2] Levantando Frontend React (Vite)...
start "Frontend Dev" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo  ¡Listo! El backend estara en http://localhost:3001
echo  El frontend te dara su URL en la otra ventana.
echo ==========================================
pause
