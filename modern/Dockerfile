FROM node:latest as build
WORKDIR /app
COPY package.json .
RUN npm i --force
COPY . .
RUN npm run build

# FROM node:latest as prod
# WORKDIR /app
# COPY --from=build /app/build /app/build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

# COPY package.json .
# COPY vite.config.js .

# EXPOSE 3000
# CMD ["npm","run","dev"]