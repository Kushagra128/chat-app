# Use a standard Node.js image
FROM node:16

# Set working directory for the frontend
WORKDIR /app/public

# Copy frontend package.json and install dependencies
COPY public/package*.json ./
RUN npm install

# Run the frontend build command
RUN npm run build

# Set working directory for the backend
WORKDIR /app/server

# Copy backend package.json and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy backend files
COPY server .

# Copy frontend build output to the location served by the backend
COPY public/build /app/public/public

# Expose the backend port
EXPOSE 5000

# Command to start the backend
CMD ["npm","start"]
