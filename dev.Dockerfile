FROM --platform="linux/arm64" arm64v8/node:23.11.0-alpine3.21@sha256:213ab80c62f1cb54e6f1352e1a463aa18a73968f80c9f66b5c2b165bcff75070

WORKDIR /usr/index

COPY . .

RUN [ "rm", "-rf", "node_modules" ]

COPY package*.json ./
RUN npm ci --only-production
RUN npm run build

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini", "curl"]

# Add in dynatrace layer
# Removed as this implementation method is incompatible with arm64
#COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
#ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT 8080

HEALTHCHECK --interval=5s --timeout=2s --retries=10 \
  CMD curl -f http://localhost:8080/healthcheck || exit 1

EXPOSE $PORT

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=IpvReturn-FRONT-$RANDOM && tini npm start"]
CMD ["npm", "start"]
