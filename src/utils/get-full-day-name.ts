import {weekDays} from "../constants";


export const getFullDayName = (shortDayName: typeof weekDays[keyof typeof weekDays]) => {
    return Object.entries(weekDays).find(([_, short]) => short.toLowerCase() === shortDayName.toLowerCase())?.[0] as keyof typeof weekDays | undefined;
}
