# Use Node.js official image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app listens on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
