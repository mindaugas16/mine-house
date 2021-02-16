# build stage
FROM node:12.16.1 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG API_HOST
ENV API_HOST=$API_HOST
RUN npm run build:prod

# production stage
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
