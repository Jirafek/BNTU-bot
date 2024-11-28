# 1. Используем официальный Node.js образ с поддержкой TypeScript
FROM node:18-alpine

# 2. Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь проект в контейнер
COPY . .

# 6. Собираем TypeScript в JavaScript
RUN npm run build

# 7. Указываем команду по умолчанию для запуска приложения
CMD ["npm", "start"]
