# stage 1
FROM node:12.16.1 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
RUN npm run build

# stage 2
FROM node:12.16.1

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
RUN npm install pm2 -g
COPY --from=builder /usr/src/app/dist ./dist

WORKDIR ./dist

CMD ["pm2-runtime", "src/index.js"]

