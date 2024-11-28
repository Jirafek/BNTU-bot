import TelegramBot from 'node-telegram-bot-api';
import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import express from 'express';
import dotenv from 'dotenv';
import {onStart} from "./onHandlers/onStart";
import {onCallback} from "./onHandlers/onCallback";
import {onMain} from "./onHandlers/onMain";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

const bot = new TelegramBot(TOKEN, {polling: true});
const app = express();
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

bot.onText(/\/start/, async (msg) => await onStart(msg, database, bot));
bot.onText(/\/main/, async (msg) => await onMain(msg, database, bot));
bot.on("callback_query", async (query) => await onCallback(query, database, bot));


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
