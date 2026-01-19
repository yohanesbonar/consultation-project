# Multi-stage build for optimized K8s image size with standalone output
# Builder stage
FROM node:20.19.4-alpine3.22 AS builder

#1
WORKDIR /app

#2
# Copy package files
COPY package*.json ./

#3
# Install dependencies
RUN yarn install --frozen-lockfile

#4
# Copy application source
COPY . .

#5
# Build Next.js application (creates standalone output)
RUN rm -rf next/.next && \
    yarn run build

# Production stage - minimal runtime image
FROM node:20.19.4-alpine3.22 AS runner

#6
ENV HOME=/apps/consultation-project/

#7
WORKDIR $HOME

#8
# Create necessary directories and install runtime dependencies
RUN mkdir -p /apps/consultation-project/tmp/ && \
    apk add --no-cache curl tini && \
    rm -rf /var/cache/apk/*

#9
# Copy standalone output from builder
COPY --from=builder /app/next/.next/standalone ./
COPY --from=builder /app/next/.next/static ./next/.next/static
COPY --from=builder /app/next/public ./next/public
COPY --from=builder /app/public ./public

#10
EXPOSE 80

ENV PORT=80
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

#11
ENTRYPOINT ["/sbin/tini", "--"]

#12
# Start Next.js server directly (no need for yarn in production)
CMD ["node", "next/server.js"]