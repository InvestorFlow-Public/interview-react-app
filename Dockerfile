ARG NODE_VERSION=20.19.0-alpine
FROM node:${NODE_VERSION} AS builder

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

WORKDIR /app
COPY my-app/package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY my-app .
RUN npm run build

FROM node:${NODE_VERSION} AS runner

ENV NODE_ENV=production

WORKDIR /app
COPY --link --from=builder /app/build ./build
RUN --mount=type=cache,target=/root/.npm npm install serve@^14.2.6 --omit=dev

USER node

EXPOSE 3000

RUN ls -lah
CMD ["npx", "serve", "-s", "build", "-l", "3000"]