<template>
  <div class="max-w-4xl">

    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-primary" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Workdays Calculator</h1>
      </div>
      <p class="text-sm text-gray-500 ml-11">Calculate working days including public holidays and personal time off.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

      <!-- Inputs -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Parameters</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">Country</label>
              <USelect v-model="selectedCountryValue" :items="countryOptions" class="w-full" />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">Month & year</label>
              <input
                type="month"
                v-model="selectedDate"
                class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">Personal days off</label>
              <UInput type="number" v-model="daysOff" min="0" :max="totalDays" @input="validateInput" class="w-full" />
            </div>
          </div>
        </div>

        <UAlert
          icon="i-heroicons-information-circle"
          color="info"
          variant="soft"
          description="Currently supports Czech Republic and Slovakia. More countries coming soon."
        />
      </div>

      <!-- Results -->
      <div class="lg:col-span-3 flex flex-col gap-4">

        <!-- Big working days number -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Result</p>
          <div class="flex items-end gap-3 mb-4">
            <span class="text-6xl font-bold text-gray-900 dark:text-white leading-none">{{ workingDays }}</span>
            <span class="text-lg text-gray-400 mb-1">working days</span>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
              <p class="text-xs text-gray-400 mb-0.5">Total days</p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ totalDays }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
              <p class="text-xs text-gray-400 mb-0.5">Weekends</p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ weekendDays }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
              <p class="text-xs text-gray-400 mb-0.5">Public holidays</p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ monthHolidays.length }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
              <p class="text-xs text-gray-400 mb-0.5">Days off</p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ daysOff }}</p>
            </div>
          </div>
        </div>

        <!-- Holiday list -->
        <div v-if="monthHolidays.length" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Public holidays this month</p>
          <ul class="space-y-2">
            <li
              v-for="holiday in monthHolidays"
              :key="holiday.name"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ holiday.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs">{{ holiday.day }}.{{ holiday.month }}.</span>
                <UBadge v-if="holiday.isWeekend" color="warning" variant="soft" size="xs">weekend</UBadge>
              </div>
            </li>
          </ul>
        </div>

        <!-- Export -->
        <div class="flex gap-2">
          <UButton @click="exportData" color="neutral" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm">
            JSON
          </UButton>
          <UButton @click="exportCsv" color="neutral" variant="outline" icon="i-heroicons-table-cells" size="sm">
            CSV
          </UButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { adjustForWeekendHolidays } from '~/utils/publicHolidaysCalculations'
import { getCzechHolidaysForYear, getSlovakHolidaysForYear } from '~/constants/holidays'

useHead({
  title: 'Workdays Calculator',
  meta: [
    { name: 'description', content: 'Calculate working days including holidays and personal time off.' },
    { name: 'keywords', content: 'working days, holidays, personal time off, calculator, pracovní dny, pracovní doba, pracovní volno, kalkulačka pracovních dní, pracovni dny, pracovni doba, kalkulacka pracovnih dni' },
    { name: 'author', content: 'Miroslav Švarc' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://workingdays.svarc.dev/workdays' },
  ],
})

useSeoMeta({
  title: 'Workdays Calculator',
  ogTitle: 'Workdays Calculator',
  description: 'Calculate working days including holidays and personal time off.',
  ogDescription: 'Calculate working days including holidays and personal time off.',
  ogImage: '/favicon.ico',
  ogUrl: 'https://workingdays.svarc.dev/workdays',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'Workdays Calculator',
  twitterDescription: 'Calculate working days including holidays and personal time off.',
})

const { proxy } = useScriptGoogleAnalytics()

const countryOptions = [
  { label: 'Czechia', value: 'czech' },
  { label: 'Slovakia', value: 'slovakia' },
]

const selectedDate = ref(new Date().toISOString().slice(0, 7))
const daysOff = ref(0)
const selectedCountry = ref('czech')

const selectedCountryValue = computed({
  get: () => countryOptions.find(o => o.value === selectedCountry.value) ?? countryOptions[0],
  set: (val) => { selectedCountry.value = typeof val === 'object' ? val.value : val }
})

onMounted(() => {
  const savedData = localStorage.getItem('workingDaysData')
  if (savedData) {
    const data = JSON.parse(savedData)
    selectedDate.value = data.selectedDate
    daysOff.value = data.daysOff
    if (data.selectedCountry) selectedCountry.value = data.selectedCountry
  }
})

watch([selectedDate, daysOff, selectedCountry], () => {
  localStorage.setItem('workingDaysData', JSON.stringify({
    selectedDate: selectedDate.value,
    daysOff: daysOff.value,
    selectedCountry: selectedCountry.value
  }))
  proxy.gtag('event', 'date_selected')
})

watch(selectedCountry, () => { proxy.gtag('event', 'country_selected') })
watch(daysOff, () => { proxy.gtag('event', 'days_off_selected') })

const getHolidaysForYear = (year) => {
  switch (selectedCountry.value) {
    case 'czech': return getCzechHolidaysForYear(year)
    case 'slovakia': return getSlovakHolidaysForYear(year)
  }
}

const validateInput = () => {
  const value = parseInt(daysOff.value)
  if (isNaN(value) || value < 0) daysOff.value = 0
  else if (value > totalDays.value) daysOff.value = totalDays.value
}

const totalDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  return new Date(year, month, 0).getDate()
})

const monthHolidays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  const yearHolidays = getHolidaysForYear(parseInt(year))
  const adjustedHolidays = adjustForWeekendHolidays(yearHolidays, parseInt(year))
  return adjustedHolidays.filter(h => h.month === parseInt(month))
})

const weekendDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  let count = 0
  for (let day = 1; day <= totalDays.value; day++) {
    const d = new Date(year, month - 1, day)
    if (d.getDay() === 0 || d.getDay() === 6) count++
  }
  return count
})

const workingDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  const adjustedHolidays = monthHolidays.value.filter(h => !h.isWeekend).length
  let alternateHolidaysInMonth = 0
  if (selectedCountry.value !== 'czech') {
    alternateHolidaysInMonth = monthHolidays.value
      .filter(h => h.isWeekend && h.alternateDay.month === parseInt(month)).length
  }
  return totalDays.value - weekendDays.value - adjustedHolidays -
    alternateHolidaysInMonth - parseInt(daysOff.value || 0)
})

const exportData = () => {
  const data = {
    date: selectedDate.value,
    totalDays: totalDays.value,
    weekendDays: weekendDays.value,
    holidays: monthHolidays.value,
    daysOff: daysOff.value,
    workingDays: workingDays.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `working-days-${selectedDate.value}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  proxy.gtag('event', 'export_data')
}

const exportCsv = () => {
  const holidayRows = monthHolidays.value.map(h =>
    `${h.day}.${h.month},${h.name},${h.isWeekend ? 'yes' : 'no'}`
  ).join('\n')
  const csv = [
    'Date,Total Days,Weekend Days,Holidays,Days Off,Working Days',
    `${selectedDate.value},${totalDays.value},${weekendDays.value},${monthHolidays.value.length},${daysOff.value},${workingDays.value}`,
    '',
    'Holiday Date,Holiday Name,Falls on Weekend',
    holidayRows
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `working-days-${selectedDate.value}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  proxy.gtag('event', 'export_data_csv')
}
</script>
