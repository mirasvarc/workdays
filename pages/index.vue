<template>
  <div class="max-w-3xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome</h1>
      <p class="text-gray-500 text-sm">Pick a tool to get started.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="tool in tools"
        :key="tool.to"
        :to="tool.to"
        class="group flex flex-col gap-3 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary hover:shadow-sm transition-all"
      >
        <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon :name="tool.icon" class="w-5 h-5 text-primary" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-primary transition-colors">{{ tool.label }}</p>
          <p class="text-xs text-gray-500 leading-relaxed">{{ tool.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Dev Tools' })

const tools = [
  {
    label: 'Workdays Calculator',
    description: 'Calculate working days in a month including public holidays and personal days off. Supports Czech Republic and Slovakia.',
    to: '/workdays',
    icon: 'i-heroicons-calendar-days',
  },
]
</script>
