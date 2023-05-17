#FROM node:lts-alpine
FROM node:16.17.0-alpine3.15@sha256:a60b681e1c28f60ea63f8394dea5384c69bdc464b9655e880f74aafaa5945665
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only-production
COPY . .
RUN npm run build
RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini"]


#FROM node:16.17.0-alpine3.15@sha256:a60b681e1c28f60ea63f8394dea5384c69bdc464b9655e880f74aafaa5945665 AS builder
#
#WORKDIR /app
#
#COPY package.json yarn.lock ./
#COPY /src ./src
#
#RUN npm install
#RUN npm build
#
## 'yarn install --production' does not prune test packages which are necessary
## to build the app. So delete nod_modules and reinstall only production packages.
#RUN [ "rm", "-rf", "node_modules" ]
#RUN yarn install --production --frozen-lockfile
#
#FROM node:16.17.0-alpine3.15@sha256:a60b681e1c28f60ea63f8394dea5384c69bdc464b9655e880f74aafaa5945665 AS final
#
#RUN ["apk", "--no-cache", "upgrade"]
#RUN ["apk", "add", "--no-cache", "tini"]
#
#WORKDIR /app
#
## Copy in compile assets and deps from build container
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/package.json ./
#COPY --from=builder /app/yarn.lock ./
#COPY --from=builder /app/src ./src


ENV PORT 8080
EXPOSE $PORT

ENTRYPOINT ["tini", "--"]

CMD ["npm", "start"]
