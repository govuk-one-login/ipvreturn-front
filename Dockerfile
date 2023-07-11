FROM node:20.0.0-alpine3.16@sha256:9deef8525f0d78ea59ab6018941095d1ba00959939224753136e18ffeaf4d801
WORKDIR /usr/index
COPY package*.json ./
RUN npm ci --only-production
COPY . .
RUN npm run build

ENV PORT 8080
EXPOSE $PORT

CMD ["npm", "start"]
