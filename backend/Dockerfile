FROM node:12.16.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

#COPY dev.env.js ./dist/
#WORKDIR ./dist

EXPOSE 3000

#CMD node src/app.js

CMD ["npm", "start"]
