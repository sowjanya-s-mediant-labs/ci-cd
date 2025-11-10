# Build and run Vite dev server for development
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

EXPOSE 5173

# Run Vite dev server bound to 0.0.0.0 for Docker
CMD ["npm", "run", "dev", "--", "--host"]

