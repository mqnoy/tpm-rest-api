# Builder
FROM node:20.13.1 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn build

# Runner
FROM node:20.13.1

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./

RUN yarn install --production --frozen-lockfile

RUN  yarn global add ts-migrate-mongoose

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]