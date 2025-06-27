# Fase 1: Build Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration production --output-path=dist/gestionCitasMedicas
#npm run build

# Fase 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/gestionCitasMedicas/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf