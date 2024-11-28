import {TTab, TUser} from "../types";
import {getFullDayName} from "./get-full-day-name";
import {buttonsFn} from "../common/buttons";
import {clearText} from "./clear-text";
import TelegramBot from "node-telegram-bot-api";
import {Database} from "firebase/database";
import {updateUser} from "../firebase/update-user";
import {onStart} from "../onHandlers/onStart";


export const getTableMessageData = (user: TUser, tableData: TTab[], shortDay?: TUser["shortDay"], weekNumber?: TUser["weekNumber"]) => {

    if (!user.faculty || !user.groupNumber) {
        return null;
    }

    const fullDayName = getFullDayName(shortDay ?? "Пн");
    const inlineKeyboard = buttonsFn.table(fullDayName ?? "Понедельник", tableData[weekNumber ?? 0]?.week, tableData.map(d => d.week));

    const tableHead = `Расписание *${user.faculty?.toUpperCase()}* *${user.groupNumber}* 🪧\n\n`
    const scheduleForDay = tableData[weekNumber ?? 0]?.schedule ? tableData[weekNumber ?? 0]?.schedule.find(d => d.day === fullDayName)?.lessons.map(lesson => `*${clearText(lesson.time)}* \\- ${clearText(lesson.subject)}\n${clearText(lesson.teacher)}\n${clearText(lesson.room)} \\- ${clearText(lesson.auditory)}`).join("\n\n") : null;

    return {
        inlineKeyboard,
        tableHead,
        scheduleForDay: scheduleForDay ?? 'Нет данных',
    }

}

export const rebuildTableMessage = async (message: TelegramBot.Message, user: TUser, tableData: TTab[], db: Database, bot: TelegramBot, shortDay?: TUser["shortDay"], weekNumber?: TUser["weekNumber"]) => {

    const table = getTableMessageData(user, tableData, shortDay, weekNumber);

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

    try {

        await bot.editMessageText(`${table.tableHead}${table.scheduleForDay}`, {
            parse_mode: "MarkdownV2",
            reply_markup: table.inlineKeyboard,
            chat_id: user.chatId,
            message_id: message.message_id,
        })
    } catch (e) {
    }
}
