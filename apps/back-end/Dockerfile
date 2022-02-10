FROM node:lts-alpine
WORKDIR /back-end
COPY ./dist/apps/back-end .
RUN yarn install
# dependencies that nestjs needs
RUN yarn add pino-http-print reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js