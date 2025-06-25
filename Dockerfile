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
COPY backend/package*.json ./
RUN npm install --production
COPY proyek-kopi-backend/ ./

# INI BAGIAN KUNCINYA:
# Salin hasil build frontend dari tahap 'builder' ke dalam folder 'build' di backend
COPY --from=builder /app/frontend/build ./build
# Buat file .env dengan variabel environment menggunakan Hugging Face secrets
RUN --mount=type=secret,id=REACT_APP_OPENROUTER_API_KEY,mode=0444,required=false \
    echo "REACT_APP_OPENROUTER_API_KEY=$(cat /run/secrets/REACT_APP_OPENROUTER_API_KEY 2>/dev/null)" >> .env && \
    echo "JWT_SECRET=bismillahnilaiA" >> .env
# Buka port yang akan digunakan oleh Railway
EXPOSE 7860

# Jalankan server backend
CMD ["npm", "start"]