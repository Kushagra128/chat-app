FROM node:16-alpine

WORKDIR /app
COPY server/package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 5000

CMD ["npm","start"]