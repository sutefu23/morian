FROM node:14.17-alpine

WORKDIR /app

ADD /app /app

EXPOSE  8000
EXPOSE  30743
EXPOSE  5555
RUN rm -f yarn.lock
RUN yarn install
RUN yarn global add prisma

CMD ["yarn" , "dev"]

