FROM node:10

ENV PATH=$PATH:./node_modules/.bin

COPY . .
RUN npm install --production

ENTRYPOINT ["probot", "receive"]
CMD ["./lib/index.js"]