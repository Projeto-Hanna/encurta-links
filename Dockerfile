# Stage 1: Base image
FROM node:24-alpine3.21 AS base

WORKDIR /usr/src/app

# Stage 2: Builder for building application and dependencies
FROM base AS builder

# Set default dummy DATABASE_URL for build time checks
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placeholder"

# Copy configuration and package details first (layer caching)
COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/
COPY prisma.config.ts ./

# Install all dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Generate Prisma Client
RUN yarn prisma generate

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Clean and install only production dependencies to save space and reduce vulnerabilities
# We temporarily back up the generated Prisma Client since pruning node_modules deletes it.
RUN mkdir -p /tmp/prisma && cp -R node_modules/.prisma node_modules/@prisma /tmp/prisma/ \
    && rm -rf node_modules \
    && yarn install --production --frozen-lockfile && yarn cache clean \
    && cp -R /tmp/prisma/.prisma /tmp/prisma/@prisma node_modules/

# Stage 3: Runner for clean production execution
FROM base AS runner

# Set production environment flags
ENV NODE_ENV=production

# Copy compiled files and production dependencies with non-privileged user permissions
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts

# Switch execution context to standard non-root user
USER node

# Expose the application port
EXPOSE 3000

# Start NestJS backend
CMD ["node", "dist/main"]