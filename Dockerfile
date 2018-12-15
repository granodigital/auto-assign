FROM node:10-slim

ENV PATH=$PATH:/github/workspace/node_modules/.bin

WORKDIR /github/workspace
COPY . .
RUN npm install --production

ENTRYPOINT ["probot", "receive"]
CMD ["/github/workspace/lib/index.js"]