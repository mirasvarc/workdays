import { getEasterDates } from '../../utils/publicHolidaysCalculations'

// Fixed holidays
export const czechFixedHolidays = [
  { name: "New Year's Day", month: 1, day: 1 },
  { name: "Labor Day", month: 5, day: 1 },
  { name: "Victory in Europe Day", month: 5, day: 8 },
  { name: "Saints Cyril and Methodius Day", month: 7, day: 5 },
  { name: "Jan Hus Day", month: 7, day: 6 },
  { name: "St. Wenceslas Day", month: 9, day: 28 },
  { name: "Independent Czechoslovak State Day", month: 10, day: 28 },
  { name: "Struggle for Freedom and Democracy Day", month: 11, day: 17 },
  { name: "Christmas Eve", month: 12, day: 24 },
  { name: "Christmas Day", month: 12, day: 25 },
  { name: "St. Stephen's Day", month: 12, day: 26 }
]

export function getCzechHolidaysForYear(year: number) {
    const easterDates = getEasterDates(year)
    
    const allHolidays = [
        ...czechFixedHolidays,
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