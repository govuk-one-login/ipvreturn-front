FROM --platform="linux/arm64" arm64v8/node@sha256:33f012246d4d73dfea86ec6600d12d1c476a72102a55480ee7fc3c7709752e9d
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
