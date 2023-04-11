FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

COPY .env.example .env

EXPOSE 3000

CMD ["node","app.js"]