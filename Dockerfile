FROM node:20-alpine AS builder

WORKDIR /app

# Variables d'environnement pour Vite (lues au moment du build)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le code et construire
COPY . .
RUN npm run build

FROM nginx:alpine

# Copier les fichiers statiques buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration nginx pour SPA React (gestion des routes)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

