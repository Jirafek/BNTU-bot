import {InlineKeyboardMarkup} from "node-telegram-bot-api";
import {weekDays} from "../constants";

type TButtonKeys = "welcome" | "repeat" | "main"

type TButtons = {
    [key in TButtonKeys]: InlineKeyboardMarkup
}

export const buttons: TButtons = {
    welcome: {
        inline_keyboard: [
            [
                {text: 'АТФ', callback_data: 'course_atf'},
                {text: 'ФГДИЭ', callback_data: 'course_fgde'},
            ],
            [
                {text: 'МСФ', callback_data: 'course_msf'},
                {text: 'МТФ', callback_data: 'course_mtf'},
            ],
            [
                {text: 'ФММП', callback_data: 'course_fmmp'},
                {text: 'ЭФ', callback_data: 'course_ef'},
            ],
            [
                {text: 'ФИТР', callback_data: 'course_fitr'},
                {text: 'ФТУГ', callback_data: 'course_ftug'},
            ],
            [
                {text: 'ИПФ', callback_data: 'course_ipf'},
                {text: 'ФЭС', callback_data: 'course_fes'},
            ],
            [
                {text: 'АФ', callback_data: 'course_af'},
                {text: 'СФ', callback_data: 'course_sf'},
            ],
            [
                {text: 'ПСФ', callback_data: 'course_psf'},
                {text: 'ФТК', callback_data: 'course_ftk'},
            ],
            [
                {text: 'ВТФ', callback_data: 'course_vtf'},
                {text: 'СТФ', callback_data: 'course_stf'},
            ],
        ]
    },
    repeat: {
        inline_keyboard: [
            [
                {text: 'Изменить факультет', callback_data: 'change_faculty'},
            ],
            [
                {text: 'Изменить номер группы', callback_data: 'change_group'},
            ],
            [
                {text: 'Попробовать снова', callback_data: 'change_repeat'},
            ]
        ]
    },
    main: {
        inline_keyboard: [
            [
                {text: 'Получить расписание 🪧', callback_data: 'get_schedule'},
            ],
            [
                {text: 'Изменить факультет/группу 💊', callback_data: 'change_faculty'},
            ],
            [
                {text: 'Взглянуть на код 👁', url: 'https://github.com/Jirafek/BNTU-bot'},
            ],
            [
                {text: 'Экспорт данных о вас 💾', callback_data: 'export_user'},
            ],
        ]
    }
}

export const buttonsFn = {
    table(
        activeDay: keyof typeof weekDays,
        activeWeek: string,
        weeks: string[]
    ): InlineKeyboardMarkup {
        const dayButtons = Object.entries(weekDays).map(([day, short]) => ({
            text: `${short}${activeDay === day ? " ✔️" : ""}`,
            callback_data: `getDay_${short.toLowerCase()}`
        }));

        const inline_keyboard: { text: string; callback_data: string }[][] = [];
        for (let i = 0; i < dayButtons.length; i += 3) {
            inline_keyboard.push(dayButtons.slice(i, i + 3));
        }

        const weekButtons = weeks.map((week) => ({
            text: `${week}${activeWeek === week ? " ✔️" : ""}`,
            callback_data: `getWeek_${week.split(" ")[1]}`
        }));

        for (let i = 0; i < weekButtons.length; i += 2) {
            inline_keyboard.push(weekButtons.slice(i, i + 2));
        }

        inline_keyboard.push([
            {text: 'Домой 🏠', callback_data: 'main'}
        ])

        return {inline_keyboard};
    },
};
