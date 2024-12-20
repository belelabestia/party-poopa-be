FROM node:alpine AS build
COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build

FROM node:alpine
COPY --from=build /app/dist /app
WORKDIR /app
CMD node index.js
