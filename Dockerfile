# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install necessary build tools
RUN apk add --no-cache python3 make g++ curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create a simple static server script using ES modules
RUN echo 'import http from "http"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { let filePath = path.join(__dirname, "dist", req.url === "/" ? "index.html" : req.url); if (!fs.existsSync(filePath)) filePath = path.join(__dirname, "dist", "index.html"); const ext = path.extname(filePath); const contentType = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpg", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon" }[ext] || "application/octet-stream"; fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(500); res.end("Error loading " + req.url); } else { res.writeHead(200, { "Content-Type": contentType }); res.end(content, "utf-8"); } }); }); server.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));' > server.js

# Print build info for debugging
RUN echo "=== Build Complete ===" && \
    echo "Node version: $(node --version)" && \
    echo "NPM version: $(npm --version)" && \
    echo "Working directory: $(pwd)" && \
    echo "Files in dist: $(ls -la dist/)" && \
    echo "======================"

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the application
CMD ["node", "server.js"]
