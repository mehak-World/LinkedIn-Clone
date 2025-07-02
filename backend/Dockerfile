# ---------------------
# Stage 1: Build dependencies
# ---------------------
FROM node:20.3.1 AS builder

WORKDIR /app

# Install only what's needed to install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# ---------------------
# Stage 2: Production image
# ---------------------
FROM node:20.3.1-slim

WORKDIR /app

# Only copy what's needed from build
COPY --from=builder /app /app


# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
