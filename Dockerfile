# === TAHAP 1: BUILD FRONTEND ===
# Kita sebut tahap ini 'builder'
FROM node:18-alpine AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Buat file .env dengan variabel environment menggunakan Hugging Face secrets
RUN --mount=type=secret,id=REACT_APP_OPENROUTER_API_KEY,mode=0444,required=false \
    echo "REACT_APP_OPENROUTER_API_KEY=$(cat /run/secrets/REACT_APP_OPENROUTER_API_KEY 2>/dev/null)" >> .env 
RUN sed -i "s|baseURL:.*|baseURL: '/api',|" src/api.js

# Jalankan proses build React
RUN npm run build


# === TAHAP 2: SETUP BACKEND & GABUNGKAN ===
FROM node:18-alpine
WORKDIR /app
COPY proyek-kopi-backend/package*.json ./
RUN npm install --production
COPY proyek-kopi-backend/ ./
EXPOSE 7860

# Jalankan server backend
CMD ["npm", "--no-warnings", "start"]
