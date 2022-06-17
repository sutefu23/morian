FROM node:14.17-alpine


WORKDIR /app

ADD /app /app

EXPOSE  3000
EXPOSE  8000

RUN yarn install
RUN yarn --cwd ./server install

RUN export PATH=$PATH:./node_modules/.bin
RUN export PATH=$PATH:./server/node_modules/.bin

CMD yarn build && yarn --cwd ./server migrate:prod && yarn start
