FROM node:16.13-alpine as builder

RUN mkdir server
WORKDIR /server

ADD . /server

RUN yarn install --frozen-lockfile
RUN export PATH=$PATH:./node_modules/.bin

ARG MODE=production
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

EXPOSE 30743
CMD ["yarn", "start"]