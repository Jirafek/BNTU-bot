

export const messagesFn = {
    welcome: () => `Привет\\! 👋🏻\nРасписание всех групп и курсов в *БНТУ*\n\nЧтобы продолжить выбери свой факультет ниже\n👇🏻👇🏻👇🏻`,
    courseChosen: (course: string) => `Факультет \\- *${course.toUpperCase()}*\n\nВведите номер вашей группы`,
}
