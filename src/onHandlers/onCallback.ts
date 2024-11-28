import TelegramBot from "node-telegram-bot-api";
import {Database} from "firebase/database";
import {messagesFn} from "../common/messages";
import {updateUser} from "../firebase/update-user";
import {getGroupNumber} from "../utils/get-group-number";
import {getUser} from "../firebase/get-user";
import {onStart} from "./onStart";
import {getTable} from "../utils/get-table";
import {processTableMessage} from "../utils/process-table-message";
import {weekDays} from "../constants";
import {rebuildTableMessage} from "../utils/rebuild-table-message";
import {clearText} from "../utils/clear-text";
import {onMain} from "./onMain";


export const onCallback = async (query: TelegramBot.CallbackQuery, db: Database, bot: TelegramBot) => {
    const {data, message} = query;
    const chatId = message?.chat.id;
    const messageId = message?.message_id;

    if (!chatId || !messageId) return;

    const user = await getUser(chatId, db);

    if (!user) {
        await onStart(message, db, bot);
        return;
    }

    if (data === 'main') {
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (e) {}

        await onMain(message, db, bot);
    } else if (data?.startsWith('course_')) {
        const course = data.split('_')[1];

        await bot.editMessageReplyMarkup({
            inline_keyboard: []
        }, {
            chat_id: chatId,
            message_id: messageId
        }).catch(err => console.log(err));

        const message = await bot.sendMessage(chatId, messagesFn.courseChosen(course), {
            parse_mode: "MarkdownV2"
        });

        const messagesToDelete = [...(user?.messagesToDelete ?? []), message.message_id];

        await updateUser({
            faculty: course,
            chatId: chatId,
            weekNumber: null,
            shortDay: null,
            messagesToDelete: messagesToDelete
        }, db);

        await getGroupNumber(message, db, bot, messagesToDelete);
    } else if (data?.startsWith('change_')) {

        try {
            await bot.editMessageReplyMarkup({
                inline_keyboard: []
            }, {
                chat_id: chatId,
                message_id: messageId
            })
        } catch (e) {
        }

        const changeOption = data.split('_')[1] as "faculty" | "group" | "repeat";

        if (changeOption === "faculty") {
            await onStart(message, db, bot);
        } else if (changeOption === "group") {
            await getGroupNumber(message, db, bot, user?.messagesToDelete ?? []);
        } else {
            if (!user?.faculty || !user?.groupNumber) {
                await onStart(message, db, bot);
                return;
            }

            const tableData = await getTable(user.faculty, user.groupNumber);

            await processTableMessage(message, tableData, user ?? undefined, chatId, db, bot);
        }
    } else if (data?.startsWith('getDay_')) {
        const shortDay = data.split('_')[1] as typeof weekDays[keyof typeof weekDays];

        await updateUser({
            shortDay,
            chatId,
        }, db);

        let tableData = user.tableData;

        if (!user?.faculty || !user?.groupNumber) {
            await onStart(message, db, bot);
            return;
        }

        if (!tableData) {
            tableData = await getTable(user.faculty, user.groupNumber);

            await updateUser({
                ...user,
                tableData,
            }, db);
        }


        await rebuildTableMessage(message, user, tableData!, db, bot, shortDay, user.weekNumber);

    } else if (data?.startsWith('getWeek_')) {
        const weekNumber = +data.split('_')[1] - 1;

        await updateUser({
            weekNumber,
            chatId,
        }, db);

        await rebuildTableMessage(message, user, user.tableData!, db, bot, user.shortDay, weekNumber);
    } else if (data?.startsWith('get_')) {
        const getter = data.split('_')[1];

        if (getter === "schedule") {
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {
            }

            if (!user?.faculty || !user?.groupNumber) {
                await onStart(message, db, bot);
                return;
            }

            const tableData = await getTable(user.faculty, user.groupNumber);

            await processTableMessage(message, tableData, user ?? undefined, chatId, db, bot);
        }
    } else if (data?.startsWith('export_')) {
        const exportType = data.split('_')[1];

        if (exportType === "user") {
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {
            }

            try {
                await bot.sendMessage(chatId, `Данные на *${chatId}*:\n\n${clearText(JSON.stringify({
                    ...user,
                    tableData: undefined,
                }, null, 4))}`, {
                    parse_mode: "MarkdownV2"
                });
            } catch (e) {
            }
        }
    }
}
