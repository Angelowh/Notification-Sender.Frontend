FROM node:20 AS build

WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Constrói a aplicação em modo de produção
RUN npm run build -- --output-path=./dist --configuration=production

FROM nginx:alpine AS final

COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expõe a porta 80 para acesso via navegador
EXPOSE 80