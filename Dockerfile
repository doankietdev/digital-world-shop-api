# Dockerfile for Express Server
FROM node:18.18.2

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Transpile the source code
RUN yarn build

# Expose port 5600
EXPOSE 8080

# Command to run the Express server
CMD ["node", "build/server.js"]