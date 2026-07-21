# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Serve Unified App
FROM node:18-alpine
WORKDIR /app

COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

RUN npx prisma generate
RUN npm run build

EXPOSE 5005

CMD ["npm", "start"]
