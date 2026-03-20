#!/bin/bash
# ChantierOps - Script de démarrage

echo "🏗️  ChantierOps - Démarrage..."

# Vérifier si .env existe
if [ ! -f backend/.env ]; then
  echo "⚠️  Copie du fichier .env exemple..."
  cp backend/.env.example backend/.env
  echo "✅ Editez backend/.env avec vos clés Twilio avant de continuer!"
fi

# Option 1: Docker Compose
if command -v docker-compose &> /dev/null; then
  echo "🐳 Démarrage avec Docker Compose..."
  docker-compose up -d postgres
  sleep 3
  docker-compose up --build backend frontend
else
  echo "💡 Docker non disponible - démarrage manuel..."

  # Backend
  echo "📦 Installation backend..."
  cd backend && npm install && npx prisma generate && npx prisma migrate dev --name init && npm run seed
  echo "🚀 Démarrage backend (port 3001)..."
  npm run start:dev &

  # Frontend
  cd ../frontend
  echo "📦 Installation frontend..."
  npm install
  echo "🚀 Démarrage frontend (port 3000)..."
  npm run dev &

  echo ""
  echo "✅ ChantierOps démarré!"
  echo "   Frontend: http://localhost:3000"
  echo "   Backend:  http://localhost:3001"
  echo "   API Docs: http://localhost:3001/api/docs"
fi
