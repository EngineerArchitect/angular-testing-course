# Use Node.js as base image
FROM node:20

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the project files
COPY . .

# Set Chromium path for headless testing
ENV CHROME_BIN=/usr/bin/chromium

# Run Angular unit tests in headless mode and generate coverage
CMD ["npm", "run", "test", "--", "--no-watch", "--no-progress", "--browsers=ChromeHeadless", "--code-coverage", "--reporters=lcov"]
