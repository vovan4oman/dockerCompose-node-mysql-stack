FROM node:20
WORKDIR /usr/source/app
COPY ./app-files/* .
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN npm install
CMD ["npm", "test"]

