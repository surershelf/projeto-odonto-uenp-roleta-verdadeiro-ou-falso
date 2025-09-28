# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Build de produção
RUN npm run build

# Etapa 2: Servir com Nginx (leve)
FROM nginx:alpine

# Remove arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
