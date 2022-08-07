# Pull official base image
FROM node:14-alpine AS BUILD_IMAGE

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json files
COPY package*.json ./

# Install NPM packages
RUN yarn install

# Copy source files
COPY --chown=node . .

# Build
RUN yarn build

# Main Image
FROM node:14-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/ ./

# Expore Ports
EXPOSE 3000

# Docker start command
CMD [ "node", "." ]
