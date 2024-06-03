FROM node:14

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npx tsc

EXPOSE 3000

CMD [ "node", "dist/index.js" ]