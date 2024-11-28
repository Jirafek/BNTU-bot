import TelegramBot from "node-telegram-bot-api";
import {Database} from "firebase/database";
import {getUser} from "../firebase/get-user";
import {buttons} from "../common/buttons";


export const onMain = async (msg: TelegramBot.Message, db: Database, bot: TelegramBot) => {
    const chatId = msg.chat.id;

    const user = await getUser(chatId, db);

    if (!user) {
        await bot.sendMessage(chatId, `Кажется мы вас не нашли, напишите /start для начала работы`);
    }

    await bot.sendMessage(chatId, `Привет, ${user?.usingName}\\!\n\nТвой Факультет \\- *${user?.faculty?.toUpperCase() ?? 'не указан'}*\nТвоя группа \\- *${user?.groupNumber ?? 'не указана'}*`, {
        parse_mode: "MarkdownV2",
        reply_markup: buttons.main,
    });
}
