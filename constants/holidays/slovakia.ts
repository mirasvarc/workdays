import { getEasterDates } from '../../utils/publicHolidaysCalculations'

export const slovakFixedHolidays = [
    { name: "New Year's Day", month: 1, day: 1 },
    { name: "Epiphany", month: 1, day: 6 },
    { name: "Labor Day", month: 5, day: 1 },
    { name: "Victory in Europe Day", month: 5, day: 8 },
    { name: "Saints Cyril and Methodius Day", month: 7, day: 5 },
    { name: "Slovak National Uprising Day", month: 8, day: 29 },
    { name: "Day of the Constitution", month: 9, day: 1 },
    { name: "Our Lady of Sorrows", month: 9, day: 15 },
    { name: "All Saints' Day", month: 11, day: 1 },
    { name: "Struggle for Freedom and Democracy Day", month: 11, day: 17 },
    { name: "Christmas Eve", month: 12, day: 24 },
    { name: "Christmas Day", month: 12, day: 25 },
    { name: "St. Stephen's Day", month: 12, day: 26 },
]

export function getSlovakHolidaysForYear(year: number) {
    const easterDates = getEasterDates(year)
    
    const allHolidays = [
        ...slovakFixedHolidays,
        { name: "Good Friday", ...easterDates.goodFriday },
        { name: "Easter Monday", ...easterDates.easterMonday }
    ]

    return allHolidays.sort((a, b) => {
        if (a.month === b.month) {
            return a.day - b.day
        }
        return a.month - b.month
    })
}