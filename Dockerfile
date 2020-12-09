FROM node:12.10-alpine

RUN mkdir -p /opt/wizeauth
WORKDIR /opt/wizeauth
COPY package.json /opt/wizeauth
RUN npm i -g typescript@latest ts-node

COPY . /opt/wizeauth/
RUN npm install


ENV NODE_ENV docker

# expose server and debug port
EXPOSE 3333 5858 443 8000

# run application
CMD ["ts-node-dev", "src/"]