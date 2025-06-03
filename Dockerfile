# Stage 1: Build the Bun/Elysia application
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Expose the port your Elysia app listens on (e.g., 3000)
# Elysia should be configured to listen on process.env.PORT or default to 3000.
# Render automatically injects the PORT env variable.
EXPOSE 3001

# Command to run your compiled Elysia application
CMD ["bun", "src/index.ts"]