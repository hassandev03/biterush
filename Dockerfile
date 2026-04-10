FROM node:20-alpine

WORKDIR /app

# We copy package-lock.json too to ensure the exact same versions are installed
COPY package.json package-lock.json ./

# installing all the libraries the app needs
RUN npm install

# copy the rest of the code into the container
COPY . .

RUN npm run build

# tell Docker the app runs on port 3000
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]
