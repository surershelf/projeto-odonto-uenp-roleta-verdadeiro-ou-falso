# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Build de produção (Vite gera /dist)
RUN npm run build

# Etapa 2: Servir com Nginx (leve)
FROM nginx:alpine

# Remove arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx (opcional, recomendado p/ SPA + Firebase)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
