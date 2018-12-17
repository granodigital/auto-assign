FROM node:10-slim

LABEL "com.github.actions.name"="Auto Assign"
LABEL "com.github.actions.description"="Assign issues and PRs automatically"
LABEL "com.github.actions.icon"="at-sign"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/granodigital/grano-github-actions"
LABEL "homepage"="https://github.com/granodigital/grano-github-actions/auto-assign"
LABEL "maintainer"="Grano Digital <digital.helsinki@grano.fi>"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /

RUN npm ci

COPY . /

ENTRYPOINT ["node", "/entrypoint.js"]