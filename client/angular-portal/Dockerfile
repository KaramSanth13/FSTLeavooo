FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Try copying both possible dist paths to ensure nginx finds index.html
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist/angular-portal/** /usr/share/nginx/html/ 2>/dev/null || :
COPY --from=build /app/dist/angular-portal/browser/* /usr/share/nginx/html/ 2>/dev/null || :
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
