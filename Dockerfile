FROM node:16-alpine

WORKDIR /app

EXPOSE 4002

COPY package.* .
RUN npm i

ENV NODE_ENV production

COPY . .
RUN npm run build
CMD npm start