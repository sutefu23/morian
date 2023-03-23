FROM node:16.13-alpine as builder


WORKDIR /app

ADD . /app

RUN yarn install --frozen-lockfile
RUN yarn --cwd ./server install --frozen-lockfile
RUN export PATH=$PATH:./node_modules/.bin

ARG PORT
ARG API_BASE_PATH
ARG API_DATABASE_URL
ARG API_JWT_SECRET
ARG API_ORIGIN
ARG API_SALT
ARG API_SERVER_PORT
ARG API_UPLOAD_DIR
ARG DEFAULT_USER_PASS
ARG HOST
ARG NODE_ENV

RUN yarn build
RUN yarn --cwd ./server build
ENTRYPOINT ["ash"]