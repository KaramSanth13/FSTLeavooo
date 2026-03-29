FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

FROM nginx:alpine
# Safely copy Angular output resolving browser folder path structures
COPY --from=build /app/dist/client-angular /usr/share/nginx/html/temp
RUN cp -r /usr/share/nginx/html/temp/browser/* /usr/share/nginx/html/ 2>/dev/null || cp -r /usr/share/nginx/html/temp/* /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/temp
# Include SPA handling
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
