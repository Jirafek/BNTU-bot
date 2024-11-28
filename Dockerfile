# Используем официальный Node.js образ с поддержкой TypeScript
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код проекта в контейнер
COPY . .

# Создаем папку для компиляции TypeScript, если ее нет
RUN mkdir -p dist

# Собираем TypeScript в JavaScript
RUN npm run build

# Указываем команду по умолчанию для запуска приложения
CMD ["npm", "start"]
