FROM selenium/node-chrome

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY src/webdriver/package*.json src/webdriver/

USER root

RUN apt-get update --fix-missing && \
    apt-get upgrade -y && \
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
    apt-get install -y nodejs

RUN npm ci && \
    cd src/webdriver && \
    npm ci

# Bundle app source
COPY . .

RUN sed -i -e 's/localhost/chat-server/g' package.json

EXPOSE 3000

CMD [ "npm", "start" ]