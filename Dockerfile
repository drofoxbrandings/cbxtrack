# Use the official Node.js 14 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

ENV PORT 8080
ENV CONNECTION_URL mongodb+srv://drofoxbrandings:W5wBPMigwggFvXr5@cityboxcargos.zjpt9p4.mongodb.net/cityboxcargos
ENV JWT_SECRET bBxNsGYmdWXPiJAmrpeIcGYRzESePZriiGfxjZnxiChjddusFe
EXPOSE 8080

# Set the command to start your app
CMD ["npm", "start"]