# Stage 1: Build the Vite app
FROM node:20.3.1 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the app for production
RUN npm run build

# Stage 2: Serve using nginx
FROM nginx:alpine

# Clean existing nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for production
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
