FROM node:10

ENV PATH=$PATH:/github/workspace/node_modules/.bin
COPY . /github/workspace
RUN npm install --production

ENTRYPOINT ["probot", "receive"]
CMD ["/github/workspace/lib/index.js"]