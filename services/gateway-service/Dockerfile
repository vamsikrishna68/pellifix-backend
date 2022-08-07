# Pull official base image
FROM node:14-alpine AS BUILD_IMAGE

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json files
COPY package*.json ./

# Install NPM packages
RUN npm ci --only=production

# Copy source files
COPY --chown=node . .

# Build
RUN npm build

# Remove development dependencies
RUN npm prune --production

# Main Image
FROM node:14-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/server.js ./server.js
COPY --from=BUILD_IMAGE /usr/src/app/config ./config

# Expose Ports
EXPOSE 4000 9876

# Docker start command
CMD [ "node", "." ]
