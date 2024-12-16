export function getEasterDates(year: number) {
    // Meeus/Jones/Butcher algorithm
    const a = year % 19
    const b = Math.floor(year / 100)
    const c = year % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const month = Math.floor((h + l - 7 * m + 114) / 31)
    const day = ((h + l - 7 * m + 114) % 31) + 1

    return {
        easterSunday: { month, day },
        goodFriday: {
            month: month - (day - 2 < 1 ? 1 : 0),
            day: day - 2 <= 0 ? 31 + (day - 2) : day - 2
        },
        easterMonday: {
            month: month + (day + 1 > 31 ? 1 : 0),
            day: day + 1 > 31 ? 1 : day + 1
        }
    }
}

export function adjustForWeekendHolidays(holidays: any[], year: number) {
    return holidays.map(holiday => {
        const date = new Date(year, holiday.month - 1, holiday.day)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        
        return {
            ...holiday,
            isWeekend,
            alternateDay: isWeekend ? getNextWorkday(date) : null
        }
    })
}

function getNextWorkday(date: Date) {
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)
    
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 1)
    }
    
    return {
        month: nextDay.getMonth() + 1,
        day: nextDay.getDate()
    }
}