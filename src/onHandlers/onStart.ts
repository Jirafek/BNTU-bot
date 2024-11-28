import TelegramBot from "node-telegram-bot-api";
import { Database } from "firebase/database";
import { set, ref, child, get } from "firebase/database";
import {messagesFn} from "../common/messages";
import {buttons} from "../common/buttons";
import {getUser} from "../firebase/get-user";
import {TUser} from "../types";
import {clearText} from "../utils/clear-text";


export const onStart = async (msg: TelegramBot.Message, db: Database, bot: TelegramBot) => {
    const chatId = msg.chat.id;
    const nameOfUser = msg.from?.first_name || msg.from?.username || 'Аноним';

    const user = await getUser(chatId, db);

    if (!user) {
        await set(ref(db, `users/${chatId}`), {
            username: msg.from?.username,
            chatId,
            firstName : msg.from?.first_name,
            usingName: clearText(nameOfUser),
        } as TUser);
    }

    await bot.sendMessage(chatId, messagesFn.welcome(), {
        parse_mode: "MarkdownV2",
        reply_markup: buttons.welcome
    })
}
