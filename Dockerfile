FROM --platform=linux/amd64 node
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
EXPOSE 80
CMD ["CONF_FILE=./configuration/service2-definition.yaml", "npm", "--inspect=9229", "start"]