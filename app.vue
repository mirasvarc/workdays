<template>
  <div class="flex flex-col justify-between min-h-screen mx-auto">
    <div class="container mx-auto p-4 mt-2">
      <h1 class="text-2xl font-bold mb-2">Working days calculator</h1>
      <p class="text-sm text-gray-500 mb-6">Calculate working days including holidays and personal time off.</p>

      <div class="alert alert-info mb-4 flex flex-row items-center gap-2">
        <Icon name="heroicons:exclamation-triangle" style="color: black; width: 20px; height: 20px;" />

        <p>
          Only for Czech Republic and Slovakia yet. More countries coming soon.
        </p>
      </div>

      <div class="mb-4 flex flex-col">
        <label class="block mb-2">Select country:</label>
        <select v-model="selectedCountry" class="border p-2 rounded">
          <option value="czech">Czechia</option>
          <option value="slovakia">Slovakia</option>
        </select>
      </div>

      <div class="mb-4 flex flex-col">
        <label class="block mb-2">Select month and year:</label>
        <input type="month" v-model="selectedDate" class="border p-2 rounded">
      </div>

      <div class="mb-4 flex flex-col">
        <label class="block mb-2">Other days off:</label>
        <input type="number" v-model="daysOff" min="0" max="31" class="border p-2 rounded"
          @input="validateInput('daysOff')">
      </div>

      <div class="mt-6 p-4 bg-gray-100 rounded">
        <h2 class="font-bold mb-2">Results:</h2>
        <p>Total
          days in month: {{ totalDays }}</p>
        <p>Weekend days: {{ weekendDays }}</p>
        <p>Holidays: {{ monthHolidays.length }}</p>
        <div v-if="monthHolidays.length" class="ml-4 mt-2 mb-2 text-sm">
          <div v-for="holiday in monthHolidays" :key="holiday.name">
            - {{ holiday.name }} ({{ holiday.day }}.{{ holiday.month }})
            <span v-if="holiday.isWeekend" class="text-red-500">
              (Falls on weekend)
            </span>
          </div>
        </div>
        <p>Days off: {{ daysOff }}</p>
        <p class="font-bold mt-2">Working days: {{ workingDays }}</p>
      </div>

      <!-- Export button -->
      <button @click="exportData" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Export Results to JSON
      </button>
    </div>

    <Footer />
  </div>
</template>

<script setup>

useHead({
  title: 'Working days calculator',
  meta: [
    { name: 'description', content: 'Calculate working days including holidays and personal time off.' },
    { name: 'keywords', content: 'working days, holidays, personal time off, calculator, pracovní dny, pracovní doba, pracovní volno, kalkulačka pracovních dní, pracovni dny, pracovni doba, kalkulacka pracovnih dni' },
    { name: 'author', content: 'Miroslav Švarc' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://workingdays.svarc.dev' },
  ],
})

useSeoMeta({
  title: 'Working days calculator',
  ogTitle: 'Working days calculator',
  description: 'Calculate working days including holidays and personal time off.',
  ogDescription: 'Calculate working days including holidays and personal time off.',
  ogImage: '/favicon.ico',
  ogUrl: 'https://workingdays.svarc.dev',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'Working days calculator',
  twitterDescription: 'Calculate working days including holidays and personal time off.',
})

import { ref, computed, watch } from 'vue'
import { adjustForWeekendHolidays } from './utils/publicHolidaysCalculations'
import { getCzechHolidaysForYear, getSlovakHolidaysForYear } from './constants/holidays'

// State
const selectedDate = ref(new Date().toISOString().slice(0, 7))
const daysOff = ref(0)
const selectedCountry = ref('czech')
// Load saved data from localStorage
onMounted(() => {
  const savedData = localStorage.getItem('workingDaysData')
  if (savedData) {
    const data = JSON.parse(savedData)
    selectedDate.value = data.selectedDate
    daysOff.value = data.daysOff
  }
})

// Save data to localStorage when it changes
watch([selectedDate, daysOff], () => {
  localStorage.setItem('workingDaysData', JSON.stringify({
    selectedDate: selectedDate.value,
    daysOff: daysOff.value
  }))
})

const getHolidaysForYear = (year) => {
  switch (selectedCountry.value) {
    case 'czech':
      return getCzechHolidaysForYear(year)
    case 'slovakia':
      return getSlovakHolidaysForYear(year)
  }
}


// Input validation
const validateInput = (field) => {
  const value = parseInt(field === 'sickDays' ? sickDays.value : daysOff.value)
  if (isNaN(value) || value < 0) {
    if (field === 'sickDays') {
      sickDays.value = 0
    } else {
      daysOff.value = 0
    }
  } else if (value > totalDays.value) {
    if (field === 'sickDays') {
      sickDays.value = totalDays.value
    } else {
      daysOff.value = totalDays.value
    }
  }
}

// Computed properties
const totalDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  return new Date(year, month, 0).getDate()
})

const monthHolidays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  const yearHolidays = getHolidaysForYear(parseInt(year))
  const adjustedHolidays = adjustForWeekendHolidays(yearHolidays, parseInt(year))
  return adjustedHolidays.filter(holiday => holiday.month === parseInt(month))
})

const weekendDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  let count = 0

  for (let day = 1; day <= totalDays.value; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() === 0 || date.getDay() === 6) {
      count++
    }
  }

  return count
})

const workingDays = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  const adjustedHolidays = monthHolidays.value.filter(holiday => !holiday.isWeekend).length

  let alternateHolidaysInMonth = 0
  if (selectedCountry.value !== 'czech') {
    alternateHolidaysInMonth = monthHolidays.value
      .filter(holiday => holiday.isWeekend &&
        holiday.alternateDay.month === parseInt(month))
      .length
  }

  return totalDays.value - weekendDays.value - adjustedHolidays -
    alternateHolidaysInMonth - parseInt(daysOff.value || 0)
})


// Export functionality
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
}
</script>

<style>
/* Add these styles if you're not using Tailwind CSS */
.container {
  max-width: 600px;
  margin: 0 auto;
}
</style>