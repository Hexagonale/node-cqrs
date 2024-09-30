FROM node:21-alpine AS install
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
RUN npm cache clean --force

FROM node:21-alpine AS build
WORKDIR /usr/src/app

COPY --from=install /usr/src/app /usr/src/app
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

CMD [ "node", "build/index.js" ]

EXPOSE 80
