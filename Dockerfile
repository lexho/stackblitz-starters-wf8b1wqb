FROM node:22.13.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p uploads
EXPOSE 8080
USER node
CMD [ "npm", "start" ]