FROM node:18.16.0-alpine3.16@sha256:f47850733d8522489f57bfe86d790b1ee167a4b863d83d37572fb28cf10ec5e8
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
