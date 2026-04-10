# 1. Use Node.js version 20 as our base
FROM node:20-alpine

# 2. Create a folder named /app inside the container
WORKDIR /app

# 3. Copy your project's dependency files first
# We copy package-lock.json too to ensure the exact same versions are installed
COPY package.json package-lock.json ./

# 4. Install all the libraries your app needs
RUN npm install

# 5. Copy the rest of your project code into the container
COPY . .

# 6. Build your Next.js application
# This creates the .next folder that runs the app
RUN npm run build

# 7. Tell Docker the app runs on port 3000
EXPOSE 3000
ENV PORT=3000

# 8. Start the application
# This runs the production server
CMD ["npm", "start"]
