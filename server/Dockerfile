# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files and install production deps
COPY package*.json ./
RUN npm run deploy

# Copy the rest of the application
COPY . .

# Expose the port your app uses
EXPOSE 8000

# Start the app
CMD ["node", "index.js"]
