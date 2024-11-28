import TelegramBot from "node-telegram-bot-api";
import {Database} from "firebase/database";
import {updateUser} from "../firebase/update-user";
import {TUser} from "../types";
import {getTable} from "./get-table";
import {processTableMessage} from "./process-table-message";


export const getGroupNumber = async (originalMsg: TelegramBot.Message, db: Database, bot: TelegramBot, messagesToDelete: number[]) => {
    const originalChatId = originalMsg.chat.id;

    const setOnce = () => {
        bot.once("message", async (onceMsg) => {
            const onceChatId = onceMsg.chat.id;

            if (originalChatId !== onceChatId) {
                return setOnce();
            }

            const groupNumber = onceMsg.text ?? "";

            if (!/^\d+$/.test(groupNumber)) {
                await bot.sendMessage(originalChatId, "Номер группы состоит только из чисел, попробуйте еще раз");
                return setOnce();
            }

            try {
                messagesToDelete.forEach(
                    (msgId) => bot.deleteMessage(originalChatId, msgId)
                )
            } catch (e) {
            }

            const user = await updateUser({
                chatId: originalChatId,
                groupNumber: +groupNumber,
                messagesToDelete: [],
            }, db, true);

            const tableData = await getTable(user?.faculty!, user?.groupNumber!);

            await processTableMessage(onceMsg, tableData, user, originalChatId, db, bot);
        })
    }

    setOnce();

}
