FROM node:10

ENV PATH=$PATH:./node_modules/.bin
ENV LOG_LEVEL=debug

COPY . .
RUN npm install --production

ENTRYPOINT ["probot", "receive", "./lib/index.js"]