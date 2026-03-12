FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build the app (needs devDependencies like remix, prisma, typescript)
RUN npm run build

# Remove devDependencies and CLI packages after build
RUN npm prune --omit=dev --ignore-engines
RUN npm remove @shopify/cli || true

ENV NODE_ENV=production

CMD ["npm", "run", "docker-start"]
