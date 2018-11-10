FROM node:8

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app
COPY package*.json ./
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
