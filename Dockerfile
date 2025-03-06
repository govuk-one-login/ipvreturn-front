FROM node:20.18.1-alpine3.19@sha256:50209a555b1016096a415de2c055bc88dffb31b5afbca0ac237f027a41cbbe6e
WORKDIR /usr/index

COPY . .

RUN [ "rm", "-rf", "node_modules" ]

COPY package*.json ./
RUN npm ci --only-production
RUN npm run build

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini"]

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT 8080
EXPOSE $PORT

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=CORE-FRONT-$RANDOM && tini npm start"]
CMD ["npm", "start"]
