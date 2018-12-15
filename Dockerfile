FROM node:10-slim

WORKDIR /probot
COPY . .
RUN npm install --production

ENTRYPOINT ["./node_modules/.bin/probot", "receive", "./lib/index.js"]