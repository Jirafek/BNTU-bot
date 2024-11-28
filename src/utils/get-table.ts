import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import {TDaySchedule, TLesson, TTab} from "../types";

export const getTable = async (faculty: string, groupNumber: number): Promise<TTab[] | null> => {
    try {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        const url = `https://bntu.by/raspisanie/${faculty}/table`;

        const response = await axios.get(url, {
            headers: {
                Cookie: `group=${groupNumber}`
            },
            timeout: 10000,
            httpsAgent
        });

        if (response.status !== 200) {
            return null;
        }

        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const result: TTab[] = [];

        $('.sheduleTable').each((i, table) => {
            const weekSchedule: TDaySchedule[] = [];
            let oneSchedule: TDaySchedule = {
                day: '',
                lessons: []
            };

            $(table).find("tr").each((rowIndex, row) => {
                if (rowIndex === 0) return; // Пропускаем заголовок таблицы

                let lessonsNames: (keyof TLesson)[] = ["time", "subject", "teacher", "room", "auditory"];
                const lesson = {} as TLesson;
                let lessonIndex = 0;

                $(row).find("td").each((cellIndex, cell) => {
                    const classes = $(cell).attr('class') ?? "";
                    if (classes.includes("newDay")) {
                        const newDay = $(cell).text().trim();
                        if (oneSchedule.lessons.length > 0) {
                            weekSchedule.push(oneSchedule);
                        }
                        oneSchedule = {
                            day: newDay,
                            lessons: []
                        };
                        return;
                    }

                    const attrName = lessonsNames[lessonIndex];
                    const data = $(cell).text().trim();

                    lesson[attrName] = attrName !== "teacher" ? data : data.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

                    lessonIndex++;
                });

                if (lesson.time) {
                    oneSchedule.lessons.push(lesson);
                }
            });

            if (oneSchedule.lessons.length > 0) {
                weekSchedule.push(oneSchedule);
            }

            result.push({
                week: `Неделя ${i + 1}`,
                schedule: weekSchedule
            });
        });

        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
};

