FROM nginx:latest
COPY . /usr/share/nginx/html
ARG BACKEND_API_URL
RUN sed -i 's|__API_URL__|'"$BACKEND_API_URL"'|g' /usr/share/nginx/html/index.html
EXPOSE 80