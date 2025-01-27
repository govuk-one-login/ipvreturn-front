FROM --platform="linux/arm64" arm64v8/node:20.18.2-alpine3.21@sha256:ca79c9f7be0fd2d07a479d71b38e9bcbae1458151f29003af33f6f61fb2113bf AS builder

WORKDIR /usr/index
COPY package*.json ./
RUN npm ci --only-production
COPY . .
RUN npm run build

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT 8080
EXPOSE $PORT

CMD ["npm", "start"]
