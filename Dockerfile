FROM node:20.2.0-alpine3.16@sha256:f9b54b46639a9017b39eba677cf44c8cb96760ca69dadcc1d4cbd1daea753225
WORKDIR /usr/index
COPY package*.json ./
RUN npm ci --only-production
COPY . .
RUN npm run build

ENV PORT 8080
EXPOSE $PORT

CMD ["npm", "start"]
