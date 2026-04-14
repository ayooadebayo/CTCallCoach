FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy all package.json files for dependency resolution
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-schemas/package.json ./packages/shared-schemas/
COPY packages/workflow-config/package.json ./packages/workflow-config/
COPY packages/content-bundles/package.json ./packages/content-bundles/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

# Generate Prisma client
RUN cd apps/api && pnpm exec prisma generate

# Build all packages then the API
RUN pnpm --filter @ctcc/shared-types build
RUN pnpm --filter @ctcc/shared-schemas build
RUN pnpm --filter @ctcc/workflow-config build
RUN pnpm --filter @ctcc/content-bundles build
RUN pnpm --filter api build

EXPOSE 3001
CMD ["node", "apps/api/dist/server/index.js"]
