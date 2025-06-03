# Stage 1: Build the Bun/Elysia application
FROM oven/bun:1

WORKDIR /app

# Install OpenSSL libraries needed by Prisma
RUN apt-get update -y && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy your prisma directory and generate the client
COPY prisma ./prisma
RUN bun prisma generate 

# Copy the rest of your application code
COPY . .

# Expose the port your Elysia app listens on (e.g., 3000)
# Ensure your Elysia app is configured to listen on process.env.PORT or default to 3000.
# Render automatically injects the PORT env variable.
EXPOSE 3001

# Command to run your Elysia application
CMD ["bun", "src/index.ts"]