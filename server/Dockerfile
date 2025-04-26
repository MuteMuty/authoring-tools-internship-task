# Use official Node.js LTS version
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other server files
COPY . .

# Expose port 3000 to outside
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
