FROM --platform="linux/arm64" arm64v8/node@sha256:bb763effd1c4d031778c70638230622818a08a9709cd33d540d902b8b042b35e
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
