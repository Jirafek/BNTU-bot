export const clearText = (text: string) => {
    const symbols = /[_*[\]()~`>#\+\-=|{}.!]/g

    return text.replace(symbols, match => `\\${match}`)
}