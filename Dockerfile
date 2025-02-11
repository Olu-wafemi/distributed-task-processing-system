FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*


COPY . .

RUN npx prisma generate --no-engine

EXPOSE 8000

CMD ["npm", "start"]

