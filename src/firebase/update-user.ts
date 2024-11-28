import {TUser} from "../types";
import {Database} from "firebase/database";
import {ref, update} from "firebase/database";
import {getUser} from "./get-user";


export const updateUser = async (user: Partial<TUser> & { chatId: number }, db: Database, returnUser?: boolean) => {
    const currentUserData = await getUser(user.chatId, db);
    const dataToUpdate = {...(currentUserData ?? {}), ...user}

    const updates: { [key: string]: Partial<TUser> } = {};

    updates['/users/' + user.chatId] = dataToUpdate;

    try {
        await update(ref(db), updates);

        if (returnUser) {
            return dataToUpdate;
        }
    } catch (e) {
        console.error(e);

        if (returnUser) {
            return undefined;
        }
    }

}
