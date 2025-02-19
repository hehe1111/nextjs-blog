
FROM node:12
# Create app directory
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --production=true
COPY ./.next/ ./.next/
EXPOSE 3000
CMD [ "yarn", "start" ]
