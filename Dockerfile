FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html wishlist.html shared.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
EXPOSE 80
