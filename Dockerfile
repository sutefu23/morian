FROM node:14.17-alpine as builder


WORKDIR /app

ADD /app /app

RUN yarn install --frozen-lockfile --production=false
RUN yarn --cwd ./server install --frozen-lockfile --production=false

RUN yarn build

FROM node:14.17-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/server/index.js ./server/

EXPOSE 3000
CMD ["yarn", "start"]