
FROM node:16 as builder
WORKDIR /app/server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run seed
COPY database.sqlite3 .
RUN chmod -R 777 ./database.sqlite3
RUN npm prune --production
EXPOSE 3001
CMD [ "npm" , "run", "start:prod" ]