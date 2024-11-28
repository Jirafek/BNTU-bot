import {child, Database, get, ref} from "firebase/database";
import {TUser} from "../types";


export const getUser = async (chatId: number, db: Database) => {
    const userSnapshot = await get(child(ref(db), `users/${chatId}`));

    return userSnapshot.exists() ? userSnapshot.val() as TUser : null;
}
