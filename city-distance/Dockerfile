# Build step
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production step: use a tiny static file server
FROM nginx:stable-alpine

# Copy built files to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional, explained below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
