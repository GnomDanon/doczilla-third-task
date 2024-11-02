FROM nginx:latest
COPY . /usr/share/nginx/html
RUN sed -i 's|__API_URL__|'"${API_URL:-http://localhost:8080/api}"'|g' /usr/share/nginx/html/index.html
EXPOSE 80