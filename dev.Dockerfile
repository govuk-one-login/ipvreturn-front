FROM --platform="linux/arm64" arm64v8/node@sha256:7a62efb65ffafd0f67683db3e74887b085f4f8f1552a8281c371174e932963a6
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
