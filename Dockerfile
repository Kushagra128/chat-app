FROM node:16

WORKDIR /app
COPY server/package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm install && npm cache clean --force
RUN npm uninstall bcrypt
RUN npm install bcrypt --build-from-source
COPY . .
EXPOSE 5000

CMD ["npm","start"]