FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 8080

# Démarrer l'application
CMD ["npm", "start"]