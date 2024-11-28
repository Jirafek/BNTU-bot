

export type TUser = {
    chatId: number;
    username?: string | undefined;
    firstName?: string | undefined;
    usingName?: string | undefined;
    faculty?: string | null;
    groupNumber?: number | null;
    messagesToDelete?: number[];
    tableData?: TTab[] | null;
    weekNumber?: number | null;
    shortDay?: string | null;
}

export type TLesson = {
    time: string;
    subject: string;
    teacher: string;
    room: string;
    auditory: string;
}

export type TDaySchedule = {
    day: string;
    lessons: TLesson[];
}

export type TTab = {
    week: string;
    schedule: TDaySchedule[];
}
