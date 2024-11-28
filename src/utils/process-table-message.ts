import {TTab, TUser} from "../types";
import {Database} from "firebase/database";
import TelegramBot from "node-telegram-bot-api";
import {getUser} from "../firebase/get-user";
import {buttons, buttonsFn} from "../common/buttons";
import {clearText} from "./clear-text";
import {updateUser} from "../firebase/update-user";
import {getTableMessageData} from "./rebuild-table-message";
import {onStart} from "../onHandlers/onStart";


export const processTableMessage = async (message: TelegramBot.Message, tableData: TTab[] | null, transferredUser: TUser | undefined, chatId: number, db: Database, bot: TelegramBot) => {
    const user = transferredUser ?? await getUser(chatId, db);

    if (!tableData || !user) {
        await bot.sendMessage(chatId, user?.groupNumber && user?.faculty ? `Не удалось получить расписание для группы *${user?.groupNumber}* факультета *${user?.faculty}*` : `Не удалось получить данные пользователя, напишите /start для повторного создания`, {
            parse_mode: "MarkdownV2",
            reply_markup: buttons.repeat,
        });

        return;
    }

    await updateUser({
        ...user,
        tableData,
    }, db);

    const table = getTableMessageData(user, tableData, "Пн", 0);

    if (!table) {
        await updateUser({
            chatId: user.chatId,
            faculty: null,
            groupNumber: null,
            tableData: null,
        }, db);

        await bot.sendMessage(user.chatId, 'Не удалось загрузить данные, попробуйте снова')

        await onStart(message, db, bot);

        return;
    }

    await bot.sendMessage(chatId, `${table.tableHead}${table.scheduleForDay}`, {
        parse_mode: "MarkdownV2",
        reply_markup: table.inlineKeyboard,
    });

}
